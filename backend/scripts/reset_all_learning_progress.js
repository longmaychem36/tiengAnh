require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

const DRY_RUN = process.argv.includes('--dry-run');

const RESET_TABLES = [
  'ListeningProgress',
  'ReadingProgress',
  'SpeakingProgress',
  'WritingProgress',
  'GrammarProgress',
  'DailyTasks'
];

async function tableExists(pool, tableName) {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public' AND lower(table_name) = lower($1)
    ) AS exists
  `, [tableName]);
  return Boolean(result.rows[0]?.exists);
}

async function columnExists(pool, tableName, columnName) {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND lower(table_name) = lower($1)
        AND lower(column_name) = lower($2)
    ) AS exists
  `, [tableName, columnName]);
  return Boolean(result.rows[0]?.exists);
}

async function countRows(pool, tableName) {
  if (!await tableExists(pool, tableName)) return null;
  const result = await pool.query(`SELECT COUNT(*)::int AS count FROM ${tableName}`);
  return Number(result.rows[0]?.count || 0);
}

async function audit(pool) {
  const tableCounts = {};
  for (const tableName of RESET_TABLES) {
    tableCounts[tableName] = await countRows(pool, tableName);
  }
  return { tableCounts };
}

async function run() {
  await connectDB();
  const pool = getPool();

  try {
    const before = await audit(pool);
    const operations = [];

    if (!DRY_RUN) await pool.query('BEGIN');

    for (const tableName of RESET_TABLES) {
      const count = before.tableCounts[tableName];
      if (count === null) {
        operations.push({ tableName, skipped: true, reason: 'table_not_found' });
        continue;
      }
      operations.push({ tableName, deletedRows: count });
      if (!DRY_RUN && count > 0) {
        await pool.query(`DELETE FROM ${tableName}`);
      }
    }

    const after = DRY_RUN ? null : await audit(pool);
    if (!DRY_RUN) await pool.query('COMMIT');

    console.log(JSON.stringify({
      dryRun: DRY_RUN,
      operations,
      placementReset: 'skipped',
      before,
      after
    }, null, 2));
  } catch (error) {
    if (!DRY_RUN) await pool.query('ROLLBACK');
    throw error;
  } finally {
    await closeDB();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
