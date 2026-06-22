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

    await pool.query(`
      DO $
      DECLARE constraint_name text;
      BEGIN
        SELECT con.conname INTO constraint_name
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY(con.conkey)
        WHERE rel.relname = 'users'
          AND att.attname = 'role'
          AND con.contype = 'c'
        LIMIT 1;

        IF constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE Users DROP CONSTRAINT %I', constraint_name);
        END IF;

        ALTER TABLE Users
        ADD CONSTRAINT ck_users_role
        CHECK (Role IN ('user', 'admin'));
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
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
