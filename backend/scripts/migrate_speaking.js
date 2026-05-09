const { connectDB, getPool, sql } = require('./src/config/database');

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();
    
    // Check if Option1 exists to avoid error on multiple runs
    const checkRes = await pool.request().query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'SpeakingQuestions' AND COLUMN_NAME = 'Option1'
    `);
    
    if (checkRes.recordset.length === 0) {
      console.log('Adding Option1, Option2, Option3 columns...');
      await pool.request().query(`
        ALTER TABLE SpeakingQuestions 
        ADD Option1 NVARCHAR(500), Option2 NVARCHAR(500), Option3 NVARCHAR(500)
      `);
      
      console.log('Renaming Sentence to Question...');
      await pool.request().query(`
        EXEC sp_rename 'SpeakingQuestions.Sentence', 'Question', 'COLUMN'
      `);
      console.log('Migration completed.');
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
