const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'EnglishLearningSystem',
  password: process.env.DB_PASSWORD || '1',
  port: process.env.DB_PORT || 5432,
});

async function createAdmin() {
  try {
    const password = '123456';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if admin already exists
    const checkQuery = `SELECT * FROM Users WHERE username = $1 OR email = $2`;
    const checkRes = await pool.query(checkQuery, ['admin', 'admin@system.com']);

    if (checkRes.rows.length > 0) {
      // Update existing admin
      const updateQuery = `
        UPDATE Users
        SET passwordhash = $1, role = 'admin', isactive = true
        WHERE username = 'admin' OR email = 'admin@system.com'
      `;
      await pool.query(updateQuery, [passwordHash]);
      console.log('Admin user updated successfully with password: ' + password);
    } else {
      // Insert new admin
      const insertQuery = `
        INSERT INTO Users (username, email, passwordhash, role, isactive)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await pool.query(insertQuery, [
        'admin',
        'admin@system.com',
        passwordHash,
        'admin',
        true
      ]);
      console.log('Admin user created successfully with password: ' + password);
    }
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    pool.end();
  }
}

createAdmin();
