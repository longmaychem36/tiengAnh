// ============================================
// PostgreSQL Database Configuration
// Compatibility layer mimicking mssql API
// ============================================
const { Pool } = require('pg');

let pool = null;

// Dummy sql type constants (for backward compatibility with mssql code)
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
 * Request builder that mimics mssql's pool.request().input().query() pattern
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
    pool = new Pool({
      host: process.env.DB_HOST || process.env.DB_SERVER || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'EnglishLearningSystem',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

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
