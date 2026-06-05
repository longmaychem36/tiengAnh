const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DEFAULT_BATCH_SIZE = 200;

function buildPoolConfig() {
  const connectionString = (process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL || '').trim();
  const explicitSsl = process.env.DB_SSL;
  const urlRequiresSsl = connectionString && /(?:sslmode=require|ssl=true)/i.test(connectionString);
  const ssl = explicitSsl === 'true' || (explicitSsl === undefined && urlRequiresSsl)
    ? { rejectUnauthorized: false }
    : false;

  if (connectionString) {
    try {
      new URL(connectionString);
    } catch (error) {
      const hasPlaceholders = /PGUSER|POSTGRES_PASSWORD|RAILWAY_TCP_PROXY|PGDATABASE/i.test(connectionString);
      const hint = hasPlaceholders
        ? 'It still contains placeholder text. Replace PGUSER, POSTGRES_PASSWORD, RAILWAY_TCP_PROXY_DOMAIN, RAILWAY_TCP_PROXY_PORT, and PGDATABASE with real Railway values.'
        : 'If the password contains special characters such as @, #, %, /, or :, use the connection string copied directly from Railway, or unset DATABASE_URL and set DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD instead.';

      throw new Error(`Invalid DATABASE_URL/DATABASE_PUBLIC_URL. ${hint}`);
    }

    return {
      connectionString,
      ssl,
      connectionTimeoutMillis: 10000,
    };
  }

  return {
    host: process.env.DB_HOST || process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'EnglishLearningSystem',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl,
    connectionTimeoutMillis: 10000,
  };
}

function parseArgs(argv) {
  const args = {
    file: path.join(__dirname, '..', '..', 'cosodulieu.sql'),
    dryRun: false,
    batchSize: DEFAULT_BATCH_SIZE,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--file') {
      args.file = path.resolve(argv[++i]);
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--batch-size') {
      args.batchSize = Math.max(1, parseInt(argv[++i], 10) || DEFAULT_BATCH_SIZE);
    }
  }

  return args;
}

function stripIdentifierQuotes(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/""/g, '"');
  }
  return trimmed;
}

function parseQualifiedName(value) {
  const parts = value.split('.').map(stripIdentifierQuotes);
  if (parts.length === 1) {
    return { schema: 'public', table: parts[0] };
  }
  return { schema: parts[0], table: parts[1] };
}

function quoteIdentifier(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function tableKey(schema, table) {
  return `${schema}.${table}`;
}

function decodeCopyValue(raw) {
  if (raw === '\\N') {
    return null;
  }

  return raw.replace(/\\(?:([bfnrtv\\])|x([0-9a-fA-F]{2})|([0-7]{1,3}))/g, (match, simple, hex, octal) => {
    if (hex) {
      return String.fromCharCode(parseInt(hex, 16));
    }
    if (octal) {
      return String.fromCharCode(parseInt(octal, 8));
    }

    switch (simple) {
      case 'b': return '\b';
      case 'f': return '\f';
      case 'n': return '\n';
      case 'r': return '\r';
      case 't': return '\t';
      case 'v': return '\v';
      case '\\': return '\\';
      default: return match;
    }
  });
}

function parseCopyRow(line, expectedColumns) {
  const values = line.split('\t').map(decodeCopyValue);
  if (values.length !== expectedColumns) {
    throw new Error(`COPY row has ${values.length} values, expected ${expectedColumns}: ${line.slice(0, 120)}`);
  }
  return values;
}

function parseDump(content) {
  const lines = content.split(/\r?\n/);
  const copyRegex = /^COPY\s+([^\s(]+)\s+\(([^)]+)\)\s+FROM\s+stdin;$/i;
  const setvalRegex = /^SELECT\s+pg_catalog\.setval\(.+\);$/i;
  const copyBlocks = [];
  const setvalStatements = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const copyMatch = line.match(copyRegex);

    if (copyMatch) {
      const { schema, table } = parseQualifiedName(copyMatch[1]);
      const columns = copyMatch[2].split(',').map(stripIdentifierQuotes);
      const rows = [];

      i += 1;
      while (i < lines.length && lines[i] !== '\\.') {
        if (lines[i] !== '') {
          rows.push(parseCopyRow(lines[i], columns.length));
        }
        i += 1;
      }

      copyBlocks.push({ schema, table, columns, rows });
      continue;
    }

    if (setvalRegex.test(line.trim())) {
      setvalStatements.push(line.trim());
    }
  }

  return { copyBlocks, setvalStatements };
}

async function getForeignKeyDependencies(client, blockKeys) {
  const result = await client.query(`
    SELECT
      source_ns.nspname AS source_schema,
      source_rel.relname AS source_table,
      target_ns.nspname AS target_schema,
      target_rel.relname AS target_table
    FROM pg_constraint c
    JOIN pg_class source_rel ON source_rel.oid = c.conrelid
    JOIN pg_namespace source_ns ON source_ns.oid = source_rel.relnamespace
    JOIN pg_class target_rel ON target_rel.oid = c.confrelid
    JOIN pg_namespace target_ns ON target_ns.oid = target_rel.relnamespace
    WHERE c.contype = 'f'
  `);

  const deps = new Map();
  for (const key of blockKeys) {
    deps.set(key, new Set());
  }

  for (const row of result.rows) {
    const sourceKey = tableKey(row.source_schema, row.source_table);
    const targetKey = tableKey(row.target_schema, row.target_table);
    if (deps.has(sourceKey) && blockKeys.has(targetKey) && sourceKey !== targetKey) {
      deps.get(sourceKey).add(targetKey);
    }
  }

  return deps;
}

