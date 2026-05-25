require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();

    await pool.query(`ALTER TABLE ListeningSpeakers DROP COLUMN IF EXISTS AgeGroup`);
    await pool.query(`ALTER TABLE ListeningSpeakers DROP COLUMN IF EXISTS TtsRate`);
    await pool.query(`ALTER TABLE ListeningSpeakers DROP COLUMN IF EXISTS TtsPitch`);
    await pool.query(`ALTER TABLE ListeningSegments DROP COLUMN IF EXISTS StartSecond`);
    await pool.query(`ALTER TABLE ListeningSegments DROP COLUMN IF EXISTS EndSecond`);

    console.log('Dropped extra listening voice/timing fields.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrate();
