// ============================================
// Migration: Create Grammar Tables
// ============================================
require('dotenv').config();
const { connectDB, getPool, sql } = require('./src/config/database');

async function migrate() {
  await connectDB();
  const pool = getPool();

  console.log('📦 Creating Grammar tables...');

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='GrammarCategories' AND xtype='U')
    CREATE TABLE GrammarCategories (
      Id INT PRIMARY KEY IDENTITY(1,1),
      Name NVARCHAR(100) NOT NULL,
      NameVI NVARCHAR(100),
      Icon NVARCHAR(10) DEFAULT '📘',
      OrderIndex INT DEFAULT 0
    )
  `);

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='GrammarTopics' AND xtype='U')
    CREATE TABLE GrammarTopics (
      Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      CategoryId INT,
      Title NVARCHAR(200) NOT NULL,
      TitleVI NVARCHAR(200),
      Content NVARCHAR(MAX),
      OrderIndex INT DEFAULT 0,
      FOREIGN KEY (CategoryId) REFERENCES GrammarCategories(Id)
    )
  `);

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='GrammarQuiz' AND xtype='U')
    CREATE TABLE GrammarQuiz (
      Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      TopicId UNIQUEIDENTIFIER,
      Question NVARCHAR(MAX) NOT NULL,
      OptionA NVARCHAR(255),
      OptionB NVARCHAR(255),
      OptionC NVARCHAR(255),
      OptionD NVARCHAR(255),
      CorrectAnswer NVARCHAR(1),
      Explanation NVARCHAR(MAX),
      FOREIGN KEY (TopicId) REFERENCES GrammarTopics(Id)
    )
  `);

  console.log('✅ Grammar tables created!');
  process.exit(0);
}

migrate().catch(err => { console.error('❌', err.message); process.exit(1); });
