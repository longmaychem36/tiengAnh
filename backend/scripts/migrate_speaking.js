require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();

    await pool.query(`
      ALTER TABLE SpeakingQuestions
      ADD COLUMN IF NOT EXISTS Option1 varchar(500),
      ADD COLUMN IF NOT EXISTS Option2 varchar(500),
      ADD COLUMN IF NOT EXISTS Option3 varchar(500)
    `);

    const sentenceColumn = await pool.query(`
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'speakingquestions' AND column_name = 'sentence'
    `);
    const questionColumn = await pool.query(`
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'speakingquestions' AND column_name = 'question'
    `);

    if (sentenceColumn.rowCount > 0 && questionColumn.rowCount === 0) {
      await pool.query('ALTER TABLE SpeakingQuestions RENAME COLUMN Sentence TO Question');
      console.log('Renamed Sentence to Question.');
    }

    console.log('Speaking migration completed.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrate();
