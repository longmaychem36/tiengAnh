require('dotenv').config();
const { connectDB, getPool } = require('../src/config/database');

async function seedMixedGame() {
  await connectDB();
  const pool = getPool();

  console.log('Clearing old mixed game sets...');
  await pool.query(`DELETE FROM MiniGameQuestions WHERE LevelId IN (SELECT Id FROM GameLevels WHERE SetId IN (SELECT Id FROM GameSets WHERE GameType = 'mixed'))`);
  await pool.query(`DELETE FROM UserGameProgress WHERE LevelId IN (SELECT Id FROM GameLevels WHERE SetId IN (SELECT Id FROM GameSets WHERE GameType = 'mixed'))`);
  await pool.query(`DELETE FROM GameLevels WHERE SetId IN (SELECT Id FROM GameSets WHERE GameType = 'mixed')`);
  await pool.query(`DELETE FROM GameSets WHERE GameType = 'mixed'`);

  console.log('Creating mixed game set...');

  // 1. Create new mixed game set
  const setRes = await pool.query(`
    INSERT INTO GameSets (Id, Name, Description, Icon, GameType, OrderIndex)
    VALUES (gen_random_uuid(), $1, $2, $3, 'mixed', 3)
    RETURNING Id
  `, [
    'Tổng hợp - Cơ bản',
    'Kết hợp cả 4 loại mini game: Nối từ, Nghe chọn, Nghe xếp câu và Đúng/Sai',
    '🎮'
  ]);
  const setId = setRes.rows[0].id;
  console.log('Set created:', setId);

  // 2. Create 3 levels for the set
  const levels = [
    { name: 'Khởi động', difficulty: 'easy', timeLimit: 120, passScore: 60, levelNumber: 1 },
    { name: 'Nâng cao', difficulty: 'medium', timeLimit: 100, passScore: 70, levelNumber: 2 },
    { name: 'Thách thức', difficulty: 'hard', timeLimit: 80, passScore: 80, levelNumber: 3 },
  ];

  for (const lv of levels) {
    const lvRes = await pool.query(`
      INSERT INTO GameLevels (Id, SetId, LevelNumber, Name, Difficulty, TimeLimit, PassScore, IsLocked)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, false)
      RETURNING Id
    `, [setId, lv.levelNumber, lv.name, lv.difficulty, lv.timeLimit, lv.passScore]);
    const levelId = lvRes.rows[0].id;
    console.log(`Level ${lv.levelNumber} created:`, levelId);

    // 3. Seed 10 mixed questions per level
    const questions = getMixedQuestions(lv.levelNumber);
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await pool.query(`
        INSERT INTO MiniGameQuestions (Id, LevelId, QuestionType, ContentEN, ContentVI, AudioUrl, CorrectAnswer, Options, OrderIndex)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)
      `, [levelId, q.questionType, q.contentEN, q.contentVI, q.audioUrl || null, q.correctAnswer, JSON.stringify(q.options), i]);
    }
    console.log(`Seeded ${questions.length} questions for level ${lv.levelNumber}`);
  }

  console.log('Done!');
  process.exit(0);
}

