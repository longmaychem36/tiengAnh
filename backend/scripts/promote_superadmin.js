// ============================================
// Promote a user to SuperAdmin
// Usage: node promote_superadmin.js <email>
// ============================================
require('dotenv').config();
const { connectDB, getPool, sql } = require('./src/config/database');

async function promote() {
  const email = process.argv[2];
  if (!email) {
    console.log('Usage: node promote_superadmin.js <email>');
    console.log('Example: node promote_superadmin.js admin@test.com');
    process.exit(1);
  }

  await connectDB();
  const pool = getPool();

  // Check user exists
  const user = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT Id, Username, Email, Role FROM Users WHERE Email = @email');

  if (user.recordset.length === 0) {
    console.log(`❌ User with email "${email}" not found.`);
    
    // List all users
    const all = await pool.request().query('SELECT Email, Username, Role FROM Users ORDER BY CreatedAt DESC');
    console.log('\n📋 Available users:');
    all.recordset.forEach(u => console.log(`  ${u.Email} — ${u.Username} (${u.Role})`));
    process.exit(1);
  }

  const u = user.recordset[0];
  console.log(`\n👤 Found: ${u.Username} (${u.Email})`);
  console.log(`   Current role: ${u.Role}`);

  // Promote
  await pool.request()
    .input('id', sql.UniqueIdentifier, u.Id)
    .query("UPDATE Users SET Role = 'superadmin' WHERE Id = @id");

  console.log(`   ✅ Promoted to: superadmin 👑`);
  console.log('\n🎉 Done! Login again to see the changes.');
  process.exit(0);
}

promote().catch(err => { console.error('❌', err.message); process.exit(1); });
