const { Pool } = require('pg');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const tables = [
  'users',
  'learninglevels',
  'gamelevels',
  'minigamequestions',
  'grammarcategories',
  'grammartopics',
  'grammarquiz',
  'speakinglessons',
  'speakingquestions',
  'speakingprogress',
  'userstats',
  'writinglessons',
  'writingexercises',
  'writingvocab',
];

function buildPoolConfig() {
  const connectionString = (process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL || '').trim();
  const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

  if (connectionString) {
    return { connectionString, ssl, connectionTimeoutMillis: 10000 };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'EnglishLearningSystem',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl,
    connectionTimeoutMillis: 10000,
  };
}

async function run() {
  const pool = new Pool(buildPoolConfig());

  try {
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*)::int AS count FROM public.${table}`);
      console.log(`${table}: ${result.rows[0].count}`);
    }
  } catch (error) {
    console.error('Count check failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
