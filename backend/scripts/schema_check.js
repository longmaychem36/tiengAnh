const { getPool, sql, connectDB } = require('./src/config/database');
async function run() {
  try {
    await connectDB();
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME IN ('SpeakingLessons', 'SpeakingQuestions', 'SpeakingProgress')
    `);
    console.log(JSON.stringify(result.recordset, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
