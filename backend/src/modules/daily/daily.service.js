const axios = require('axios');
const { getPool } = require('../../config/database');
const billingService = require('../billing/billing.service');

const NIM_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const DAILY_TASK_MODEL = process.env.DAILY_TASK_NVIDIA_MODEL || process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct';
const DAILY_TASK_TIMEOUT_MS = Number.parseInt(process.env.DAILY_TASK_TIMEOUT_MS, 10) || 12000;
const DAILY_TASK_COUNT = 3;

let schemaReady = false;

function getSaigonDate() {
  return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function safeString(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function toErrorKey(value, fallback = 'general') {
  return safeString(value, fallback)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120) || fallback;
}

function clampSeverity(value) {
  const severity = Number.parseInt(value, 10);
  if (!Number.isFinite(severity)) return 3;
  return Math.min(5, Math.max(1, severity));
}

function shapeTask(row) {
  const targetType = row.targettype || row.TargetType;
  const targetId = row.targetid || row.TargetId;
  const status = row.status || row.Status || 'pending';
  const urlByType = {
    writing_lesson: `/writing/lessons/${targetId}`,
    speaking_lesson: `/speaking/lessons/${targetId}`,
    listening_lesson: `/listening/lessons/${targetId}`,
    reading_lesson: `/reading/lessons/${targetId}`,
    grammar_topic: `/grammar?topicId=${targetId}`,
    game_level: `/games/play/${targetId}`,
    vocabulary_review: '/collections'
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
    url: urlByType[targetType] || '/dashboard'
  };
}

function shapeWeakness(row) {
  return {
    skill: row.skill || row.Skill,
    errorType: row.errortype || row.ErrorType,
    errorKey: row.errorkey || row.ErrorKey,
    label: row.label || row.Label,
    mistakeCount: Number(row.mistakecount || row.MistakeCount || 0),
    attemptCount: Number(row.attemptcount || row.AttemptCount || 0),
    weight: Number(row.weight || row.Weight || 0),
    lastSeenAt: row.lastseenat || row.LastSeenAt,
    updatedAt: row.updatedat || row.UpdatedAt
  };
}

async function ensureInsightsSchema() {
  if (schemaReady) return;
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS UserErrorEvents (
      Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      Skill VARCHAR(40) NOT NULL,
      ActivityType VARCHAR(60) NOT NULL,
      ReferenceType VARCHAR(60),
      ReferenceId VARCHAR(120),
      ErrorType VARCHAR(80) NOT NULL,
      ErrorKey VARCHAR(140) NOT NULL,
      Severity INTEGER DEFAULT 3,
      Prompt TEXT,
      UserAnswer TEXT,
      ExpectedAnswer TEXT,
      Feedback TEXT,
      Metadata JSONB,
      CreatedAt TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS UserWeaknesses (
      Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      Skill VARCHAR(40) NOT NULL,
      ErrorType VARCHAR(80) NOT NULL,
      ErrorKey VARCHAR(140) NOT NULL,
      Label VARCHAR(255) NOT NULL,
      MistakeCount INTEGER NOT NULL DEFAULT 0,
      AttemptCount INTEGER NOT NULL DEFAULT 0,
      Weight DOUBLE PRECISION NOT NULL DEFAULT 0,
      LastSeenAt TIMESTAMP NOT NULL DEFAULT NOW(),
      UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (UserId, Skill, ErrorType, ErrorKey)
    )
  `);

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
      CompletedAt TIMESTAMP,
      CreatedAt TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query('CREATE INDEX IF NOT EXISTS idx_user_error_events_user_skill ON UserErrorEvents (UserId, Skill, CreatedAt DESC)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_user_error_events_reference ON UserErrorEvents (ReferenceType, ReferenceId)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_user_weaknesses_user_weight ON UserWeaknesses (UserId, Weight DESC, LastSeenAt DESC)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_date ON DailyTasks (UserId, TaskDate, OrderIndex)');
  await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS uq_daily_tasks_user_date_order ON DailyTasks (UserId, TaskDate, OrderIndex)');

  schemaReady = true;
}

async function recordErrorEvent(userId, event = {}) {
  if (!userId) return null;
  await ensureInsightsSchema();
  const pool = getPool();

  const skill = toErrorKey(event.skill, 'general').slice(0, 40);
  const activityType = toErrorKey(event.activityType, skill).slice(0, 60);
  const errorType = toErrorKey(event.errorType, 'accuracy').slice(0, 80);
  const errorKey = toErrorKey(event.errorKey || event.label || errorType, errorType);
  const label = safeString(event.label, errorKey).slice(0, 255);
  const severity = clampSeverity(event.severity);
  const weight = Math.max(1, severity * 1.5);

  const inserted = await pool.query(`
    INSERT INTO UserErrorEvents (
      UserId, Skill, ActivityType, ReferenceType, ReferenceId,
      ErrorType, ErrorKey, Severity, Prompt, UserAnswer, ExpectedAnswer, Feedback, Metadata
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb)
    RETURNING *
  `, [
    userId,
    skill,
    activityType,
    safeString(event.referenceType || ''),
    event.referenceId ? String(event.referenceId) : null,
    errorType,
    errorKey,
    severity,
    event.prompt || null,
    event.userAnswer == null ? null : String(event.userAnswer),
    event.expectedAnswer == null ? null : String(event.expectedAnswer),
    event.feedback || null,
    JSON.stringify(event.metadata || {})
  ]);

  await pool.query(`
    INSERT INTO UserWeaknesses (
      UserId, Skill, ErrorType, ErrorKey, Label, MistakeCount, AttemptCount, Weight, LastSeenAt, UpdatedAt
    )
    VALUES ($1, $2, $3, $4, $5, 1, 1, $6, NOW(), NOW())
    ON CONFLICT (UserId, Skill, ErrorType, ErrorKey)
    DO UPDATE SET
      Label = EXCLUDED.Label,
      MistakeCount = UserWeaknesses.MistakeCount + 1,
      AttemptCount = UserWeaknesses.AttemptCount + 1,
      Weight = LEAST(100, UserWeaknesses.Weight + EXCLUDED.Weight),
      LastSeenAt = NOW(),
      UpdatedAt = NOW()
  `, [userId, skill, errorType, errorKey, label, weight]);

  return inserted.rows[0];
}

async function safeRecordErrorEvent(userId, event) {
  try {
    return await recordErrorEvent(userId, event);
  } catch (err) {
    console.error('[daily] failed to record error event:', err.message);
    return null;
  }
}

async function getWeaknesses(userId, limit = 10) {
  await ensureInsightsSchema();
  const pool = getPool();
  const result = await pool.query(`
    SELECT Skill, ErrorType, ErrorKey, Label, MistakeCount, AttemptCount, Weight, LastSeenAt, UpdatedAt
    FROM UserWeaknesses
    WHERE UserId = $1
    ORDER BY Weight DESC, LastSeenAt DESC
    LIMIT $2
  `, [userId, limit]);

  return result.rows.map(shapeWeakness);
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

function selectFallbackTasks(weaknesses, candidates) {
  const selected = [];
  const usedIds = new Set();
  const weakSkills = weaknesses.map((item) => item.skill);
  const skillOrder = [...new Set([...weakSkills, 'writing', 'speaking', 'grammar', 'listening', 'reading', 'game', 'vocabulary'])];

  for (const skill of skillOrder) {
    const candidate = candidates.find((item) => item.skill === skill && !usedIds.has(item.id));
    if (!candidate) continue;
    selected.push({
      ...candidate,
      reason: weaknesses.find((item) => item.skill === skill)?.label
        ? `Tập trung cải thiện: ${weaknesses.find((item) => item.skill === skill).label}.`
        : candidate.reasonSeed,
      aiRationale: 'fallback'
    });
    usedIds.add(candidate.id);
    if (selected.length >= DAILY_TASK_COUNT) break;
  }

  for (const candidate of candidates) {
    if (selected.length >= DAILY_TASK_COUNT) break;
    if (usedIds.has(candidate.id)) continue;
    selected.push({
      ...candidate,
      reason: candidate.reasonSeed,
      aiRationale: 'fallback'
    });
    usedIds.add(candidate.id);
  }

  return selected.slice(0, DAILY_TASK_COUNT);
}

function extractJsonObject(text) {
  const source = safeString(text);
  const first = source.indexOf('{');
  const last = source.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) return null;
  try {
    return JSON.parse(source.slice(first, last + 1));
  } catch {
    return null;
  }
}

async function selectAiTasks(weaknesses, candidates) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not configured');

  const candidateMap = new Map(candidates.map((item) => [item.id, item]));
  const systemPrompt = [
    'You are an English learning coach for Vietnamese learners.',
    'Pick exactly 3 daily tasks from the provided candidate list.',
    'Prioritize repeated weaknesses, recent mistakes, and skill diversity.',
    'Do not invent IDs. Return valid JSON only: {"tasks":[{"candidateId":"...","reason":"Vietnamese reason under 18 words"}]}.'
  ].join(' ');

  const userPrompt = JSON.stringify({
    weaknesses: weaknesses.slice(0, 10),
    candidates: candidates.slice(0, 50).map(({ id, skill, targetType, title, description, reasonSeed }) => ({
      id,
      skill,
      targetType,
      title,
      description,
      reasonSeed
    }))
  });

  const response = await axios.post(
    `${NIM_BASE_URL}/chat/completions`,
    {
      model: DAILY_TASK_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.25,
      top_p: 0.8,
      max_tokens: 500,
      response_format: { type: 'json_object' },
      stream: false
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: DAILY_TASK_TIMEOUT_MS
    }
  );

  const parsed = extractJsonObject(response.data?.choices?.[0]?.message?.content);
  const tasks = Array.isArray(parsed?.tasks) ? parsed.tasks : [];
  const selected = [];
  const used = new Set();

  for (const item of tasks) {
    const candidate = candidateMap.get(item.candidateId);
    if (!candidate || used.has(candidate.id)) continue;
    selected.push({
      ...candidate,
      reason: safeString(item.reason, candidate.reasonSeed).slice(0, 500),
      aiRationale: 'ai'
    });
    used.add(candidate.id);
    if (selected.length >= DAILY_TASK_COUNT) break;
  }

  if (selected.length < DAILY_TASK_COUNT) {
    const fallback = selectFallbackTasks(weaknesses, candidates)
      .filter((item) => !used.has(item.id));
    selected.push(...fallback.slice(0, DAILY_TASK_COUNT - selected.length));
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
        UserId, TaskDate, Skill, TargetType, TargetId, Title, Description, Reason, Status, OrderIndex, AiRationale
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10)
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
      task.aiRationale
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

async function canUseAiDaily(user) {
  if (!user?.id) return false;
  return billingService.isPlusUser(user.id);
}

const dailyService = {
  ensureInsightsSchema,
  getSaigonDate,
  safeRecordErrorEvent,
  recordErrorEvent,

  async getToday(user) {
    await ensureInsightsSchema();
    const taskDate = getSaigonDate();

    if (!await canUseAiDaily(user)) {
      return {
        locked: true,
        taskDate,
        tasks: [],
        message: 'Nhiệm vụ AI hằng ngày dành cho tài khoản Plus.'
      };
    }

    const pool = getPool();
    const existing = await pool.query(`
      SELECT *
      FROM DailyTasks
      WHERE UserId = $1 AND TaskDate = $2
      ORDER BY OrderIndex ASC
    `, [user.id, taskDate]);

    if (existing.rows.length >= DAILY_TASK_COUNT) {
      return {
        locked: false,
        taskDate,
        tasks: existing.rows.map(shapeTask)
      };
    }

    const [weaknesses, candidates] = await Promise.all([
      getWeaknesses(user.id, 12),
      collectCandidateTargets(user.id)
    ]);

    if (candidates.length === 0) {
      return { locked: false, taskDate, tasks: [] };
    }

    let selected;
    try {
      selected = await selectAiTasks(weaknesses, candidates);
    } catch (err) {
      console.warn('[daily] AI task generation failed, using fallback:', err.message);
      selected = selectFallbackTasks(weaknesses, candidates);
    }

    const tasks = await insertDailyTasks(user.id, taskDate, selected);
    return { locked: false, taskDate, tasks };
  },

  async completeTask(userId, taskId) {
    await ensureInsightsSchema();
    const pool = getPool();
    const result = await pool.query(`
      UPDATE DailyTasks
      SET Status = 'completed',
          CompletedAt = COALESCE(CompletedAt, NOW())
      WHERE Id = $1 AND UserId = $2
      RETURNING *
    `, [taskId, userId]);

    return result.rows[0] ? shapeTask(result.rows[0]) : null;
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

    return result.rows.map(shapeTask);
  },

  async getWeaknesses(userId, limit = 10) {
    return getWeaknesses(userId, limit);
  }
};

module.exports = dailyService;
