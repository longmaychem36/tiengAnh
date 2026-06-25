const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const cols = await pool.query(`
    SELECT table_name, column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `);

  const tables = await pool.query(`
    SELECT relname AS table_name, n_live_tup AS estimated_rows
    FROM pg_stat_user_tables
    ORDER BY relname
  `);

  const grouped = {};
  for (const row of cols.rows) {
    grouped[row.table_name] ||= [];
    grouped[row.table_name].push(row.column_name);
  }

  console.log(JSON.stringify({ tables: tables.rows, columns: grouped }, null, 2));
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });