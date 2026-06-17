require('dotenv').config();
const { connectDB, getPool, closeDB } = require('../src/config/database');

const levels = [
  {
    levelNumber: 1,
    name: 'Warm up',
    difficulty: 'easy',
    timeLimit: 120,
    passScore: 60,
    questions: [
      ['matching', 'Apple', 'Qua tao', 'Apple', []],
      ['matching', 'Water', 'Nuoc', 'Water', []],
      ['listening', 'Good morning', 'Chao buoi sang', 'Good morning', ['Good night', 'Good morning', 'Good afternoon']],
      ['listening', 'Thank you', 'Cam on', 'Thank you', ['Sorry', 'Thank you', 'Please']],
      ['listenbuild', 'I go to school', 'Toi di hoc', 'I go to school', ['I', 'go', 'to', 'school']],
      ['listenbuild', 'We eat lunch', 'Chung toi an trua', 'We eat lunch', ['We', 'eat', 'lunch']],
      ['truefalse', 'Hello', 'Xin chao', 'true', []],
      ['truefalse', 'Cat', 'Con cho', 'false', []],
    ],
  },
  {
    levelNumber: 2,
    name: 'Practice',
    difficulty: 'medium',
    timeLimit: 100,
    passScore: 70,
    questions: [
      ['matching', 'Beautiful', 'Dep', 'Beautiful', []],
      ['matching', 'Important', 'Quan trong', 'Important', []],
      ['listening', 'How are you', 'Ban khoe khong', 'How are you', ['Who are you', 'Where are you', 'How are you']],
      ['listening', 'Nice to meet you', 'Rat vui duoc gap ban', 'Nice to meet you', ['Nice to see you', 'Nice to meet you']],
      ['listenbuild', 'He plays football every day', 'Anh ay choi bong da moi ngay', 'He plays football every day', ['He', 'plays', 'football', 'every', 'day']],
      ['listenbuild', 'I like reading books', 'Toi thich doc sach', 'I like reading books', ['I', 'like', 'reading', 'books']],
      ['truefalse', 'The sun rises in the east', 'Mat troi moc o huong dong', 'true', []],
      ['truefalse', 'Dogs can fly', 'Cho co the bay', 'false', []],
    ],
  },
  {
    levelNumber: 3,
    name: 'Challenge',
    difficulty: 'hard',
    timeLimit: 80,
    passScore: 80,
    questions: [
      ['matching', 'Responsible', 'Co trach nhiem', 'Responsible', []],
      ['matching', 'Enthusiastic', 'Nhiet tinh', 'Enthusiastic', []],
      ['listening', 'Could you repeat that please', 'Ban co the noi lai khong', 'Could you repeat that please', ['Can you say it again', 'Could you repeat that please']],
      ['listening', 'I would like to order', 'Toi muon goi mon', 'I would like to order', ['I want to order', 'I would like to order']],
      ['listenbuild', 'She has been studying for three hours', 'Co ay da hoc duoc ba gio', 'She has been studying for three hours', ['She', 'has', 'been', 'studying', 'for', 'three', 'hours']],
      ['listenbuild', 'The movie was really interesting', 'Bo phim that su rat thu vi', 'The movie was really interesting', ['The', 'movie', 'was', 'really', 'interesting']],
      ['truefalse', 'Vietnam is in Southeast Asia', 'Viet Nam o Dong Nam A', 'true', []],
      ['truefalse', 'Paris is the capital of Germany', 'Paris la thu do cua Duc', 'false', []],
    ],
  },
];

async function seedMixedGame() {
  await connectDB();
  const pool = getPool();

  try {
    console.log('Clearing old mini game levels...');
    await pool.query('DELETE FROM MiniGameQuestions WHERE LevelId IN (SELECT Id FROM GameLevels)');
    await pool.query('DELETE FROM UserGameProgress WHERE LevelId IN (SELECT Id FROM GameLevels)');
    await pool.query('DELETE FROM GameLevels');

    for (const level of levels) {
      const levelRes = await pool.query(`
        INSERT INTO GameLevels (Id, LevelNumber, Name, Difficulty, TimeLimit, PassScore, IsLocked)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, false)
        RETURNING Id
      `, [level.levelNumber, level.name, level.difficulty, level.timeLimit, level.passScore]);
      const levelId = levelRes.rows[0].id;

      for (const [index, question] of level.questions.entries()) {
        const [questionType, contentEN, contentVI, correctAnswer, options] = question;
        await pool.query(`
          INSERT INTO MiniGameQuestions (Id, LevelId, QuestionType, ContentEN, ContentVI, AudioUrl, CorrectAnswer, Options, OrderIndex)
          VALUES (gen_random_uuid(), $1, $2, $3, $4, NULL, $5, $6, $7)
        `, [levelId, questionType, contentEN, contentVI, correctAnswer, JSON.stringify(options), index]);
      }

      console.log(`Seeded level ${level.levelNumber}: ${level.questions.length} questions`);
    }

    console.log('Mini game seed completed.');
  } finally {
    await closeDB();
  }
}

seedMixedGame().catch(e => { console.error(e); process.exit(1); });
