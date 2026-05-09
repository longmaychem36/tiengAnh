// ============================================
// SQL Server Database Configuration
// ============================================
const sql = require('mssql/msnodesqlv8');

const dbConfig = {
  connectionString: `Driver={SQL Server};Server=${process.env.DB_SERVER || 'localhost\\SQLEXPRESS'};Database=${process.env.DB_NAME || 'EnglishLearningSystem'};Trusted_Connection=yes;`
};

let pool = null;

/**
 * Connect to SQL Server and return the connection pool
 */
async function connectDB() {
  try {
    pool = await sql.connect(dbConfig);
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
