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
    CREATE TABLE IF NOT EXISTS PlacementTests (
      Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      Title varchar(255) NOT NULL,
      Description text,
      IsActive boolean DEFAULT true,
      OrderIndex integer DEFAULT 0,
      CreatedAt timestamptz DEFAULT now(),
      UpdatedAt timestamptz DEFAULT now()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS PlacementTestQuestions (
      Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      TestId uuid NOT NULL REFERENCES PlacementTests(Id) ON DELETE CASCADE,
      QuestionType varchar(50) DEFAULT 'multiple_choice',
      Skill varchar(40) DEFAULT 'general',
      Prompt text NOT NULL,
      OptionA text,
      OptionB text,
      OptionC text,
      OptionD text,
      CorrectAnswer text,
      AcceptedAnswers text,
      Explanation text,
      SourceSkill varchar(40),
      SourceQuestionId text,
      OrderIndex integer DEFAULT 0,
      CreatedAt timestamptz DEFAULT now(),
      UpdatedAt timestamptz DEFAULT now()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS PlacementAttempts (
      Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      UserId uuid NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      TestId uuid NOT NULL REFERENCES PlacementTests(Id) ON DELETE CASCADE,
      Status varchar(30) DEFAULT 'in_progress',
      Score double precision,
      ResultLevel varchar(20),
      StartedAt timestamptz DEFAULT now(),
      SubmittedAt timestamptz
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS PlacementAttemptAnswers (
      Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      AttemptId uuid NOT NULL REFERENCES PlacementAttempts(Id) ON DELETE CASCADE,
      QuestionId uuid NOT NULL REFERENCES PlacementTestQuestions(Id) ON DELETE CASCADE,
      Answer text,
      IsCorrect boolean DEFAULT false,
      CreatedAt timestamptz DEFAULT now()
    )
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_placement_tests_active ON PlacementTests(IsActive, OrderIndex)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_placement_questions_test ON PlacementTestQuestions(TestId, OrderIndex)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_placement_attempts_user ON PlacementAttempts(UserId, StartedAt DESC)`);

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
