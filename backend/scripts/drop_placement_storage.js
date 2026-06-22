require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

const TABLES = [
  'PlacementAttemptAnswers',
  'PlacementAttempts',
  'PlacementTestQuestions',
  'PlacementTests'
];

async function tableExists(pool, tableName) {
  const result = await pool.query(`
    SELECT to_regclass($1) AS name
  `, [`public.${tableName}`]);
  return Boolean(result.rows[0]?.name);
}

async function getTableState(pool) {
  const state = {};
  for (const tableName of TABLES) {
    state[tableName] = await tableExists(pool, tableName);
  }
  return state;
}

async function run() {
  await connectDB();
  const pool = getPool();

  const before = await getTableState(pool);

  await pool.query('BEGIN');
  try {
    for (const tableName of TABLES) {
      await pool.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
      await pool.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
    }
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }

  const after = await getTableState(pool);

  console.log(JSON.stringify({
    droppedPlacementStorage: true,
    before,
    after
  }, null, 2));
}

run()
  .catch((error) => {
    console.error('Drop placement storage failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDB();
  });
