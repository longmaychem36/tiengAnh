require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

const legacyTables = [
  'QuizOptions',
  'Quiz',
  'UserVocabulary',
  'LessonVocabulary',
  'LessonMedia',
  'UserProgress',
  'Vocabulary',
  'Lessons',
  'Courses'
];

async function runMigration() {
  try {
    await connectDB();
    const pool = getPool();
    console.log('Connected. Dropping legacy course tables...');

    for (const tableName of legacyTables) {
      await pool.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
      console.log(`Dropped ${tableName} if it existed.`);
    }

    console.log('Legacy course cleanup completed.');
  } catch (err) {
    console.error('Legacy course cleanup failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

runMigration();
