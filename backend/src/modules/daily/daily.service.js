const { getPool } = require('../../config/database');
const gamificationService = require('../gamification/gamification.service');

const DAILY_TASK_COUNT = 3;
const DAILY_TASK_REWARDS = {
  daily_login: 10,
  listening_lesson: 20,
  speaking_lesson: 25,
  reading_lesson: 20,
  writing_lesson: 25,
  game_level: 15,
  vocabulary_review: 10,
  grammar_topic: 15,
  default: 10
};

let schemaReady = false;

function getSaigonDate() {
  return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function safeString(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function shapeTask(row) {
  const targetType = row.targettype || row.TargetType;
  const targetId = row.targetid || row.TargetId;
  const status = row.status || row.Status || 'pending';
  const urlByType = {
    daily_login: '/daily-tasks',
    writing_lesson: `/writing/lessons/${targetId}`,
    speaking_lesson: `/speaking/lessons/${targetId}`,
    listening_lesson: `/listening/lessons/${targetId}`,
    reading_lesson: `/reading/lessons/${targetId}`,
    grammar_topic: `/grammar?topicId=${targetId}`,
    game_level: `/games/play/${targetId}`,
    vocabulary_review: '/vocabulary'
  };

  return {
    id: row.id || row.Id,
    taskDate: row.taskdate || row.TaskDate,
    skill: row.skill || row.Skill,
    targetType,
    targetId,
    title: row.title || row.Title,
    description: row.description || row.Description || '',
    reason: row.reason || row.Reason || '',
    status,
    orderIndex: row.orderindex ?? row.OrderIndex ?? 0,
    aiRationale: row.airationale || row.AiRationale || '',
    completedAt: row.completedat || row.CompletedAt || null,
    url: urlByType[targetType] || '/dashboard',
    rewardExp: Number(row.rewardexp || row.RewardExp || DAILY_TASK_REWARDS[targetType] || DAILY_TASK_REWARDS.default)
  };
}

async function ensureInsightsSchema() {
  if (schemaReady) return;
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS DailyTasks (
      Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      TaskDate DATE NOT NULL,
      Skill VARCHAR(40) NOT NULL,
      TargetType VARCHAR(80) NOT NULL,
      TargetId VARCHAR(120) NOT NULL,
      Title VARCHAR(255) NOT NULL,
      Description TEXT,
      Reason TEXT,
      Status VARCHAR(30) NOT NULL DEFAULT 'pending',
      OrderIndex INTEGER NOT NULL DEFAULT 0,
      AiRationale TEXT,
      RewardExp INTEGER NOT NULL DEFAULT 10,
      CompletedAt TIMESTAMP,
      CreatedAt TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query('ALTER TABLE DailyTasks ADD COLUMN IF NOT EXISTS RewardExp INTEGER NOT NULL DEFAULT 10');

  await pool.query('CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_date ON DailyTasks (UserId, TaskDate, OrderIndex)');
  await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS uq_daily_tasks_user_date_order ON DailyTasks (UserId, TaskDate, OrderIndex)');

  schemaReady = true;
}

function addCandidate(list, candidate) {
  if (!candidate.targetId) return;
  const targetType = candidate.targetType;
  const targetId = String(candidate.targetId);
  const id = `${targetType}:${targetId}`;
  if (list.some((item) => item.id === id)) return;

  list.push({
    id,
    targetType,
    targetId,
    skill: candidate.skill,
    title: safeString(candidate.title, 'Nhiệm vụ học tập').slice(0, 255),
    description: safeString(candidate.description),
    reasonSeed: safeString(candidate.reasonSeed || candidate.description || candidate.title)
  });
}

async function collectCandidateTargets(userId) {
  const pool = getPool();
  const candidates = [];

  const collectors = [
    async () => {
      const result = await pool.query(`
        SELECT l.Id, l.Title, l.Description, COALESCE(wp.Status, 'pending') AS Status
        FROM WritingLessons l
        LEFT JOIN WritingProgress wp ON wp.LessonId = l.Id AND wp.UserId = $1
        ORDER BY CASE WHEN wp.Status = 'completed' THEN 1 ELSE 0 END, l.OrderIndex ASC
        LIMIT 8
      `, [userId]);
      result.rows.forEach((row) => addCandidate(candidates, {
        skill: 'writing',
        targetType: 'writing_lesson',
        targetId: row.id,
        title: `Writing: ${row.title}`,
        description: row.description || 'Luyện viết lại câu và sửa lỗi ngữ pháp.',
        reasonSeed: 'Improve writing accuracy and grammar.'
      }));
    },
    async () => {
      const result = await pool.query(`
        SELECT l.Id, l.Title
        FROM SpeakingLessons l
        LEFT JOIN SpeakingProgress sp ON sp.LessonId = l.Id AND sp.UserId = $1
        ORDER BY CASE WHEN sp.Status = 'completed' THEN 1 ELSE 0 END, l.OrderIndex ASC
        LIMIT 8
      `, [userId]);
      result.rows.forEach((row) => addCandidate(candidates, {
        skill: 'speaking',
        targetType: 'speaking_lesson',
        targetId: row.id,
        title: `Speaking: ${row.title}`,
        description: 'Nghe mẫu và luyện nói lại các câu trọng tâm.',
        reasonSeed: 'Improve speaking accuracy and missing words.'
      }));
    },
    async () => {
      const result = await pool.query(`
        SELECT gt.Id, gt.Title, gt.TitleVI, gc.NameVI AS CategoryNameVI
        FROM GrammarTopics gt
        LEFT JOIN GrammarCategories gc ON gc.Id = gt.CategoryId
        ORDER BY gt.OrderIndex ASC, gt.Title ASC
        LIMIT 10
      `);
      result.rows.forEach((row) => addCandidate(candidates, {
        skill: 'grammar',
        targetType: 'grammar_topic',
        targetId: row.id,
        title: `Grammar: ${row.titlevi || row.title}`,
        description: row.categorynamevi ? `Ôn ${row.categorynamevi}.` : 'Ôn lý thuyết và làm quiz ngữ pháp.',
        reasonSeed: 'Fix repeated grammar mistakes.'
      }));
    },
    async () => {
      const result = await pool.query(`
        SELECT l.Id, l.Title, l.Topic, COALESCE(lp.Status, 'pending') AS Status
        FROM ListeningLessons l
        LEFT JOIN ListeningProgress lp ON lp.LessonId = l.Id AND lp.UserId = $1
        ORDER BY CASE WHEN lp.Status = 'completed' THEN 1 ELSE 0 END, l.OrderIndex ASC
        LIMIT 8
      `, [userId]);
      result.rows.forEach((row) => addCandidate(candidates, {
        skill: 'listening',
        targetType: 'listening_lesson',
        targetId: row.id,
        title: `Listening: ${row.title}`,
        description: row.topic ? `Luyện nghe chủ đề ${row.topic}.` : 'Luyện nghe và trả lời câu hỏi.',
        reasonSeed: 'Improve listening comprehension.'
      }));
    },
    async () => {
      const result = await pool.query(`
        SELECT l.Id, l.Title, l.Topic, COALESCE(rp.Status, 'pending') AS Status
        FROM ReadingLessons l
        LEFT JOIN ReadingProgress rp ON rp.LessonId = l.Id AND rp.UserId = $1
        ORDER BY CASE WHEN rp.Status = 'completed' THEN 1 ELSE 0 END, l.OrderIndex ASC
        LIMIT 8
      `, [userId]);
      result.rows.forEach((row) => addCandidate(candidates, {
        skill: 'reading',
        targetType: 'reading_lesson',
        targetId: row.id,
        title: `Reading: ${row.title}`,
        description: row.topic ? `Đọc hiểu chủ đề ${row.topic}.` : 'Đọc bài và trả lời câu hỏi.',
        reasonSeed: 'Improve reading comprehension.'
      }));
    },
    async () => {
      const result = await pool.query(`
        SELECT gl.Id, gl.Name, gl.Difficulty, gs.Name AS SetName, COALESCE(ugp.IsCompleted, false) AS IsCompleted
        FROM GameLevels gl
        INNER JOIN GameSets gs ON gs.Id = gl.SetId
        LEFT JOIN UserGameProgress ugp ON ugp.LevelId = gl.Id AND ugp.UserId = $1
        ORDER BY COALESCE(ugp.IsCompleted, false) ASC, gl.LevelNumber ASC
        LIMIT 8
      `, [userId]);
      result.rows.forEach((row) => addCandidate(candidates, {
        skill: 'game',
        targetType: 'game_level',
        targetId: row.id,
        title: `Game: ${row.name}`,
        description: row.setname ? `${row.setname} - ${row.difficulty || 'practice'}` : 'Ôn tập nhanh bằng mini game.',
        reasonSeed: 'Review mistakes through quick games.'
      }));
    },
    async () => {
      const result = await pool.query(`
        SELECT ucw.Id,
               COALESCE(de.Word, ucw.CustomWord) AS Word,
               COALESCE(de.MeaningVI, ucw.CustomMeaning) AS Meaning,
               uc.Name AS CollectionName
        FROM UserCollectionWords ucw
        INNER JOIN UserCollections uc ON uc.Id = ucw.CollectionId
        LEFT JOIN DictionaryEntries de ON de.Id = ucw.DictionaryEntryId
        WHERE uc.UserId = $1
        ORDER BY ucw.AddedAt DESC
        LIMIT 6
      `, [userId]);
      result.rows.forEach((row) => addCandidate(candidates, {
        skill: 'vocabulary',
        targetType: 'vocabulary_review',
        targetId: row.id,
        title: `Vocabulary: ${row.word}`,
        description: row.meaning || row.collectionname || 'Ôn từ đã lưu trong bộ sưu tập.',
        reasonSeed: 'Review saved vocabulary.'
      }));
    },
    async () => {
      const result = await pool.query(`
        SELECT Id, Word
        FROM DictionarySearchHistory
        WHERE UserId = $1
        ORDER BY SearchedAt DESC
        LIMIT 5
      `, [userId]);
      result.rows.forEach((row) => addCandidate(candidates, {
        skill: 'vocabulary',
        targetType: 'vocabulary_review',
        targetId: row.id,
        title: `Vocabulary: ${row.word}`,
        description: 'Ôn lại từ bạn đã tra gần đây.',
        reasonSeed: 'Review recently searched vocabulary.'
      }));
    }
  ];

  for (const collect of collectors) {
    try {
      await collect();
    } catch (err) {
      console.warn('[daily] candidate collector skipped:', err.message);
    }
  }

  return candidates;
}

function getStarterTask() {
  return {
    id: 'daily_login:today',
    targetType: 'daily_login',
    targetId: 'today',
    skill: 'habit',
    title: 'Đăng nhập hôm nay',
    description: 'Mở hệ thống học tập để giữ nhịp học mỗi ngày.',
    reason: 'Nhiệm vụ khởi động nhanh, nhận EXP ngay khi hoàn thành.',
    aiRationale: 'habit',
    rewardExp: DAILY_TASK_REWARDS.daily_login
  };
}

function getTaskReason(targetType) {
  const reasons = {
    listening_lesson: 'Luyện nghe một bài ngắn để làm nóng khả năng phản xạ.',
    speaking_lesson: 'Nói vài câu mẫu để giữ nhịp phát âm mỗi ngày.',
    reading_lesson: 'Đọc một bài ngắn và trả lời câu hỏi để tăng vốn hiểu ngữ cảnh.',
    writing_lesson: 'Viết một vài câu để rèn cách diễn đạt tự nhiên hơn.',
    game_level: 'Ôn nhanh bằng mini game để giữ động lực học.',
    vocabulary_review: 'Ôn lại từ đã lưu để biến từ vựng thành trí nhớ dài hạn.',
    grammar_topic: 'Ôn một điểm ngữ pháp nhỏ để dùng câu chắc hơn.'
  };
  return reasons[targetType] || 'Một hoạt động học ngắn để duy trì tiến độ hôm nay.';
}

function buildDefaultDailyTasks(candidates) {
  const selected = [getStarterTask()];
  const preferredTypes = ['listening_lesson', 'speaking_lesson', 'reading_lesson', 'writing_lesson', 'game_level', 'vocabulary_review', 'grammar_topic'];
  const used = new Set(selected.map((task) => `${task.targetType}:${task.targetId}`));

  for (const targetType of preferredTypes) {
    const candidate = candidates.find((item) => item.targetType === targetType && !used.has(`${item.targetType}:${item.targetId}`));
    if (!candidate) continue;
    selected.push({
      ...candidate,
      reason: getTaskReason(candidate.targetType),
      aiRationale: 'daily_plan',
      rewardExp: DAILY_TASK_REWARDS[candidate.targetType] || DAILY_TASK_REWARDS.default
    });
    used.add(`${candidate.targetType}:${candidate.targetId}`);
    if (selected.length >= DAILY_TASK_COUNT) break;
  }

  return selected.slice(0, DAILY_TASK_COUNT);
}

async function insertDailyTasks(userId, taskDate, tasks) {
  const pool = getPool();
  await pool.query('DELETE FROM DailyTasks WHERE UserId = $1 AND TaskDate = $2', [userId, taskDate]);

  for (let index = 0; index < tasks.length; index += 1) {
    const task = tasks[index];
    await pool.query(`
      INSERT INTO DailyTasks (
        UserId, TaskDate, Skill, TargetType, TargetId, Title, Description, Reason, Status, OrderIndex, AiRationale, RewardExp
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10, $11)
    `, [
      userId,
      taskDate,
      task.skill,
      task.targetType,
      String(task.targetId),
      task.title,
      task.description,
      task.reason,
      index,
      task.aiRationale,
      task.rewardExp || DAILY_TASK_REWARDS[task.targetType] || DAILY_TASK_REWARDS.default
    ]);
  }

  const result = await pool.query(`
    SELECT *
    FROM DailyTasks
    WHERE UserId = $1 AND TaskDate = $2
    ORDER BY OrderIndex ASC
  `, [userId, taskDate]);

  return result.rows.map(shapeTask);
}

async function completeTaskById(userId, taskId) {
  const pool = getPool();
  const result = await pool.query(`
    UPDATE DailyTasks
    SET Status = 'completed',
        CompletedAt = COALESCE(CompletedAt, NOW())
    WHERE Id = $1 AND UserId = $2 AND Status <> 'completed'
    RETURNING *
  `, [taskId, userId]);

  if (!result.rows[0]) return null;
  const task = shapeTask(result.rows[0]);
  const expReward = await gamificationService.addExp(userId, task.rewardExp, `daily_task_${task.targetType}`);
  return { task, expReward };
}

async function autoCompleteLoginTask(userId, tasks) {
  const loginTask = tasks.find((task) => task.targetType === 'daily_login' && task.status !== 'completed');
  if (!loginTask) return { tasks, expReward: null };

  const completed = await completeTaskById(userId, loginTask.id);
  if (!completed?.task) return { tasks, expReward: null };

  return {
    tasks: tasks.map((task) => (task.id === completed.task.id ? completed.task : task)),
    expReward: completed.expReward
  };
}

const dailyService = {
  ensureInsightsSchema,
  getSaigonDate,

  async getToday(user) {
    await ensureInsightsSchema();
    const taskDate = getSaigonDate();

    const pool = getPool();
    const existing = await pool.query(`
      SELECT *
      FROM DailyTasks
      WHERE UserId = $1 AND TaskDate = $2
      ORDER BY OrderIndex ASC
    `, [user.id, taskDate]);

    if (existing.rows.some((row) => (row.targettype || row.TargetType) === 'daily_login')) {
      const shapedTasks = existing.rows.map(shapeTask);
      const completed = await autoCompleteLoginTask(user.id, shapedTasks);
      return {
        locked: false,
        taskDate,
        tasks: completed.tasks,
        expReward: completed.expReward
      };
    }

    const candidates = await collectCandidateTargets(user.id);
    const selected = buildDefaultDailyTasks(candidates);
    const tasks = await insertDailyTasks(user.id, taskDate, selected);
    const completed = await autoCompleteLoginTask(user.id, tasks);
    return { locked: false, taskDate, tasks: completed.tasks, expReward: completed.expReward };
  },

  async completeTask(userId, taskId) {
    await ensureInsightsSchema();
    return completeTaskById(userId, taskId);
  },

  async completeMatchingTasks(userId, targetType, targetId) {
    if (!userId || !targetType || !targetId) return [];
    await ensureInsightsSchema();
    const pool = getPool();
    const taskDate = getSaigonDate();
    const result = await pool.query(`
      UPDATE DailyTasks
      SET Status = 'completed',
          CompletedAt = COALESCE(CompletedAt, NOW())
      WHERE UserId = $1
        AND TaskDate = $2
        AND TargetType = $3
        AND TargetId = $4
        AND Status <> 'completed'
      RETURNING *
    `, [userId, taskDate, targetType, String(targetId)]);

    const completed = [];
    for (const row of result.rows) {
      const task = shapeTask(row);
      const expReward = await gamificationService.addExp(userId, task.rewardExp, `daily_task_${task.targetType}`);
      completed.push({ task, expReward });
    }

    return completed;
  }
};

module.exports = dailyService;
