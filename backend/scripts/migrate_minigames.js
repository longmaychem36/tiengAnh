require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function columnExists(pool, tableName, columnName) {
  const result = await pool.query(`
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = lower($1)
      AND column_name = lower($2)
    LIMIT 1
  `, [tableName, columnName]);
  return result.rows.length > 0;
}

async function renumberDuplicateLevels(pool) {
  const duplicateRes = await pool.query(`
    SELECT COUNT(*)::int AS count
    FROM (
      SELECT LevelNumber
      FROM GameLevels
      GROUP BY LevelNumber
      HAVING COUNT(*) > 1
    ) duplicates
  `);

  if (duplicateRes.rows[0].count === 0) return;

  await pool.query(`
    WITH ordered AS (
      SELECT Id, ROW_NUMBER() OVER (ORDER BY LevelNumber ASC, CreatedAt ASC, Id ASC) AS next_number
      FROM GameLevels
    )
    UPDATE GameLevels gl
    SET LevelNumber = ordered.next_number
    FROM ordered
    WHERE gl.Id = ordered.Id
  `);
}

async function addConstraint(pool, name, sql) {
  const exists = await pool.query(
    `SELECT 1 FROM pg_constraint WHERE conname = $1 LIMIT 1`,
    [name]
  );
  if (exists.rows.length === 0) {
    await pool.query(sql);
  }
}

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();

    await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    await pool.query('DROP TABLE IF EXISTS UserGameSession CASCADE');
    await pool.query('DROP TABLE IF EXISTS GameOptions CASCADE');
    await pool.query('DROP TABLE IF EXISTS GameQuestions CASCADE');
    await pool.query('DROP TABLE IF EXISTS Games CASCADE');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS GameLevels (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        LevelNumber integer NOT NULL,
        Name varchar(200),
        Difficulty varchar(20) DEFAULT 'easy',
        TimeLimit integer DEFAULT 60,
        PassScore integer DEFAULT 70,
        IsLocked boolean DEFAULT false,
        CreatedAt timestamptz DEFAULT now()
      )
    `);

    if (await columnExists(pool, 'GameLevels', 'SetId')) {
      await pool.query('ALTER TABLE GameLevels DROP COLUMN IF EXISTS SetId CASCADE');
    }

    await pool.query('DROP TABLE IF EXISTS GameSets CASCADE');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS MiniGameQuestions (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        LevelId uuid NOT NULL,
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
        LevelId uuid NOT NULL,
        Score integer DEFAULT 0,
        Stars integer DEFAULT 0,
        IsCompleted boolean DEFAULT false,
        BestTime integer DEFAULT 0,
        Attempts integer DEFAULT 0,
        CompletedAt timestamptz,
        CONSTRAINT uq_ugp_user_level UNIQUE (UserId, LevelId)
      )
    `);

    await renumberDuplicateLevels(pool);

    await pool.query('ALTER TABLE MiniGameQuestions DROP CONSTRAINT IF EXISTS minigamequestions_levelid_fkey');
    await pool.query(`
      ALTER TABLE MiniGameQuestions
      ADD CONSTRAINT minigamequestions_levelid_fkey
      FOREIGN KEY (LevelId) REFERENCES GameLevels(Id) ON DELETE CASCADE
    `);

    await pool.query('ALTER TABLE UserGameProgress DROP CONSTRAINT IF EXISTS usergameprogress_levelid_fkey');
    await pool.query(`
      ALTER TABLE UserGameProgress
      ADD CONSTRAINT usergameprogress_levelid_fkey
      FOREIGN KEY (LevelId) REFERENCES GameLevels(Id) ON DELETE CASCADE
    `);

    await pool.query(`
      WITH ranked AS (
        SELECT ctid,
               ROW_NUMBER() OVER (
                 PARTITION BY UserId, LevelId
                 ORDER BY IsCompleted DESC, Score DESC, Stars DESC, CompletedAt DESC NULLS LAST, Attempts DESC
               ) AS rn
        FROM UserGameProgress
      )
      DELETE FROM UserGameProgress ugp
      USING ranked
      WHERE ugp.ctid = ranked.ctid AND ranked.rn > 1
    `);

    await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS uq_gamelevels_levelnumber ON GameLevels(LevelNumber)');
    await pool.query('CREATE INDEX IF NOT EXISTS ix_minigamequestions_level_order ON MiniGameQuestions(LevelId, OrderIndex)');
    await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS ux_usergameprogress_user_level ON UserGameProgress(UserId, LevelId)');

    await addConstraint(
      pool,
      'ck_gamelevels_difficulty',
      `ALTER TABLE GameLevels ADD CONSTRAINT ck_gamelevels_difficulty CHECK (Difficulty IN ('easy', 'medium', 'hard'))`
    );
    await addConstraint(
      pool,
      'ck_gamelevels_timelimit',
      'ALTER TABLE GameLevels ADD CONSTRAINT ck_gamelevels_timelimit CHECK (TimeLimit > 0)'
    );
    await addConstraint(
      pool,
      'ck_gamelevels_passscore',
      'ALTER TABLE GameLevels ADD CONSTRAINT ck_gamelevels_passscore CHECK (PassScore BETWEEN 0 AND 100)'
    );

    console.log('Mini game migration completed: GameLevels -> MiniGameQuestions single track.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrate();
