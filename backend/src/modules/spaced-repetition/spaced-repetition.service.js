const crypto = require('crypto');
const { getPool } = require('../../config/database');

const TARGET_TYPES = new Set([
  'listening_lesson',
  'speaking_lesson',
  'reading_lesson',
  'writing_lesson',
  'grammar_topic',
  'game_level',
  'vocabulary_review'
]);

let schemaReady = false;

function getSaigonDate(value = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}

function formatDueDate(value) {
  if (!value) return null;
  if (typeof value === 'string') return value.slice(0, 10);
  if (value instanceof Date && !Number.isNaN(value.getTime())) return getSaigonDate(value);
  return String(value).slice(0, 10);
}

function qualityFromScore(rawScore) {
  const score = Math.min(100, Math.max(0, Math.round(Number(rawScore) || 0)));
  if (score < 40) return 0;
  if (score < 60) return 1;
  if (score < 70) return 2;
  if (score < 80) return 3;
  if (score < 90) return 4;
  return 5;
}

function calculateNextReview(state = {}, rawScore, today = getSaigonDate()) {
  const score = Math.min(100, Math.max(0, Math.round(Number(rawScore) || 0)));
  const quality = qualityFromScore(score);
  const previousEaseFactor = Number(state.easeFactor ?? state.easefactor ?? 2.5);
  const previousInterval = Number(state.intervalDays ?? state.intervaldays ?? 0);
  const previousRepetitions = Number(state.repetitions || 0);
  const previousLapses = Number(state.lapses || 0);
  const easeDelta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  const easeFactor = Math.max(1.3, Number((previousEaseFactor + easeDelta).toFixed(2)));

  let repetitions;
  let intervalDays;
  let lapses = previousLapses;

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    repetitions = previousRepetitions + 1;
    if (previousRepetitions === 0) intervalDays = 1;
    else if (previousRepetitions === 1) intervalDays = 6;
    else intervalDays = Math.max(1, Math.round(previousInterval * easeFactor));
  }

  return {
    score,
    quality,
    easeFactor,
    intervalDays,
    repetitions,
    lapses,
    dueDate: addDays(today, intervalDays),
    previousEaseFactor,
    previousInterval,
    previousRepetitions
  };
}

function isPerfectScore(rawScore) {
  const score = Math.min(100, Math.max(0, Math.round(Number(rawScore) || 0)));
  return score === 100;
}

function assertTargetType(targetType) {
  if (!TARGET_TYPES.has(targetType)) {
    const error = new Error(`Unsupported spaced repetition target type: ${targetType}`);
    error.statusCode = 400;
    throw error;
  }
}

function normalizeAttemptId(value) {
  const text = String(value || '').trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)
    ? text
    : crypto.randomUUID();
}

