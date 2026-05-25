require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ListeningSpeakers (
        Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        LessonId uuid NOT NULL REFERENCES ListeningLessons(Id) ON DELETE CASCADE,
        Name varchar(120) NOT NULL,
        Gender varchar(20) DEFAULT 'female',
        VoiceName varchar(180),
        VoiceURI varchar(255),
        OrderIndex integer DEFAULT 0,
        CreatedAt timestamptz DEFAULT now(),
        UpdatedAt timestamptz DEFAULT now()
      )
    `);

    await pool.query(`ALTER TABLE ListeningSpeakers ADD COLUMN IF NOT EXISTS Gender varchar(20) DEFAULT 'female'`);
    await pool.query(`ALTER TABLE ListeningSpeakers ADD COLUMN IF NOT EXISTS VoiceName varchar(180)`);
    await pool.query(`ALTER TABLE ListeningSpeakers ADD COLUMN IF NOT EXISTS VoiceURI varchar(255)`);
    await pool.query(`ALTER TABLE ListeningSpeakers ADD COLUMN IF NOT EXISTS OrderIndex integer DEFAULT 0`);
    await pool.query(`ALTER TABLE ListeningSpeakers ADD COLUMN IF NOT EXISTS CreatedAt timestamptz DEFAULT now()`);
    await pool.query(`ALTER TABLE ListeningSpeakers ADD COLUMN IF NOT EXISTS UpdatedAt timestamptz DEFAULT now()`);
    await pool.query(`ALTER TABLE ListeningSegments ADD COLUMN IF NOT EXISTS SpeakerId uuid REFERENCES ListeningSpeakers(Id) ON DELETE SET NULL`);

    await pool.query(`
      INSERT INTO ListeningSpeakers (LessonId, Name, Gender, OrderIndex)
      SELECT DISTINCT
        LessonId,
        COALESCE(NULLIF(TRIM(Speaker), ''), 'Narrator') AS Name,
        'female',
        0
      FROM ListeningSegments ls
      WHERE NOT EXISTS (
        SELECT 1
        FROM ListeningSpeakers sp
        WHERE sp.LessonId = ls.LessonId
          AND LOWER(sp.Name) = LOWER(COALESCE(NULLIF(TRIM(ls.Speaker), ''), 'Narrator'))
      )
    `);

    await pool.query(`
      UPDATE ListeningSegments ls
      SET SpeakerId = sp.Id
      FROM ListeningSpeakers sp
      WHERE ls.SpeakerId IS NULL
        AND sp.LessonId = ls.LessonId
        AND LOWER(sp.Name) = LOWER(COALESCE(NULLIF(TRIM(ls.Speaker), ''), 'Narrator'))
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_listening_speakers_lesson ON ListeningSpeakers(LessonId, OrderIndex)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_listening_segments_speaker ON ListeningSegments(SpeakerId)`);

    console.log('Listening speakers migration completed.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrate();
