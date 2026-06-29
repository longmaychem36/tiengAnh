// ============================================
// PostgreSQL Database Configuration
// PostgreSQL pool with a named-parameter request adapter
// ============================================
const { Pool } = require('pg');

let pool = null;

function buildPoolConfig() {
  const connectionString = (process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL || '').trim();
  const explicitSsl = process.env.DB_SSL;
  const urlRequiresSsl = connectionString && /(?:sslmode=require|ssl=true)/i.test(connectionString);
  const ssl = explicitSsl === 'true' || (explicitSsl === undefined && urlRequiresSsl)
    ? { rejectUnauthorized: false }
    : false;

  const common = {
    ssl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };

  if (connectionString) {
    try {
      new URL(connectionString);
    } catch (error) {
      const hasPlaceholders = /PGUSER|POSTGRES_PASSWORD|RAILWAY_TCP_PROXY|PGDATABASE/i.test(connectionString);
      const hint = hasPlaceholders
        ? 'It still contains placeholder text. Replace it with the real Railway database URL.'
        : 'Use the connection string copied directly from Railway, or remove DATABASE_URL and set DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD instead.';
      throw new Error(`Invalid DATABASE_URL/DATABASE_PUBLIC_URL. ${hint}`);
    }

    return {
      connectionString,
      ...common,
    };
  }

  return {
    host: process.env.DB_HOST || process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'EnglishLearningSystem',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ...common,
  };
}

// Query type hints used by the named-parameter adapter.
// PostgreSQL infers the concrete type when executing the converted query.
const sql = {
  NVarChar: 'NVarChar',
  VarChar: 'VarChar',
  Int: 'Int',
  Float: 'Float',
  Bit: 'Bit',
  UniqueIdentifier: 'UniqueIdentifier',
  DateTime: 'DateTime',
  NText: 'NText',
  MAX: 'MAX',
};

/**
 * Request builder that exposes named parameters through
 * pool.request().input().query() and converts them to PostgreSQL placeholders.
 */
class PgRequest {
  constructor(pgPool) {
    this.pgPool = pgPool;
    this.params = {};
    this.paramOrder = [];
  }

  input(name, typeOrValue, value) {
    // Support both .input(name, type, value) and .input(name, value)
    const actualValue = value !== undefined ? value : typeOrValue;
    this.params[name] = actualValue;
    if (!this.paramOrder.includes(name)) {
      this.paramOrder.push(name);
    }
    return this;
  }

  async query(queryText) {
    // Convert @paramName to $N placeholders
    let converted = queryText;
    const values = [];
    let paramIndex = 1;
    const paramMap = {};

    // First pass: find all @param references in the query and map them
    for (const name of this.paramOrder) {
      if (queryText.includes(`@${name}`)) {
        paramMap[name] = paramIndex;
        values.push(this.params[name]);
        paramIndex++;
      }
    }

    // Replace @paramName with $N (handle longer names first to avoid partial matches)
    const sortedNames = Object.keys(paramMap).sort((a, b) => b.length - a.length);
    for (const name of sortedNames) {
      const regex = new RegExp(`@${name}\\b`, 'g');
      converted = converted.replace(regex, `$${paramMap[name]}`);
    }

    // Execute the natively converted query
    const result = await this.pgPool.query(converted, values);
    
    // Fallback to capitalizing first letter if not in map
    let columnMap = {};
    try { columnMap = require('./columnMap.json'); } catch(e) {}

    const mappedRows = result.rows.map(row => {
      const newRow = {};
      for (const key in row) {
        newRow[key] = row[key];
        // Use columnMap to restore exact original casing, else fallback to PascalCase
        const aliasKey = columnMap[key] || (key.charAt(0).toUpperCase() + key.slice(1));
        newRow[aliasKey] = row[key];
      }
      return newRow;
    });

    return {
      recordset: mappedRows,
      rowsAffected: [result.rowCount],
    };
  }
}


/**
 * Connect to PostgreSQL
 */
async function connectDB() {
  try {
    pool = new Pool(buildPoolConfig());

    // Test connection
    const client = await pool.connect();
    client.release();
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error?.message || error);
    throw error;
  }
}

/**
 * Get the active connection pool (returns wrapper with .request() method)
 */
function getPool() {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return {
    request: () => new PgRequest(pool),
    // Also expose raw pg pool for direct queries if needed
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(),
  };
}

/**
 * Close the database connection
 */
async function closeDB() {
  try {
    if (pool) {
      await pool.end();
      pool = null;
      console.log('Database connection closed.');
    }
  } catch (error) {
    console.error('Error closing database:', error.message);
  }
}

module.exports = { sql, connectDB, getPool, closeDB };
