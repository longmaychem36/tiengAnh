require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool } = require('../src/config/database');

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();
    
    // Check if WritingLessons exists
    const checkRes = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'WritingLessons'
    `);
    
    if (checkRes.recordset.length === 0) {
      console.log('Creating Writing tables...');
      await pool.request().query(`
        CREATE TABLE WritingLessons (
            Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT gen_random_uuid(),
            Title NVARCHAR(255),
            Description NVARCHAR(MAX),
            OrderIndex INT,
            CreatedAt DATETIME DEFAULT NOW()
        );

        CREATE TABLE WritingExercises (
            Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT gen_random_uuid(),
            LessonId UNIQUEIDENTIFIER,
            ContentVI NVARCHAR(MAX),
            CorrectAnswerEN NVARCHAR(MAX),
            OrderIndex INT,
            FOREIGN KEY (LessonId) REFERENCES WritingLessons(Id) ON DELETE CASCADE
        );

        CREATE TABLE WritingVocab (
            Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT gen_random_uuid(),
            ExerciseId UNIQUEIDENTIFIER,
            Word NVARCHAR(100),
            Meaning NVARCHAR(255),
            FOREIGN KEY (ExerciseId) REFERENCES WritingExercises(Id) ON DELETE CASCADE
        );

        CREATE TABLE WritingProgress (
            UserId UNIQUEIDENTIFIER,
            LessonId UNIQUEIDENTIFIER,
            Status NVARCHAR(50),
            Score FLOAT,
            UpdatedAt DATETIME DEFAULT NOW(),
            PRIMARY KEY(UserId, LessonId)
        );
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
