require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();

    await pool.query(`
      ALTER TABLE SpeakingQuestions
      ADD COLUMN IF NOT EXISTS Option1VI varchar(500),
      ADD COLUMN IF NOT EXISTS Option2VI varchar(500),
      ADD COLUMN IF NOT EXISTS Option3VI varchar(500)
    `);

    console.log('Speaking Vietnamese option migration completed.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrate();
