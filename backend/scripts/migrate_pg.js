const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

function buildPoolConfig() {
  const connectionString = (process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL || '').trim();
  const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

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

    return { connectionString, ssl };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl,
  };
}

async function runMigration() {
  console.log('Connecting to PostgreSQL database...');
  console.log(`Host: ${process.env.DB_HOST || (process.env.DATABASE_URL ? '[DATABASE_URL]' : undefined)}`);
  console.log(`Database: ${process.env.DB_NAME || '[from connection string]'}`);

  const pool = new Pool(buildPoolConfig());
  let client;

  try {
    client = await pool.connect();
    console.log('Connected successfully.');

    console.log('Reading cosodulieu.sql...');
    const sqlPath = path.join(__dirname, '..', '..', 'cosodulieu.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing SQL dump...');
    await client.query(sqlContent);

    console.log('Database schema created successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    if (/copy/i.test(err.message)) {
      console.error('This dump uses COPY FROM stdin. Use psql for a full restore, or run npm.cmd run db:import-data after tables exist.');
    }
    process.exitCode = 1;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

runMigration();
