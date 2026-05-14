require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function run() {
  try {
    await connectDB();
    const pool = getPool();

    await pool.query(
      `
        UPDATE GameSets
        SET Name = $1,
            Description = $2
        WHERE GameType = 'speaking'
      `,
      [
        'Khoa hoc Noi - Cap do Phat am',
        'Lo trinh luyen noi tu co ban den nang cao (am don, tu vung, cum tu, cau hoan chinh)',
      ]
    );

    console.log('Updated speaking game set.');
  } catch (err) {
    console.error('Update failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

run();
