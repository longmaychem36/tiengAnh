const sql = require('mssql');
const config = require('./src/config/database');

async function run() {
  const pool = await config.connectDB();
  await pool.request().query(`
    INSERT INTO GameSets (Id, Name, Description, GameType, Icon, OrderIndex) 
    VALUES (NEWID(), N'Khoá Học Nói - Giao Tiếp', N'Luyện phát âm theo các chủ đề giao tiếp thực tế', 'speaking', '🗣️', 4)
  `);
  console.log('Seeded Speaking Course');
  process.exit(0);
}
run();