function getMixedQuestions(level) {
  const easy = [
    // matching (2 questions)
    { questionType: 'matching', contentEN: 'Apple', contentVI: 'Táo', correctAnswer: 'Apple', options: [], audioUrl: null },
    { questionType: 'matching', contentEN: 'Water', contentVI: 'Nước', correctAnswer: 'Water', options: [], audioUrl: null },

    // listening / listen_choose (2 questions)
    { questionType: 'listening', contentEN: 'Good morning', contentVI: 'Chào buổi sáng', correctAnswer: 'Good morning', options: ['Good night', 'Good morning', 'Good afternoon', 'Hello'], audioUrl: null },
    { questionType: 'listening', contentEN: 'Thank you', contentVI: 'Cảm ơn', correctAnswer: 'Thank you', options: ['Excuse me', 'Sorry', 'Thank you', 'Please'], audioUrl: null },

    // listenbuild (3 questions)
    { questionType: 'listenbuild', contentEN: 'I go to school', contentVI: 'Tôi đi học', correctAnswer: 'I go to school', options: ['I', 'go', 'to', 'school'], audioUrl: null },
    { questionType: 'listenbuild', contentEN: 'She is my friend', contentVI: 'Cô ấy là bạn tôi', correctAnswer: 'She is my friend', options: ['She', 'is', 'my', 'friend'], audioUrl: null },
    { questionType: 'listenbuild', contentEN: 'We eat lunch', contentVI: 'Chúng tôi ăn trưa', correctAnswer: 'We eat lunch', options: ['We', 'eat', 'lunch'], audioUrl: null },

    // truefalse (3 questions)
    { questionType: 'truefalse', contentEN: 'Hello', contentVI: 'Xin chào', correctAnswer: 'true', options: [], audioUrl: null },
    { questionType: 'truefalse', contentEN: 'Goodbye', contentVI: 'Hẹn gặp lại', correctAnswer: 'true', options: [], audioUrl: null },
    { questionType: 'truefalse', contentEN: 'Cat', contentVI: 'Con chó', correctAnswer: 'false', options: [], audioUrl: null },
  ];

  const medium = [
    { questionType: 'matching', contentEN: 'Beautiful', contentVI: 'Đẹp', correctAnswer: 'Beautiful', options: [], audioUrl: null },
    { questionType: 'matching', contentEN: 'Important', contentVI: 'Quan trọng', correctAnswer: 'Important', options: [], audioUrl: null },
    { questionType: 'listening', contentEN: 'How are you', contentVI: 'Bạn khỏe không', correctAnswer: 'How are you', options: ['Who are you', 'Where are you', 'How are you', 'What are you'], audioUrl: null },
    { questionType: 'listening', contentEN: 'Nice to meet you', contentVI: 'Rất vui được gặp bạn', correctAnswer: 'Nice to meet you', options: ['Nice to see you', 'Glad to meet you', 'Nice to meet you', 'Good to see you'], audioUrl: null },
    { questionType: 'listenbuild', contentEN: 'He plays football every day', contentVI: 'Anh ấy chơi bóng đá mỗi ngày', correctAnswer: 'He plays football every day', options: ['He', 'plays', 'football', 'every', 'day'], audioUrl: null },
    { questionType: 'listenbuild', contentEN: 'They study English at home', contentVI: 'Họ học tiếng Anh ở nhà', correctAnswer: 'They study English at home', options: ['They', 'study', 'English', 'at', 'home'], audioUrl: null },
    { questionType: 'listenbuild', contentEN: 'I like reading books', contentVI: 'Tôi thích đọc sách', correctAnswer: 'I like reading books', options: ['I', 'like', 'reading', 'books'], audioUrl: null },
    { questionType: 'truefalse', contentEN: 'The sun rises in the east', contentVI: 'Mặt trời mọc ở hướng đông', correctAnswer: 'true', options: [], audioUrl: null },
    { questionType: 'truefalse', contentEN: 'Dogs can fly', contentVI: 'Chó có thể bay', correctAnswer: 'false', options: [], audioUrl: null },
    { questionType: 'truefalse', contentEN: 'Water boils at 100 degrees', contentVI: 'Nước sôi ở 100 độ', correctAnswer: 'true', options: [], audioUrl: null },
  ];

  const hard = [
    { questionType: 'matching', contentEN: 'Enthusiastic', contentVI: 'Nhiệt tình', correctAnswer: 'Enthusiastic', options: [], audioUrl: null },
    { questionType: 'matching', contentEN: 'Responsible', contentVI: 'Có trách nhiệm', correctAnswer: 'Responsible', options: [], audioUrl: null },
    { questionType: 'listening', contentEN: 'Could you repeat that please', contentVI: 'Bạn có thể nói lại được không', correctAnswer: 'Could you repeat that please', options: ['Can you say it again', 'Would you repeat that', 'Could you repeat that please', 'Please say it again'], audioUrl: null },
    { questionType: 'listening', contentEN: 'I would like to order', contentVI: 'Tôi muốn gọi món', correctAnswer: 'I would like to order', options: ['I want to order', 'I would like to order', 'May I order please', 'I need to order'], audioUrl: null },
    { questionType: 'listenbuild', contentEN: 'She has been studying for three hours', contentVI: 'Cô ấy đã học được ba giờ', correctAnswer: 'She has been studying for three hours', options: ['She', 'has', 'been', 'studying', 'for', 'three', 'hours'], audioUrl: null },
    { questionType: 'listenbuild', contentEN: 'We should go to the hospital', contentVI: 'Chúng ta nên đi bệnh viện', correctAnswer: 'We should go to the hospital', options: ['We', 'should', 'go', 'to', 'the', 'hospital'], audioUrl: null },
    { questionType: 'listenbuild', contentEN: 'The movie was really interesting', contentVI: 'Bộ phim thật sự rất thú vị', correctAnswer: 'The movie was really interesting', options: ['The', 'movie', 'was', 'really', 'interesting'], audioUrl: null },
    { questionType: 'truefalse', contentEN: 'Vietnam is in Southeast Asia', contentVI: 'Việt Nam ở Đông Nam Á', correctAnswer: 'true', options: [], audioUrl: null },
    { questionType: 'truefalse', contentEN: 'Paris is the capital of Germany', contentVI: 'Paris là thủ đô của Đức', correctAnswer: 'false', options: [], audioUrl: null },
    { questionType: 'truefalse', contentEN: 'The Earth revolves around the Sun', contentVI: 'Trái đất quay quanh Mặt Trời', correctAnswer: 'true', options: [], audioUrl: null },
  ];

  if (level === 1) return easy;
  if (level === 2) return medium;
  return hard;
}

seedMixedGame().catch(e => { console.error(e); process.exit(1); });
