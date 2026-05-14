require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();

    await pool.query('DROP TABLE IF EXISTS UserGameSession CASCADE');
    await pool.query('DROP TABLE IF EXISTS GameOptions CASCADE');
    await pool.query('DROP TABLE IF EXISTS GameQuestions CASCADE');
    await pool.query('DROP TABLE IF EXISTS Games CASCADE');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS GameSets (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        Name varchar(200) NOT NULL,
        Description varchar(500),
        GameType varchar(50) NOT NULL,
        Icon varchar(10) DEFAULT 'game',
        OrderIndex integer DEFAULT 0,
        UnlockCondition varchar(200) DEFAULT 'none',
        CreatedAt timestamptz DEFAULT now()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS GameLevels (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        SetId uuid NOT NULL REFERENCES GameSets(Id) ON DELETE CASCADE,
        LevelNumber integer NOT NULL,
        Name varchar(200),
        Difficulty varchar(20) DEFAULT 'easy',
        TimeLimit integer DEFAULT 60,
        PassScore integer DEFAULT 70,
        IsLocked boolean DEFAULT false,
        CreatedAt timestamptz DEFAULT now()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS MiniGameQuestions (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        LevelId uuid NOT NULL REFERENCES GameLevels(Id) ON DELETE CASCADE,
        QuestionType varchar(50) NOT NULL,
        ContentEN varchar(500),
        ContentVI varchar(500),
        AudioUrl varchar(500),
        ImageUrl varchar(500),
        CorrectAnswer varchar(500),
        Options text,
        OrderIndex integer DEFAULT 0
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS UserGameProgress (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        UserId uuid NOT NULL REFERENCES Users(Id),
        LevelId uuid NOT NULL REFERENCES GameLevels(Id) ON DELETE CASCADE,
        Score integer DEFAULT 0,
        Stars integer DEFAULT 0,
        IsCompleted boolean DEFAULT false,
        BestTime integer DEFAULT 0,
        Attempts integer DEFAULT 0,
        CompletedAt timestamptz,
        CONSTRAINT uq_ugp_user_level UNIQUE (UserId, LevelId)
      )
    `);

    console.log('Mini game migration completed.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrate();
