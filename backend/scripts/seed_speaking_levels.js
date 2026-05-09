const sql = require('mssql');
const config = require('./src/config/database');

async function run() {
  const pool = await config.connectDB();
  
  // Find the speaking set
  const setRes = await pool.request().query(`SELECT Id FROM GameSets WHERE GameType = 'speaking'`);
  if (setRes.recordset.length === 0) {
      console.log('No speaking set found');
      process.exit(1);
  }
  const setId = setRes.recordset[0].Id;

  // Xoá dữ liệu cũ của set này
  const levelsRes = await pool.request().input('setId', sql.UniqueIdentifier, setId).query(`SELECT Id FROM GameLevels WHERE SetId = @setId`);
  for (let l of levelsRes.recordset) {
      await pool.request().input('levelId', sql.UniqueIdentifier, l.Id).query(`DELETE FROM MiniGameQuestions WHERE LevelId = @levelId`);
  }
  await pool.request().input('setId', sql.UniqueIdentifier, setId).query(`DELETE FROM GameLevels WHERE SetId = @setId`);

  console.log('Deleted old speaking levels.');

  // Thêm 4 cấp độ
  const levels = [
      { Title: 'Cấp độ 1: Âm đơn', Description: 'Luyện phát âm các từ ngắn' },
      { Title: 'Cấp độ 2: Từ vựng đa âm tiết', Description: 'Luyện trọng âm và âm tiết' },
      { Title: 'Cấp độ 3: Cụm từ', Description: 'Luyện ngữ điệu cụm từ' },
      { Title: 'Cấp độ 4: Câu hoàn chỉnh', Description: 'Luyện nối âm và ngữ điệu câu' }
  ];

  const questions = [
      [ // Level 1
          { ContentEN: 'Cat', ContentVI: 'Con mèo', CorrectAnswer: '100' },
          { ContentEN: 'Dog', ContentVI: 'Con chó', CorrectAnswer: '100' },
          { ContentEN: 'Pen', ContentVI: 'Cái bút', CorrectAnswer: '100' },
          { ContentEN: 'Sun', ContentVI: 'Mặt trời', CorrectAnswer: '100' }
      ],
      [ // Level 2
          { ContentEN: 'Beautiful', ContentVI: 'Xinh đẹp', CorrectAnswer: '100' },
          { ContentEN: 'Computer', ContentVI: 'Máy tính', CorrectAnswer: '100' },
          { ContentEN: 'Important', ContentVI: 'Quan trọng', CorrectAnswer: '100' },
          { ContentEN: 'Family', ContentVI: 'Gia đình', CorrectAnswer: '100' }
      ],
      [ // Level 3
          { ContentEN: 'Good morning', ContentVI: 'Chào buổi sáng', CorrectAnswer: '100' },
          { ContentEN: 'Thank you very much', ContentVI: 'Cảm ơn rất nhiều', CorrectAnswer: '100' },
          { ContentEN: 'See you later', ContentVI: 'Hẹn gặp lại', CorrectAnswer: '100' }
      ],
      [ // Level 4
          { ContentEN: 'I love learning English every day', ContentVI: 'Tôi yêu việc học tiếng Anh mỗi ngày', CorrectAnswer: '100' },
          { ContentEN: 'Could you please tell me the way to the station', ContentVI: 'Bạn có thể chỉ đường tới nhà ga không?', CorrectAnswer: '100' },
          { ContentEN: 'Practice makes perfect', ContentVI: 'Có công mài sắt có ngày nên kim', CorrectAnswer: '100' }
      ]
  ];

  for (let i = 0; i < levels.length; i++) {
      const l = levels[i];
      const res = await pool.request()
          .input('setId', sql.UniqueIdentifier, setId)
          .input('name', sql.NVarChar, l.Title + ' - ' + l.Description)
          .input('timeLimit', sql.Int, 0)
          .input('levelNumber', sql.Int, i + 1)
          .query(`
              INSERT INTO GameLevels (SetId, Name, TimeLimit, LevelNumber)
              OUTPUT INSERTED.Id
              VALUES (@setId, @name, @timeLimit, @levelNumber)
          `);
      
      const levelId = res.recordset[0].Id;
      
      for (let q of questions[i]) {
          await pool.request()
              .input('levelId', sql.UniqueIdentifier, levelId)
              .input('qType', sql.NVarChar, 'speaking')
              .input('en', sql.NVarChar, q.ContentEN)
              .input('vi', sql.NVarChar, q.ContentVI)
              .input('ans', sql.NVarChar, q.CorrectAnswer)
              .query(`
                  INSERT INTO MiniGameQuestions (LevelId, QuestionType, ContentEN, ContentVI, CorrectAnswer)
                  VALUES (@levelId, @qType, @en, @vi, @ans)
              `);
      }
  }

  console.log('Seeded Speaking Course Levels and Questions successfully!');
  process.exit(0);
}
run();
