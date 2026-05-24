require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function createSkillTables(pool, prefix, contentTable, contentColumns) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${prefix}Lessons (
      Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      Title varchar(255) NOT NULL,
      Description text,
      Level varchar(20) DEFAULT 'A1',
      Topic varchar(120),
      Objective text,
      Duration varchar(50),
      PassageTitle varchar(255),
      AudioUrl text,
      OrderIndex integer DEFAULT 0,
      CreatedAt timestamptz DEFAULT now(),
      UpdatedAt timestamptz DEFAULT now()
    )
  `);

  await pool.query(`ALTER TABLE ${prefix}Lessons ADD COLUMN IF NOT EXISTS Level varchar(20) DEFAULT 'A1'`);
  await pool.query(`ALTER TABLE ${prefix}Lessons ADD COLUMN IF NOT EXISTS Topic varchar(120)`);
  await pool.query(`ALTER TABLE ${prefix}Lessons ADD COLUMN IF NOT EXISTS Objective text`);
  await pool.query(`ALTER TABLE ${prefix}Lessons ADD COLUMN IF NOT EXISTS Duration varchar(50)`);
  await pool.query(`ALTER TABLE ${prefix}Lessons ADD COLUMN IF NOT EXISTS PassageTitle varchar(255)`);
  await pool.query(`ALTER TABLE ${prefix}Lessons ADD COLUMN IF NOT EXISTS AudioUrl text`);
  await pool.query(`ALTER TABLE ${prefix}Lessons ADD COLUMN IF NOT EXISTS UpdatedAt timestamptz DEFAULT now()`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${contentTable} (
      Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      LessonId uuid NOT NULL REFERENCES ${prefix}Lessons(Id) ON DELETE CASCADE,
      ${contentColumns},
      OrderIndex integer DEFAULT 0
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${prefix}Vocabulary (
      Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      LessonId uuid NOT NULL REFERENCES ${prefix}Lessons(Id) ON DELETE CASCADE,
      Word varchar(120) NOT NULL,
      Meaning varchar(255),
      OrderIndex integer DEFAULT 0
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${prefix}Questions (
      Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      LessonId uuid NOT NULL REFERENCES ${prefix}Lessons(Id) ON DELETE CASCADE,
      QuestionType varchar(50) DEFAULT 'multiple_choice',
      Prompt text NOT NULL,
      OptionA text,
      OptionB text,
      OptionC text,
      OptionD text,
      CorrectAnswer text,
      CorrectBoolean boolean,
      AcceptedAnswers text,
      Explanation text,
      OrderIndex integer DEFAULT 0
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${prefix}Progress (
      UserId uuid NOT NULL,
      LessonId uuid NOT NULL REFERENCES ${prefix}Lessons(Id) ON DELETE CASCADE,
      Status varchar(50) DEFAULT 'in_progress',
      Score double precision,
      UpdatedAt timestamptz DEFAULT now(),
      PRIMARY KEY (UserId, LessonId)
    )
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_${prefix.toLowerCase()}_lessons_order ON ${prefix}Lessons(OrderIndex)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_${contentTable.toLowerCase()}_lesson ON ${contentTable}(LessonId, OrderIndex)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_${prefix.toLowerCase()}_questions_lesson ON ${prefix}Questions(LessonId, OrderIndex)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_${prefix.toLowerCase()}_vocab_lesson ON ${prefix}Vocabulary(LessonId, OrderIndex)`);
}

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();

    await createSkillTables(
      pool,
      'Listening',
      'ListeningSegments',
      'Speaker varchar(120), Text text NOT NULL, StartSecond double precision, EndSecond double precision'
    );

    await createSkillTables(
      pool,
      'Reading',
      'ReadingParagraphs',
      'Content text NOT NULL'
    );

    console.log('Listening/Reading migration completed.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrate();
