// ============================================
// Migration: New Mini Game Tables (Set → Level → Question)
// ============================================
require('dotenv').config();
const { connectDB, getPool, sql } = require('./src/config/database');

async function migrate() {
  await connectDB();
  const pool = getPool();

  console.log('🗑️  Dropping old game data...');
  try { await pool.request().query('DELETE FROM UserGameSession'); } catch(e) {}
  try { await pool.request().query('DELETE FROM GameOptions'); } catch(e) {}
  try { await pool.request().query('DELETE FROM GameQuestions'); } catch(e) {}
  try { await pool.request().query('DELETE FROM Games'); } catch(e) {}
  console.log('✅ Old data cleared.\n');

  console.log('📦 Creating new Mini Game tables...');

  // GameSets — Groups of levels (e.g. "Beginner Matching", "Advanced Listening")
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='GameSets' AND xtype='U')
    CREATE TABLE GameSets (
      Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      Name NVARCHAR(200) NOT NULL,
      Description NVARCHAR(500),
      GameType NVARCHAR(50) NOT NULL,  -- 'matching', 'listening', 'typing', 'sentence'
      Icon NVARCHAR(10) DEFAULT '🎮',
      OrderIndex INT DEFAULT 0,
      UnlockCondition NVARCHAR(200) DEFAULT 'none', -- 'none' | 'complete_previous'
      CreatedAt DATETIME DEFAULT GETDATE()
    )
  `);
  console.log('  ✅ GameSets');

  // GameLevels — Individual levels within a set
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='GameLevels' AND xtype='U')
    CREATE TABLE GameLevels (
      Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      SetId UNIQUEIDENTIFIER NOT NULL,
      LevelNumber INT NOT NULL,
      Name NVARCHAR(200),
      Difficulty NVARCHAR(20) DEFAULT 'easy', -- easy, medium, hard
      TimeLimit INT DEFAULT 60,  -- seconds
      PassScore INT DEFAULT 70,  -- minimum % to pass
      IsLocked BIT DEFAULT 0,
      CreatedAt DATETIME DEFAULT GETDATE(),
      FOREIGN KEY (SetId) REFERENCES GameSets(Id) ON DELETE CASCADE
    )
  `);
  console.log('  ✅ GameLevels');

  // MiniGameQuestions — Questions for each level
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='MiniGameQuestions' AND xtype='U')
    CREATE TABLE MiniGameQuestions (
      Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      LevelId UNIQUEIDENTIFIER NOT NULL,
      QuestionType NVARCHAR(50) NOT NULL, -- 'match_pair', 'listen_choose', 'type_answer', 'order_sentence'
      ContentEN NVARCHAR(500),   -- English content (word, sentence, etc.)
      ContentVI NVARCHAR(500),   -- Vietnamese content
      AudioUrl NVARCHAR(500),    -- For listening games
      ImageUrl NVARCHAR(500),    -- For matching with images
      CorrectAnswer NVARCHAR(500),
      Options NVARCHAR(MAX),     -- JSON array of options for MCQ
      OrderIndex INT DEFAULT 0,
      FOREIGN KEY (LevelId) REFERENCES GameLevels(Id) ON DELETE CASCADE
    )
  `);
  console.log('  ✅ MiniGameQuestions');

  // UserGameProgress — Track user progress per level
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserGameProgress' AND xtype='U')
    CREATE TABLE UserGameProgress (
      Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      UserId UNIQUEIDENTIFIER NOT NULL,
      LevelId UNIQUEIDENTIFIER NOT NULL,
      Score INT DEFAULT 0,
      Stars INT DEFAULT 0,         -- 0-3 stars
      IsCompleted BIT DEFAULT 0,
      BestTime INT DEFAULT 0,      -- best completion time in seconds
      Attempts INT DEFAULT 0,
      CompletedAt DATETIME,
      FOREIGN KEY (LevelId) REFERENCES GameLevels(Id) ON DELETE CASCADE
    )
  `);
  console.log('  ✅ UserGameProgress');

  console.log('\n🎉 All new Mini Game tables created!');
  process.exit(0);
}

migrate().catch(err => { console.error('❌', err.message); process.exit(1); });
