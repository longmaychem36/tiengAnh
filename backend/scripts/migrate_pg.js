const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function runMigration() {
  console.log('⏳ Connecting to PostgreSQL database...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected successfully!');

    console.log('⏳ Reading cosodulieu.sql...');
    const sqlPath = path.join(__dirname, '..', '..', 'cosodulieu.sql');
    let sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Remove SQL Server specific GO commands and use simple execution
    console.log('⏳ Executing schema creation...');
    await client.query(sqlContent);
    
    console.log('✅ Database schema created successfully!');
    client.release();
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();
