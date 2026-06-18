require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function tableExists(pool, tableName) {
  const result = await pool.query(`
    SELECT to_regclass($1) AS name
  `, [`public.${tableName}`]);
  return Boolean(result.rows[0]?.name);
}

async function columnExists(pool, tableName, columnName) {
  const result = await pool.query(`
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND lower(table_name) = lower($1)
      AND lower(column_name) = lower($2)
    LIMIT 1
  `, [tableName, columnName]);
  return result.rows.length > 0;
}

async function run() {
  await connectDB();
  const pool = getPool();

  const before = {
    DictionarySearchHistory: await tableExists(pool, 'DictionarySearchHistory'),
    DictionarySynonyms: await tableExists(pool, 'DictionarySynonyms'),
    DictionaryEntries: await tableExists(pool, 'DictionaryEntries'),
    UserCollectionWordsDictionaryEntryId: await columnExists(pool, 'UserCollectionWords', 'DictionaryEntryId')
  };

  await pool.query('BEGIN');
  try {
    await pool.query('ALTER TABLE IF EXISTS UserCollectionWords DROP COLUMN IF EXISTS DictionaryEntryId');
    await pool.query('DROP TABLE IF EXISTS DictionarySearchHistory CASCADE');
    await pool.query('DROP TABLE IF EXISTS DictionarySynonyms CASCADE');
    await pool.query('DROP TABLE IF EXISTS DictionaryEntries CASCADE');
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }

  const after = {
    DictionarySearchHistory: await tableExists(pool, 'DictionarySearchHistory'),
    DictionarySynonyms: await tableExists(pool, 'DictionarySynonyms'),
    DictionaryEntries: await tableExists(pool, 'DictionaryEntries'),
    UserCollectionWordsDictionaryEntryId: await columnExists(pool, 'UserCollectionWords', 'DictionaryEntryId')
  };

  console.log(JSON.stringify({
    droppedDictionaryStorage: true,
    before,
    after
  }, null, 2));
}

run()
  .catch((error) => {
    console.error('Drop dictionary storage failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDB();
  });
