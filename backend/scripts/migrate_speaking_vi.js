require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, sql } = require('../src/config/database');

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();
    
    // Check if Option1VI exists
    const checkRes = await pool.request().query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'SpeakingQuestions' AND COLUMN_NAME = 'Option1VI'
    `);
    
    if (checkRes.recordset.length === 0) {
      console.log('Adding Option1VI, Option2VI, Option3VI columns...');
      await pool.request().query(`
        ALTER TABLE SpeakingQuestions 
        ADD Option1VI NVARCHAR(500), Option2VI NVARCHAR(500), Option3VI NVARCHAR(500)
      `);
      console.log('Migration completed: Added Vietnamese translation columns for options.');
    } else {
      console.log('Migration already applied.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}
migrate();