async function ensureSchema() {
  if (schemaReady) return;
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS SpacedRepetitionItems (
      Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      TargetType VARCHAR(80) NOT NULL,
      TargetId VARCHAR(120) NOT NULL,
      EaseFactor NUMERIC(4, 2) NOT NULL DEFAULT 2.50,
      IntervalDays INTEGER NOT NULL DEFAULT 0,
      Repetitions INTEGER NOT NULL DEFAULT 0,
      Lapses INTEGER NOT NULL DEFAULT 0,
      LastScore INTEGER,
      LastQuality SMALLINT,
      LastReviewedAt TIMESTAMPTZ,
      DueDate DATE NOT NULL DEFAULT ((NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date),
      LastAssignedAt TIMESTAMPTZ,
      IsMastered BOOLEAN NOT NULL DEFAULT false,
      MasteredAt TIMESTAMPTZ,
      CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UpdatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (UserId, TargetType, TargetId)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS SpacedRepetitionReviews (
      Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ItemId UUID NOT NULL REFERENCES SpacedRepetitionItems(Id) ON DELETE CASCADE,
      UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      AttemptId UUID NOT NULL,
      Score INTEGER NOT NULL,
      Quality SMALLINT NOT NULL,
      PreviousEaseFactor NUMERIC(4, 2) NOT NULL,
      NextEaseFactor NUMERIC(4, 2) NOT NULL,
      PreviousIntervalDays INTEGER NOT NULL,
      NextIntervalDays INTEGER NOT NULL,
      PreviousRepetitions INTEGER NOT NULL,
      NextRepetitions INTEGER NOT NULL,
      ReviewedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (UserId, AttemptId)
    )
  `);

  await pool.query('CREATE INDEX IF NOT EXISTS idx_sr_items_due ON SpacedRepetitionItems (UserId, DueDate, LastAssignedAt)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_sr_reviews_item ON SpacedRepetitionReviews (ItemId, ReviewedAt DESC)');

  await pool.query('ALTER TABLE DailyTasks ADD COLUMN IF NOT EXISTS PlanVersion SMALLINT NOT NULL DEFAULT 1');
  await pool.query("ALTER TABLE DailyTasks ADD COLUMN IF NOT EXISTS TaskMode VARCHAR(20) NOT NULL DEFAULT 'new'");
  await pool.query('ALTER TABLE DailyTasks ADD COLUMN IF NOT EXISTS DueDate DATE');
  await pool.query('ALTER TABLE SpacedRepetitionItems ADD COLUMN IF NOT EXISTS IsMastered BOOLEAN NOT NULL DEFAULT false');
  await pool.query('ALTER TABLE SpacedRepetitionItems ADD COLUMN IF NOT EXISTS MasteredAt TIMESTAMPTZ');

  schemaReady = true;
}

async function registerItem(userId, targetType, targetId, options = {}) {
  assertTargetType(targetType);
  await ensureSchema();
  const dueDate = options.dueDate || getSaigonDate();
  const result = await getPool().query(`
    INSERT INTO SpacedRepetitionItems (UserId, TargetType, TargetId, DueDate, LastAssignedAt)
    VALUES ($1, $2, $3, $4, CASE WHEN $5::boolean THEN NOW() ELSE NULL END)
    ON CONFLICT (UserId, TargetType, TargetId)
    DO UPDATE SET LastAssignedAt = CASE
      WHEN $5::boolean THEN NOW()
      ELSE SpacedRepetitionItems.LastAssignedAt
    END
    RETURNING *
  `, [userId, targetType, String(targetId), dueDate, Boolean(options.assigned)]);
  return result.rows[0];
}

async function markAssigned(userId, targets = []) {
  await ensureSchema();
  for (const target of targets) {
    await registerItem(userId, target.targetType, target.targetId, { assigned: true });
  }
}

async function recordReview({ userId, targetType, targetId, score, attemptId }) {
  assertTargetType(targetType);
  await ensureSchema();
  const safeAttemptId = normalizeAttemptId(attemptId);
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`${userId}:${safeAttemptId}`]);
    const duplicate = await client.query(`
      SELECT r.*, i.DueDate, i.IntervalDays, i.Repetitions, i.EaseFactor, i.Lapses, i.IsMastered, i.MasteredAt
      FROM SpacedRepetitionReviews r
      INNER JOIN SpacedRepetitionItems i ON i.Id = r.ItemId
      WHERE r.UserId = $1 AND r.AttemptId = $2
    `, [userId, safeAttemptId]);
    if (duplicate.rows[0]) {
      await client.query('COMMIT');
      return { item: duplicate.rows[0], attemptId: safeAttemptId, idempotent: true };
    }

    await client.query(`
      INSERT INTO SpacedRepetitionItems (UserId, TargetType, TargetId, DueDate)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (UserId, TargetType, TargetId) DO NOTHING
    `, [userId, targetType, String(targetId), getSaigonDate()]);

    const currentResult = await client.query(`
      SELECT * FROM SpacedRepetitionItems
      WHERE UserId = $1 AND TargetType = $2 AND TargetId = $3
      FOR UPDATE
    `, [userId, targetType, String(targetId)]);
    const current = currentResult.rows[0];
    const next = calculateNextReview(current, score);
    const masteredByPerfectScore = isPerfectScore(next.score);

    const updatedResult = await client.query(`
      UPDATE SpacedRepetitionItems
      SET EaseFactor = $1,
          IntervalDays = $2,
          Repetitions = $3,
          Lapses = $4,
          LastScore = $5,
          LastQuality = $6,
          LastReviewedAt = NOW(),
          DueDate = $7,
          IsMastered = CASE WHEN $8::boolean THEN true ELSE IsMastered END,
          MasteredAt = CASE WHEN $8::boolean THEN COALESCE(MasteredAt, NOW()) ELSE MasteredAt END,
          UpdatedAt = NOW()
      WHERE Id = $9
      RETURNING *
    `, [
      next.easeFactor,
      next.intervalDays,
      next.repetitions,
      next.lapses,
      next.score,
      next.quality,
      next.dueDate,
      masteredByPerfectScore,
      current.id
    ]);

    await client.query(`
      INSERT INTO SpacedRepetitionReviews (
        ItemId, UserId, AttemptId, Score, Quality,
        PreviousEaseFactor, NextEaseFactor,
        PreviousIntervalDays, NextIntervalDays,
        PreviousRepetitions, NextRepetitions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      current.id,
      userId,
      safeAttemptId,
      next.score,
      next.quality,
      next.previousEaseFactor,
      next.easeFactor,
      next.previousInterval,
      next.intervalDays,
      next.previousRepetitions,
      next.repetitions
    ]);

    await client.query('COMMIT');
    return { item: updatedResult.rows[0], attemptId: safeAttemptId, idempotent: false };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function backfillExistingProgress() {
  await ensureSchema();
  const pool = getPool();
  const sources = [
    ['ListeningProgress', 'listening_lesson', 'LessonId', 'Score'],
    ['SpeakingProgress', 'speaking_lesson', 'LessonId', 'Score'],
    ['ReadingProgress', 'reading_lesson', 'LessonId', 'Score'],
    ['WritingProgress', 'writing_lesson', 'LessonId', 'Score'],
    ['GrammarProgress', 'grammar_topic', 'TopicId', 'LastScore'],
    ['UserGameProgress', 'game_level', 'LevelId', 'Score']
  ];
  const summary = {};

  for (const [table, targetType, targetColumn, scoreColumn] of sources) {
    try {
      const result = await pool.query(`
        INSERT INTO SpacedRepetitionItems (
          UserId, TargetType, TargetId, EaseFactor, IntervalDays, Repetitions,
          Lapses, LastScore, LastQuality, LastReviewedAt, DueDate
        )
        SELECT UserId, $1, ${targetColumn}::text, 2.50, 0, 0, 0,
               COALESCE(${scoreColumn}, 0),
               CASE
                 WHEN COALESCE(${scoreColumn}, 0) < 40 THEN 0
                 WHEN COALESCE(${scoreColumn}, 0) < 60 THEN 1
                 WHEN COALESCE(${scoreColumn}, 0) < 70 THEN 2
                 WHEN COALESCE(${scoreColumn}, 0) < 80 THEN 3
                 WHEN COALESCE(${scoreColumn}, 0) < 90 THEN 4
                 ELSE 5
               END,
               UpdatedAt,
               (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date
        FROM ${table}
        ON CONFLICT (UserId, TargetType, TargetId) DO NOTHING
      `, [targetType]);
      summary[targetType] = result.rowCount || 0;
    } catch (error) {
      if (error.code !== '42P01' && error.code !== '42703') throw error;
      summary[targetType] = 0;
    }
  }

  return summary;
}

async function resetUser(userId) {
  await ensureSchema();
  const result = await getPool().query('DELETE FROM SpacedRepetitionItems WHERE UserId = $1', [userId]);
  return result.rowCount || 0;
}

module.exports = {
  TARGET_TYPES,
  getSaigonDate,
  formatDueDate,
  qualityFromScore,
  calculateNextReview,
  isPerfectScore,
  ensureSchema,
  registerItem,
  markAssigned,
  recordReview,
  backfillExistingProgress,
  resetUser
};
