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

async function createSuperAdmin() {
  try {
    const password = '123456';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Check if superadmin already exists
    const checkQuery = `SELECT * FROM Users WHERE username = $1 OR email = $2`;
    const checkRes = await pool.query(checkQuery, ['superadmin', 'superadmin@system.com']);
    
    if (checkRes.rows.length > 0) {
      // Update existing superadmin
      const updateQuery = `
        UPDATE Users 
        SET passwordhash = $1, role = 'superadmin', isactive = true 
        WHERE username = 'superadmin' OR email = 'superadmin@system.com'
      `;
      await pool.query(updateQuery, [passwordHash]);
      console.log('Superadmin user updated successfully with password: ' + password);
    } else {
      // Insert new superadmin
      const insertQuery = `
        INSERT INTO Users (username, email, passwordhash, role, isactive)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await pool.query(insertQuery, [
        'superadmin', 
        'superadmin@system.com', 
        passwordHash, 
        'superadmin', 
        true
      ]);
      console.log('Superadmin user created successfully with password: ' + password);
    }
  } catch (err) {
    console.error('Error creating superadmin:', err);
  } finally {
    pool.end();
  }
}

createSuperAdmin();
