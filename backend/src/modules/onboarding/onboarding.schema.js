const { getPool } = require('../../config/database');

let onboardingSchemaReady = false;

async function ensureOnboardingSchema() {
  if (onboardingSchemaReady) return;

  const pool = getPool();

  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

  await pool.query(`ALTER TABLE Users ADD COLUMN IF NOT EXISTS OnboardingCompleted boolean DEFAULT true`);
  await pool.query(`ALTER TABLE Users ADD COLUMN IF NOT EXISTS PlacementLevel varchar(20) DEFAULT 'basic'`);
  await pool.query(`ALTER TABLE Users ADD COLUMN IF NOT EXISTS PlacementSource varchar(30) DEFAULT 'legacy'`);
  await pool.query(`ALTER TABLE Users ADD COLUMN IF NOT EXISTS PlacementCompletedAt timestamptz DEFAULT now()`);

  await pool.query(`UPDATE Users SET OnboardingCompleted = true WHERE OnboardingCompleted IS NULL`);
  await pool.query(`UPDATE Users SET PlacementLevel = 'basic' WHERE PlacementLevel IS NULL`);
  await pool.query(`UPDATE Users SET PlacementSource = 'legacy' WHERE PlacementSource IS NULL`);
  await pool.query(`UPDATE Users SET PlacementCompletedAt = NOW() WHERE PlacementCompletedAt IS NULL`);

  await pool.query(`ALTER TABLE ListeningLessons ADD COLUMN IF NOT EXISTS IsFoundation boolean DEFAULT false`);
  await pool.query(`ALTER TABLE ReadingLessons ADD COLUMN IF NOT EXISTS IsFoundation boolean DEFAULT false`);
  await pool.query(`ALTER TABLE SpeakingLessons ADD COLUMN IF NOT EXISTS IsFoundation boolean DEFAULT false`);
  await pool.query(`ALTER TABLE WritingLessons ADD COLUMN IF NOT EXISTS IsFoundation boolean DEFAULT false`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS PlacementMiniGameQuestions (
      Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      QuestionType varchar(50) NOT NULL,
      ContentEN text DEFAULT '',
      ContentVI text DEFAULT '',
      AudioUrl text,
      ImageUrl text,
      CorrectAnswer text DEFAULT '',
      Options jsonb,
      Difficulty varchar(20) DEFAULT 'easy',
      PointRatio numeric(6,2) DEFAULT 1,
      IsActive boolean DEFAULT true,
      OrderIndex int DEFAULT 0,
      CreatedAt timestamptz DEFAULT NOW(),
      UpdatedAt timestamptz DEFAULT NOW()
    )
  `);

  await pool.query(`ALTER TABLE PlacementMiniGameQuestions ADD COLUMN IF NOT EXISTS PointRatio numeric(6,2) DEFAULT 1`);
  await pool.query(`ALTER TABLE PlacementMiniGameQuestions ADD COLUMN IF NOT EXISTS Difficulty varchar(20) DEFAULT 'easy'`);
  await pool.query(`ALTER TABLE PlacementMiniGameQuestions ADD COLUMN IF NOT EXISTS IsActive boolean DEFAULT true`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_placement_minigame_active_type ON PlacementMiniGameQuestions(IsActive, QuestionType, Difficulty)`);

  onboardingSchemaReady = true;
}

async function getUserPlacementLevel(userId) {
  await ensureOnboardingSchema();
  const pool = getPool();
  const result = await pool.query(
    `SELECT PlacementLevel FROM Users WHERE Id = $1`,
    [userId]
  );
  return result.rows[0]?.placementlevel || 'basic';
}

module.exports = {
  ensureOnboardingSchema,
  getUserPlacementLevel
};
