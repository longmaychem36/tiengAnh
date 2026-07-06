const { getPool } = require('../../config/database');

const SOFT_DELETE_TABLES = [
  'Users',
  'SpeakingLessons',
  'WritingLessons',
  'ListeningLessons',
  'ReadingLessons',
  'GrammarTopics',
  'GameLevels',
  'UserCollections'
];

let schemaReady = false;

async function ensureSoftDeleteSchema() {
  if (schemaReady) return;
  const pool = getPool();

  for (const table of SOFT_DELETE_TABLES) {
    await pool.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS IsDeleted boolean NOT NULL DEFAULT false`);
    await pool.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS DeletedAt timestamptz`);
  }

  schemaReady = true;
}

module.exports = { ensureSoftDeleteSchema, SOFT_DELETE_TABLES };
