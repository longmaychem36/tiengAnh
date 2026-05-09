// ============================================
// SQL Server Database Configuration
// Supports both Windows Auth (dev) and SQL Auth (production/cloud)
// ============================================
const sql = require('mssql');

function getDbConfig() {
  // Production mode: use username/password authentication (for Azure SQL, Render, etc.)
  if (process.env.NODE_ENV === 'production' || process.env.DB_USER) {
    return {
      server: process.env.DB_SERVER || 'localhost',
      database: process.env.DB_NAME || 'EnglishLearningSystem',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT) || 1433,
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      requestTimeout: 30000,
      connectionTimeout: 30000
    };
  }

  // Development mode: use Windows Authentication via msnodesqlv8
  const sqlLocal = require('mssql/msnodesqlv8');
  return {
    connectionString: `Driver={SQL Server};Server=${process.env.DB_SERVER || 'localhost\\SQLEXPRESS'};Database=${process.env.DB_NAME || 'EnglishLearningSystem'};Trusted_Connection=yes;`
  };
}

let pool = null;

/**
 * Connect to SQL Server and return the connection pool
 */
async function connectDB() {
  try {
    const config = getDbConfig();
    
    // Use msnodesqlv8 driver for local Windows Auth
    if (config.connectionString) {
      const sqlLocal = require('mssql/msnodesqlv8');
      pool = await sqlLocal.connect(config);
    } else {
      pool = await sql.connect(config);
    }
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error?.message || error);
    if (error && typeof error === 'object') {
      console.error('Error Details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
    throw error;
  }
}

/**
 * Get the active connection pool
 */
function getPool() {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return pool;
}

/**
 * Close the database connection
 */
async function closeDB() {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('Database connection closed.');
    }
  } catch (error) {
    console.error('Error closing database:', error.message);
  }
}

module.exports = { sql, connectDB, getPool, closeDB };