function orderBlocksByDependencies(blocks, dependencies) {
  const byKey = new Map(blocks.map((block) => [tableKey(block.schema, block.table), block]));
  const ordered = [];
  const visiting = new Set();
  const visited = new Set();

  function visit(key) {
    if (visited.has(key)) return;
    if (visiting.has(key)) return;

    visiting.add(key);
    for (const dependency of dependencies.get(key) || []) {
      if (byKey.has(dependency)) {
        visit(dependency);
      }
    }
    visiting.delete(key);
    visited.add(key);

    const block = byKey.get(key);
    if (block) {
      ordered.push(block);
    }
  }

  for (const block of blocks) {
    visit(tableKey(block.schema, block.table));
  }

  return ordered;
}

async function insertBlock(client, block, batchSize) {
  if (block.rows.length === 0) {
    return 0;
  }

  const tableName = `${quoteIdentifier(block.schema)}.${quoteIdentifier(block.table)}`;
  const columnNames = block.columns.map(quoteIdentifier).join(', ');
  let inserted = 0;

  for (let offset = 0; offset < block.rows.length; offset += batchSize) {
    const batch = block.rows.slice(offset, offset + batchSize);
    const values = [];
    const tuples = batch.map((row) => {
      const placeholders = row.map((value) => {
        values.push(value);
        return `$${values.length}`;
      });
      return `(${placeholders.join(', ')})`;
    });

    const result = await client.query(
      `INSERT INTO ${tableName} (${columnNames})
       VALUES ${tuples.join(', ')}
       ON CONFLICT DO NOTHING`,
      values
    );

    inserted += result.rowCount;
  }

  return inserted;
}

function getConnectionHint(error) {
  if (error.code === 'ENOTFOUND' && /railway\.internal$/i.test(error.hostname || '')) {
    return 'Railway internal hosts only resolve inside Railway. From your local machine, use the PostgreSQL Public Networking/TCP Proxy host and port, or run this command from a Railway shell/job.';
  }

  if (error.code === 'ENOTFOUND') {
    return 'The database host cannot be resolved. Check DB_HOST or use the Railway public TCP proxy host.';
  }

  if (error.code === 'ECONNREFUSED') {
    return 'The host resolved, but the connection was refused. Check DB_PORT and whether Railway Public Networking/TCP Proxy is enabled.';
  }

  if (/ssl|tls|self-signed/i.test(error.message || '')) {
    return 'This looks like an SSL setting issue. Try DB_SSL=true for Railway public TCP proxy, or DB_SSL=false for Railway private networking.';
  }

  return null;
}

async function importDumpData() {
  const args = parseArgs(process.argv.slice(2));
  const sqlPath = path.resolve(args.file);
  const content = fs.readFileSync(sqlPath, 'utf8');
  const { copyBlocks, setvalStatements } = parseDump(content);
  const blocksWithRows = copyBlocks.filter((block) => block.rows.length > 0);
  const totalRows = blocksWithRows.reduce((sum, block) => sum + block.rows.length, 0);

  console.log(`Found ${copyBlocks.length} COPY blocks in ${sqlPath}.`);
  console.log(`Rows in dump: ${totalRows}.`);

  if (args.dryRun) {
    for (const block of blocksWithRows) {
      console.log(`${tableKey(block.schema, block.table)}: ${block.rows.length} rows`);
    }
    return;
  }

  const pool = new Pool(buildPoolConfig());
  let client;
  let transactionStarted = false;

  try {
    client = await pool.connect();
    const blockKeys = new Set(blocksWithRows.map((block) => tableKey(block.schema, block.table)));
    const dependencies = await getForeignKeyDependencies(client, blockKeys);
    const orderedBlocks = orderBlocksByDependencies(blocksWithRows, dependencies);

    await client.query('BEGIN');
    transactionStarted = true;

    let totalInserted = 0;
    for (const block of orderedBlocks) {
      const inserted = await insertBlock(client, block, args.batchSize);
      totalInserted += inserted;
      console.log(`${tableKey(block.schema, block.table)}: ${inserted}/${block.rows.length} rows inserted`);
    }

    for (const statement of setvalStatements) {
      await client.query(statement);
    }

    await client.query('COMMIT');
    transactionStarted = false;
    console.log(`Import complete. Inserted ${totalInserted}/${totalRows} rows.`);
  } catch (error) {
    if (client && transactionStarted) {
      await client.query('ROLLBACK');
    }
    console.error('Import failed:', error.message);
    const hint = getConnectionHint(error);
    if (hint) {
      console.error(`Hint: ${hint}`);
    }
    process.exitCode = 1;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

importDumpData();
