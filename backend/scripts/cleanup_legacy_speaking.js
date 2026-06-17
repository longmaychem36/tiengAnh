require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function run() {
  try {
    await connectDB();
    const pool = getPool();

    const tablesToDrop = [
      'SpeakingRecords',
      'UserGameSession',
      'GameOptions',
      'GameQuestions',
      'Games'
    ];

    for (const table of tablesToDrop) {
      await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      console.log(`Dropped legacy table if present: ${table}`);
    }

    console.log('Legacy speaking/game cleanup completed.');
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

run();
