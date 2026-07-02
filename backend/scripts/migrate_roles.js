require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function migrate() {
  try {
    await connectDB();
    const pool = getPool();

    await pool.query(`
      ALTER TABLE Users
      ADD COLUMN IF NOT EXISTS IsActive boolean DEFAULT true NOT NULL
    `);

    await pool.query(`
      UPDATE Users
      SET Role = 'admin'
      WHERE Role = 'superadmin'
    `);

    const constraints = await pool.query(`
      SELECT con.conname
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      WHERE rel.oid = 'users'::regclass
        AND con.contype = 'c'
        AND pg_get_constraintdef(con.oid) ILIKE '%role%'
    `);

    for (const { conname } of constraints.rows) {
      const quotedName = `"${String(conname).replace(/"/g, '""')}"`;
      await pool.query(`ALTER TABLE Users DROP CONSTRAINT ${quotedName}`);
    }

    await pool.query(`
      ALTER TABLE Users
      ADD CONSTRAINT ck_users_role
      CHECK (Role IN ('user', 'admin'))
    `);

    console.log('Roles migration completed: user/admin only.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrate();
