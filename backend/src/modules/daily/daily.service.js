const { getPool } = require('../../config/database');
const gamificationService = require('../gamification/gamification.service');
const billingService = require('../billing/billing.service');
const spacedRepetitionService = require('../spaced-repetition/spaced-repetition.service');

const PLAN_VERSION = 2;
const DAILY_LEARNING_TASK_COUNT = 4;
const DAILY_DUE_TASK_TARGET = 2;
const DAILY_NEW_TASK_TARGET = 2;
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
  return spacedRepetitionService.getSaigonDate();
}

function safeString(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function toDateString(value) {
  if (!value) return null;
  if (typeof value === 'string') return value.slice(0, 10);
  if (value instanceof Date && !Number.isNaN(value.getTime())) return spacedRepetitionService.formatDueDate(value);
  return String(value).slice(0, 10);
}

function daysBetween(fromDate, toDate) {
  const from = new Date(`${fromDate}T00:00:00.000Z`);
  const to = new Date(`${toDate}T00:00:00.000Z`);
  return Math.max(0, Math.floor((to - from) / 86400000));
}

function shapeTask(row) {
  const targetType = row.targettype || row.TargetType;
  const targetId = row.targetid || row.TargetId;
  const status = row.status || row.Status || 'pending';
  const planVersion = Number(row.planversion || row.PlanVersion || 1);
  const dueDate = toDateString(row.duedate || row.DueDate);
  const today = getSaigonDate();
  const storedTaskMode = row.taskmode || row.TaskMode || (targetType === 'daily_login' ? 'habit' : 'new');
  const taskMode = targetType !== 'daily_login' && dueDate && dueDate < today
    ? 'review'
    : storedTaskMode;
  const overdueDays = taskMode === 'review' && dueDate ? daysBetween(dueDate, today) : 0;
  const urlByType = {
    daily_login: '/daily-tasks',
    writing_lesson: `/writing/lessons/${targetId}`,
    speaking_lesson: `/speaking/lessons/${targetId}`,
    listening_lesson: `/listening/lessons/${targetId}`,
    reading_lesson: `/reading/lessons/${targetId}`,
    grammar_topic: `/grammar?topicId=${targetId}`,
    game_level: `/games/play/${targetId}`,
    vocabulary_review: planVersion >= PLAN_VERSION
      ? `/vocabulary?collectionId=${targetId}&practice=1`
      : '/vocabulary'
  };

  return {
    id: row.id || row.Id,
    taskDate: toDateString(row.taskdate || row.TaskDate),
    skill: row.skill || row.Skill,
    targetType,
    targetId,
    title: row.title || row.Title,
    description: row.description || row.Description || '',
    status,
    orderIndex: row.orderindex ?? row.OrderIndex ?? 0,
    aiRationale: row.airationale || row.AiRationale || '',
    completedAt: row.completedat || row.CompletedAt || null,
    url: urlByType[targetType] || '/dashboard',
    rewardExp: Number(row.rewardexp || row.RewardExp || DAILY_TASK_REWARDS[targetType] || DAILY_TASK_REWARDS.default),
    planVersion,
    taskMode,
    dueDate,
    overdueDays
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
      Status VARCHAR(30) NOT NULL DEFAULT 'pending',
      OrderIndex INTEGER NOT NULL DEFAULT 0,
      AiRationale TEXT,
      RewardExp INTEGER NOT NULL DEFAULT 10,
      CompletedAt TIMESTAMPTZ,
      CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PlanVersion SMALLINT NOT NULL DEFAULT 1,
      TaskMode VARCHAR(20) NOT NULL DEFAULT 'new',
      DueDate DATE
    )
  `);
  await pool.query('ALTER TABLE DailyTasks ADD COLUMN IF NOT EXISTS RewardExp INTEGER NOT NULL DEFAULT 10');
  await pool.query('ALTER TABLE DailyTasks ADD COLUMN IF NOT EXISTS PlanVersion SMALLINT NOT NULL DEFAULT 1');
  await pool.query("ALTER TABLE DailyTasks ADD COLUMN IF NOT EXISTS TaskMode VARCHAR(20) NOT NULL DEFAULT 'new'");
  await pool.query('ALTER TABLE DailyTasks ADD COLUMN IF NOT EXISTS DueDate DATE');
  await pool.query('ALTER TABLE DailyTasks DROP COLUMN IF EXISTS Reason');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_date ON DailyTasks (UserId, TaskDate, OrderIndex)');
  await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS uq_daily_tasks_user_date_order ON DailyTasks (UserId, TaskDate, OrderIndex)');
  await spacedRepetitionService.ensureSchema();
  await spacedRepetitionService.backfillExistingProgress();
  schemaReady = true;
}

function candidateFromRow(row, config) {
  const dueDate = toDateString(row.duedate);
  const today = getSaigonDate();
  const overdueDays = dueDate ? daysBetween(dueDate, today) : 0;
  return {
    targetType: config.targetType,
    targetId: String(row.targetid || row.id),
    skill: config.skill,
    title: safeString(config.title(row)).slice(0, 255),
    description: safeString(config.description(row)),
    taskMode: 'review',
    dueDate: dueDate || today,
    overdueDays,
    easeFactor: Number(row.easefactor || 2.5),
    lastAssignedAt: row.lastassignedat || null,
    aiRationale: overdueDays > 0 ? 'sm2_overdue' : 'sm2_due',
    rewardExp: DAILY_TASK_REWARDS[config.targetType] || DAILY_TASK_REWARDS.default
  };
}

async function collectDueCandidates(userId, { includePlusSkills }) {
  const pool = getPool();
  const today = getSaigonDate();
  const specs = [
    {
      targetType: 'writing_lesson', skill: 'writing', table: 'WritingLessons', alias: 'l',
      title: (row) => `Writing: ${row.title}`,
      description: (row) => row.description || 'Luyện viết lại câu và sửa lỗi ngữ pháp.'
    },
    {
      targetType: 'speaking_lesson', skill: 'speaking', table: 'SpeakingLessons', alias: 'l', plusOnly: true,
      title: (row) => `Speaking: ${row.title}`,
      description: () => 'Nghe mẫu và luyện nói lại các câu trọng tâm.'
    },
    {
      targetType: 'listening_lesson', skill: 'listening', table: 'ListeningLessons', alias: 'l', plusOnly: true,
      title: (row) => `Listening: ${row.title}`,
      description: (row) => row.topic ? `Luyện nghe chủ đề ${row.topic}.` : 'Luyện nghe và trả lời câu hỏi.'
    },
    {
      targetType: 'reading_lesson', skill: 'reading', table: 'ReadingLessons', alias: 'l',
      title: (row) => `Reading: ${row.title}`,
      description: (row) => row.topic ? `Đọc hiểu chủ đề ${row.topic}.` : 'Đọc bài và trả lời câu hỏi.'
    },
    {
      targetType: 'grammar_topic', skill: 'grammar', table: 'GrammarTopics', alias: 'l',
      title: (row) => `Grammar: ${row.titlevi || row.title}`,
      description: () => 'Ôn lý thuyết và làm quiz ngữ pháp.'
    },
    {
      targetType: 'game_level', skill: 'game', table: 'GameLevels', alias: 'l',
      title: (row) => `Game: ${row.name}`,
      description: (row) => `Mini game - ${row.difficulty || 'practice'}`
    },
    {
      targetType: 'vocabulary_review', skill: 'vocabulary', table: 'UserCollections', alias: 'l',
      extraWhere: "AND l.IsPublic = true AND l.ReviewStatus = 'approved' AND EXISTS (SELECT 1 FROM UserCollectionWords w WHERE w.CollectionId = l.Id)",
      title: (row) => `Vocabulary: ${row.name}`,
      description: (row) => row.description || 'Ôn học phần từ vựng công khai.'
    }
  ];
  const candidates = [];

  for (const spec of specs) {
    if (spec.plusOnly && !includePlusSkills) continue;
    try {
      const result = await pool.query(`
        SELECT sri.TargetId, sri.EaseFactor, sri.Repetitions, sri.LastReviewedAt,
               sri.DueDate, sri.LastAssignedAt, ${spec.alias}.*
        FROM SpacedRepetitionItems sri
        INNER JOIN ${spec.table} ${spec.alias} ON ${spec.alias}.Id::text = sri.TargetId
        WHERE sri.UserId = $1
          AND sri.TargetType = $2
          AND sri.DueDate <= $3
          AND COALESCE(sri.IsMastered, false) = false
          ${spec.extraWhere || ''}
        ORDER BY sri.DueDate ASC, sri.EaseFactor ASC, sri.LastAssignedAt ASC NULLS FIRST
        LIMIT 30
      `, [userId, spec.targetType, today]);
      result.rows.forEach((row) => candidates.push(candidateFromRow(row, spec)));
    } catch (error) {
      console.warn(`[daily] due collector ${spec.targetType} skipped:`, error.message);
    }
  }
  return candidates;
}

function newCandidate(row, config) {
  return {
    targetType: config.targetType,
    targetId: String(row.id),
    skill: config.skill,
    title: safeString(config.title(row)).slice(0, 255),
    description: safeString(config.description(row)),
    taskMode: 'new',
    dueDate: getSaigonDate(),
    overdueDays: 0,
    easeFactor: 2.5,
    lastAssignedAt: null,
    aiRationale: 'sm2_new',
    rewardExp: DAILY_TASK_REWARDS[config.targetType] || DAILY_TASK_REWARDS.default
  };
}

async function findNewSequentialLesson(userId, config, placementLevel) {
  const result = await getPool().query(`
    SELECT l.*, p.Status, sri.Id AS ReviewItemId
    FROM ${config.table} l
    LEFT JOIN ${config.progressTable} p ON p.LessonId = l.Id AND p.UserId = $1
    LEFT JOIN SpacedRepetitionItems sri
      ON sri.UserId = $1 AND sri.TargetType = $2 AND sri.TargetId = l.Id::text
    ORDER BY l.OrderIndex ASC, l.CreatedAt ASC
  `, [userId, config.targetType]);
  const visible = placementLevel === 'basic'
    ? result.rows.filter((row) => !row.isfoundation)
    : result.rows;

  for (let index = 0; index < visible.length; index += 1) {
    const row = visible[index];
    const unlocked = index === 0 || visible[index - 1].status === 'completed';
    if (!unlocked) break;
    if (!row.reviewitemid) return newCandidate(row, config);
    if (row.status !== 'completed') break;
  }
  return null;
}

async function collectNewCandidates(userId, { includePlusSkills }) {
  const pool = getPool();
  const userResult = await pool.query('SELECT PlacementLevel FROM Users WHERE Id = $1', [userId]);
  const placementLevel = String(userResult.rows[0]?.placementlevel || 'new').toLowerCase();
  const lessonSpecs = [
    { targetType: 'writing_lesson', skill: 'writing', table: 'WritingLessons', progressTable: 'WritingProgress', title: (r) => `Writing: ${r.title}`, description: (r) => r.description || 'Luyện viết lại câu và sửa lỗi ngữ pháp.' },
    { targetType: 'reading_lesson', skill: 'reading', table: 'ReadingLessons', progressTable: 'ReadingProgress', title: (r) => `Reading: ${r.title}`, description: (r) => r.topic ? `Đọc hiểu chủ đề ${r.topic}.` : 'Đọc bài và trả lời câu hỏi.' },
    { targetType: 'speaking_lesson', skill: 'speaking', table: 'SpeakingLessons', progressTable: 'SpeakingProgress', plusOnly: true, title: (r) => `Speaking: ${r.title}`, description: () => 'Nghe mẫu và luyện nói lại các câu trọng tâm.' },
    { targetType: 'listening_lesson', skill: 'listening', table: 'ListeningLessons', progressTable: 'ListeningProgress', plusOnly: true, title: (r) => `Listening: ${r.title}`, description: (r) => r.topic ? `Luyện nghe chủ đề ${r.topic}.` : 'Luyện nghe và trả lời câu hỏi.' }
  ];
  const candidates = [];

  for (const spec of lessonSpecs) {
    if (spec.plusOnly && !includePlusSkills) continue;
    try {
      const candidate = await findNewSequentialLesson(userId, spec, placementLevel);
      if (candidate) candidates.push(candidate);
    } catch (error) {
      console.warn(`[daily] new collector ${spec.targetType} skipped:`, error.message);
    }
  }

  try {
    const grammarResult = await pool.query(`
      SELECT gt.*, gp.Status, sri.Id AS ReviewItemId
      FROM GrammarTopics gt
      LEFT JOIN GrammarProgress gp ON gp.TopicId = gt.Id AND gp.UserId = $1
      LEFT JOIN SpacedRepetitionItems sri
        ON sri.UserId = $1 AND sri.TargetType = 'grammar_topic' AND sri.TargetId = gt.Id::text
      ORDER BY gt.CategoryId, gt.OrderIndex ASC, gt.Id ASC
    `, [userId]);
    const byCategory = new Map();
    grammarResult.rows.forEach((row) => {
      const key = String(row.categoryid);
      if (!byCategory.has(key)) byCategory.set(key, []);
      byCategory.get(key).push(row);
    });
    for (const rows of byCategory.values()) {
      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        const unlocked = index === 0 || rows[index - 1].status === 'completed';
        if (!unlocked) break;
        if (!row.reviewitemid) {
          candidates.push(newCandidate(row, {
            targetType: 'grammar_topic', skill: 'grammar',
            title: (item) => `Grammar: ${item.titlevi || item.title}`,
            description: () => 'Ôn lý thuyết và làm quiz ngữ pháp.'
          }));
          break;
        }
        if (row.status !== 'completed') break;
      }
      if (candidates.some((item) => item.targetType === 'grammar_topic')) break;
    }
  } catch (error) {
    console.warn('[daily] new collector grammar_topic skipped:', error.message);
  }

  try {
    const gameResult = await pool.query(`
      SELECT gl.*, ugp.IsCompleted, sri.Id AS ReviewItemId
      FROM GameLevels gl
      LEFT JOIN UserGameProgress ugp ON ugp.LevelId = gl.Id AND ugp.UserId = $1
      LEFT JOIN SpacedRepetitionItems sri
        ON sri.UserId = $1 AND sri.TargetType = 'game_level' AND sri.TargetId = gl.Id::text
      ORDER BY gl.LevelNumber ASC
    `, [userId]);
    for (let index = 0; index < gameResult.rows.length; index += 1) {
      const row = gameResult.rows[index];
      const unlocked = index === 0 || gameResult.rows[index - 1].iscompleted === true;
      if (!unlocked) break;
      if (!row.reviewitemid) {
        candidates.push(newCandidate(row, {
          targetType: 'game_level', skill: 'game',
          title: (item) => `Game: ${item.name}`,
          description: (item) => `Mini game - ${item.difficulty || 'practice'}`
        }));
        break;
      }
      if (row.iscompleted !== true) break;
    }
  } catch (error) {
    console.warn('[daily] new collector game_level skipped:', error.message);
  }

  return candidates;
}

function sortDueCandidates(candidates) {
  return [...candidates].sort((a, b) => (
    b.overdueDays - a.overdueDays ||
    a.easeFactor - b.easeFactor ||
    String(a.lastAssignedAt || '').localeCompare(String(b.lastAssignedAt || '')) ||
    a.targetType.localeCompare(b.targetType)
  ));
}

function pushDiverseCandidates(candidates, selected, usedTargets, usedSkills, limit) {
  if (selected.length >= limit) return;

  for (const candidate of candidates) {
    const key = `${candidate.targetType}:${candidate.targetId}`;
    if (usedTargets.has(key) || usedSkills.has(candidate.skill)) continue;
    selected.push(candidate);
    usedTargets.add(key);
    usedSkills.add(candidate.skill);
    if (selected.length >= limit) return;
  }

  for (const candidate of candidates) {
    const key = `${candidate.targetType}:${candidate.targetId}`;
    if (usedTargets.has(key)) continue;
    selected.push(candidate);
    usedTargets.add(key);
    usedSkills.add(candidate.skill);
    if (selected.length >= limit) return;
  }
}

function selectDiverseTasks(dueCandidates, newCandidates, count = DAILY_LEARNING_TASK_COUNT, excluded = new Set()) {
  const selected = [];
  const usedTargets = new Set(excluded);
  const usedSkills = new Set();
  const due = sortDueCandidates(dueCandidates).filter((item) => !usedTargets.has(`${item.targetType}:${item.targetId}`));
  const fresh = newCandidates.filter((item) => !usedTargets.has(`${item.targetType}:${item.targetId}`));

  const dueTarget = Math.min(DAILY_DUE_TASK_TARGET, count);
  pushDiverseCandidates(due, selected, usedTargets, usedSkills, dueTarget);

  const newTarget = Math.min(count, selected.length + Math.min(DAILY_NEW_TASK_TARGET, count - selected.length));
  pushDiverseCandidates(fresh, selected, usedTargets, usedSkills, newTarget);

  if (selected.length < count) {
    pushDiverseCandidates(fresh, selected, usedTargets, usedSkills, count);
  }
  if (selected.length < count) {
    pushDiverseCandidates(due, selected, usedTargets, usedSkills, count);
  }

  return selected;
}
function getStarterTask() {
  return {
    targetType: 'daily_login', targetId: 'today', skill: 'habit',
    title: 'Đăng nhập hôm nay',
    description: 'Mở hệ thống học tập để giữ nhịp học mỗi ngày.',
    aiRationale: 'habit', taskMode: 'habit', dueDate: getSaigonDate(),
    rewardExp: DAILY_TASK_REWARDS.daily_login
  };
}

function isPlusTaskType(targetType) {
  return targetType === 'listening_lesson' || targetType === 'speaking_lesson';
}

async function insertTaskRows(client, userId, taskDate, tasks, startOrder = 0) {
  for (let index = 0; index < tasks.length; index += 1) {
    const task = tasks[index];
    await client.query(`
      INSERT INTO DailyTasks (
        UserId, TaskDate, Skill, TargetType, TargetId, Title, Description,
        Status, OrderIndex, AiRationale, RewardExp, PlanVersion, TaskMode, DueDate
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, $9, $10, $11, $12, $13)
      ON CONFLICT (UserId, TaskDate, OrderIndex) DO NOTHING
    `, [
      userId, taskDate, task.skill, task.targetType, String(task.targetId), task.title,
      task.description, startOrder + index, task.aiRationale,
      task.rewardExp || DAILY_TASK_REWARDS[task.targetType] || DAILY_TASK_REWARDS.default,
      PLAN_VERSION, task.taskMode || 'new', task.dueDate || taskDate
    ]);
  }
}

async function completeTaskById(userId, taskId) {
  const pool = getPool();
  const existing = await pool.query(
    'SELECT TargetType FROM DailyTasks WHERE Id = $1 AND UserId = $2',
    [taskId, userId]
  );
  const targetType = existing.rows[0]?.targettype;
  if (!targetType) return null;
  if (targetType !== 'daily_login') {
    const error = new Error('Nhiệm vụ học chỉ được hoàn thành sau khi đạt điểm yêu cầu trong bài.');
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(`
    UPDATE DailyTasks
    SET Status = 'completed', CompletedAt = COALESCE(CompletedAt, NOW())
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

async function buildLearningPlan(userId, includePlusSkills, count, excluded = new Set()) {
  const [dueCandidates, newCandidates] = await Promise.all([
    collectDueCandidates(userId, { includePlusSkills }),
    collectNewCandidates(userId, { includePlusSkills })
  ]);
  return selectDiverseTasks(dueCandidates, newCandidates, count, excluded);
}

async function repairLockedGameTasks(client, userId, taskDate) {
  await client.query(`
    WITH unlocked AS (
      SELECT gl.Id AS LevelId, gl.LevelNumber, gl.Name,
             ROW_NUMBER() OVER (ORDER BY gl.LevelNumber ASC) AS rn
      FROM GameLevels gl
      LEFT JOIN GameLevels prev ON prev.LevelNumber = gl.LevelNumber - 1
      LEFT JOIN UserGameProgress prevp ON prevp.UserId = $1 AND prevp.LevelId = prev.Id
      LEFT JOIN UserGameProgress curp ON curp.UserId = $1 AND curp.LevelId = gl.Id
      WHERE COALESCE(curp.IsCompleted, false) = false
        AND (gl.LevelNumber = 1 OR COALESCE(prevp.IsCompleted, false) = true)
    ), next_unlocked AS (
      SELECT LevelId, LevelNumber, Name FROM unlocked WHERE rn = 1
    ), mismatched AS (
      SELECT dt.Id AS TaskId, nu.LevelId, nu.LevelNumber, nu.Name
      FROM DailyTasks dt
      CROSS JOIN next_unlocked nu
      LEFT JOIN GameLevels current_level ON current_level.Id::text = dt.TargetId
      WHERE dt.UserId = $1
        AND dt.TaskDate = $2
        AND dt.TargetType = 'game_level'
        AND (current_level.Id IS NULL OR current_level.LevelNumber <> nu.LevelNumber)
    )
    UPDATE DailyTasks dt
    SET TargetId = m.LevelId::text,
        Title = 'Mini game: ' || m.Name,
        Description = 'Mini game - Level ' || m.LevelNumber,
        Status = 'pending',
        CompletedAt = NULL
    FROM mismatched m
    WHERE dt.Id = m.TaskId
  `, [userId, taskDate]);
}

const dailyService = {
  ensureInsightsSchema,
  getSaigonDate,

  async getToday(user) {
    await ensureInsightsSchema();
    const taskDate = getSaigonDate();
    const includePlusSkills = await billingService.isPlusUser(user.id);
    const client = await getPool().connect();
    let rows;

    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`${user.id}:${taskDate}`]);
      let existing = await client.query(`
        SELECT * FROM DailyTasks
        WHERE UserId = $1 AND TaskDate = $2
        ORDER BY OrderIndex ASC
      `, [user.id, taskDate]);

      if (existing.rows.length > 0 && existing.rows.some((row) => Number(row.planversion || 1) < PLAN_VERSION)) {
        rows = existing.rows;
      } else {
        if (existing.rows.length > 0 && !includePlusSkills) {
          await client.query(`
            DELETE FROM DailyTasks
            WHERE UserId = $1 AND TaskDate = $2 AND Status = 'pending'
              AND TargetType IN ('listening_lesson', 'speaking_lesson')
          `, [user.id, taskDate]);
          existing = await client.query(`
            SELECT * FROM DailyTasks
            WHERE UserId = $1 AND TaskDate = $2
            ORDER BY OrderIndex ASC
          `, [user.id, taskDate]);
        }

        if (existing.rows.length === 0) {
          const learningTasks = await buildLearningPlan(user.id, includePlusSkills, DAILY_LEARNING_TASK_COUNT);
          await spacedRepetitionService.markAssigned(user.id, learningTasks);
          await insertTaskRows(client, user.id, taskDate, [getStarterTask(), ...learningTasks], 0);
        } else {
          const learningRows = existing.rows.filter((row) => row.targettype !== 'daily_login');
          const missing = Math.max(0, DAILY_LEARNING_TASK_COUNT - learningRows.length);
          if (missing > 0) {
            const excluded = new Set(existing.rows.map((row) => `${row.targettype}:${row.targetid}`));
            const replacements = await buildLearningPlan(user.id, includePlusSkills, missing, excluded);
            await spacedRepetitionService.markAssigned(user.id, replacements);
            const maxOrder = existing.rows.reduce((max, row) => Math.max(max, Number(row.orderindex || 0)), -1);
            await insertTaskRows(client, user.id, taskDate, replacements, maxOrder + 1);
          }
        }

      }

      await repairLockedGameTasks(client, user.id, taskDate);
      const refreshed = await client.query(`
        SELECT * FROM DailyTasks
        WHERE UserId = $1 AND TaskDate = $2
        ORDER BY OrderIndex ASC
      `, [user.id, taskDate]);
      rows = refreshed.rows;

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    const shapedTasks = rows.map(shapeTask);
    const completed = await autoCompleteLoginTask(user.id, shapedTasks);
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
      SET Status = 'completed', CompletedAt = COALESCE(CompletedAt, NOW())
      WHERE UserId = $1 AND TaskDate = $2 AND TargetType = $3 AND TargetId = $4
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
  },

  selectDiverseTasks
};

module.exports = dailyService;
