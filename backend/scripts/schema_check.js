require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { getPool, connectDB, closeDB } = require('../src/config/database');
async function run() {
  try {
    await connectDB();
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_name IN ('speakinglessons', 'speakingquestions', 'speakingprogress')
      ORDER BY table_name, ordinal_position
    `);
    console.log(JSON.stringify(result.recordset, null, 2));
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}
run();
