require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS WritingLessons (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        Title varchar(255),
        Description text,
        OrderIndex integer,
        CreatedAt timestamptz DEFAULT now()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS WritingExercises (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        LessonId uuid REFERENCES WritingLessons(Id) ON DELETE CASCADE,
        ContentVI text,
        CorrectAnswerEN text,
        OrderIndex integer
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS WritingVocab (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        ExerciseId uuid REFERENCES WritingExercises(Id) ON DELETE CASCADE,
        Word varchar(100),
        Meaning varchar(255)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS WritingProgress (
        UserId uuid,
        LessonId uuid,
        Status varchar(50),
        Score double precision,
        UpdatedAt timestamptz DEFAULT now(),
        PRIMARY KEY (UserId, LessonId)
      )
    `);

    console.log('Writing migration completed.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrate();
