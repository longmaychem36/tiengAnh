// ============================================
// Migration: Add superadmin role + IsActive column
// ============================================
require('dotenv').config();
const { connectDB, getPool } = require('./src/config/database');

async function migrate() {
  await connectDB();
  const pool = getPool();

  console.log('🔧 Migrating Users table...\n');

  // 1. Drop old CHECK constraint on Role
  try {
    const constraints = await pool.request().query(`
      SELECT cc.CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc
      JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu ON cc.CONSTRAINT_NAME = ccu.CONSTRAINT_NAME
      WHERE ccu.TABLE_NAME = 'Users' AND ccu.COLUMN_NAME = 'Role'
    `);
    for (const c of constraints.recordset) {
      await pool.request().query(`ALTER TABLE Users DROP CONSTRAINT [${c.CONSTRAINT_NAME}]`);
      console.log(`  ✅ Dropped constraint: ${c.CONSTRAINT_NAME}`);
    }
  } catch (e) {
    console.log('  ⚠️ No Role constraint found, skipping drop');
  }

  // 2. Add new CHECK constraint with superadmin
  try {
    await pool.request().query(`
      ALTER TABLE Users ADD CONSTRAINT CK_Users_Role 
      CHECK (Role IN ('user', 'admin', 'superadmin'))
    `);
    console.log("  ✅ Added new constraint: Role IN ('user', 'admin', 'superadmin')");
  } catch (e) {
    console.log('  ⚠️ Constraint already exists or error:', e.message);
  }

  // 3. Add IsActive column if not exists
  try {
    const cols = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='Users' AND COLUMN_NAME='IsActive'");
    if (cols.recordset.length === 0) {
      await pool.request().query('ALTER TABLE Users ADD IsActive BIT DEFAULT 1 NOT NULL');
      console.log('  ✅ Added IsActive column (default: 1 = active)');
    } else {
      console.log('  ⚠️ IsActive column already exists');
    }
  } catch (e) {
    console.log('  ❌ Error adding IsActive:', e.message);
  }

  console.log('\n🎉 Migration complete!');
  process.exit(0);
}

migrate().catch(err => { console.error('❌', err.message); process.exit(1); });
