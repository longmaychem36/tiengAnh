const sql = require('mssql');
const config = require('./src/config/database');

async function run() {
  const pool = await config.connectDB();
  await pool.request().query(`
    UPDATE GameSets 
    SET Name = N'Khoá Học Nói - Cấp Độ Phát Âm',
        Description = N'Lộ trình luyện nói từ cơ bản đến nâng cao (Âm đơn, Từ vựng, Cụm từ, Câu hoàn chỉnh)'
    WHERE GameType = 'speaking'
  `);
  console.log('Updated Speaking Course to Pronunciation Levels');
  process.exit(0);
}
run();
