const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const candidates = [
  'courses',
  'lessons',
  'lessonmedia',
  'lessonvocabulary',
  'vocabulary',
  'uservocabulary',
  'quiz',
  'quizoptions',
  'userprogress',
  'dictionaryentries',
  'dictionarysearchhistory',
  'dictionarysynonyms',
  'gamesets',
  'placementtests',
  'placementtestquestions',
  'placementattempts',
  'placementattemptanswers',
  'userweaknesses',
  'usererrorevents',
  'achievements',
  'userachievements'
];

async function main() {
  const counts = {};
  for (const table of candidates) {
    const exists = await pool.query('SELECT to_regclass($1) AS name', [`public.${table}`]);
    if (!exists.rows[0]?.name) {
      counts[table] = null;
      continue;
    }
    const result = await pool.query(`SELECT COUNT(*)::int AS count FROM public.${table}`);
    counts[table] = result.rows[0].count;
  }

  console.log(JSON.stringify(counts, null, 2));
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });