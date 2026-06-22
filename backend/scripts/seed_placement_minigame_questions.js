require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');
const { ensureOnboardingSchema } = require('../src/modules/onboarding/onboarding.schema');

const QUESTIONS = [
  { questionType: 'matching', difficulty: 'easy', pointRatio: 1, contentEN: 'apple', contentVI: 'quả táo', correctAnswer: 'quả táo', options: ['quả táo', 'quả chuối', 'quyển sách'], orderIndex: 1 },
  { questionType: 'matching', difficulty: 'easy', pointRatio: 1, contentEN: 'train', contentVI: 'tàu hỏa', correctAnswer: 'tàu hỏa', options: ['xe đạp', 'tàu hỏa', 'máy bay'], orderIndex: 2 },
  { questionType: 'matching', difficulty: 'hard', pointRatio: 1.5, contentEN: 'responsibility', contentVI: 'trách nhiệm', correctAnswer: 'trách nhiệm', options: ['sự thuận tiện', 'trách nhiệm', 'lời mời'], orderIndex: 3 },
  { questionType: 'listening', difficulty: 'easy', pointRatio: 1, contentEN: 'Good morning', contentVI: 'Chào buổi sáng', correctAnswer: 'Good morning', options: ['Good morning', 'Good night', 'Good evening'], orderIndex: 4 },
  { questionType: 'listening', difficulty: 'easy', pointRatio: 1, contentEN: 'I like milk', contentVI: 'Tôi thích sữa', correctAnswer: 'I like milk', options: ['I like milk', 'I like tea', 'I need milk'], orderIndex: 5 },
  { questionType: 'listening', difficulty: 'hard', pointRatio: 1.5, contentEN: 'Could you repeat that more slowly?', contentVI: 'Bạn có thể nhắc lại chậm hơn không?', correctAnswer: 'Could you repeat that more slowly?', options: ['Could you repeat that more slowly?', 'Could you read that more loudly?', 'Could you write that down for me?'], orderIndex: 6 },
  { questionType: 'listenbuild', difficulty: 'easy', pointRatio: 1, contentEN: 'I am a student', contentVI: 'Tôi là học sinh', correctAnswer: 'I am a student', options: ['I', 'am', 'a', 'student', 'teacher'], orderIndex: 7 },
  { questionType: 'listenbuild', difficulty: 'easy', pointRatio: 1, contentEN: 'We go to school', contentVI: 'Chúng tôi đi học', correctAnswer: 'We go to school', options: ['We', 'go', 'to', 'school', 'home'], orderIndex: 8 },
  { questionType: 'listenbuild', difficulty: 'hard', pointRatio: 1.5, contentEN: 'She usually takes the bus to work', contentVI: 'Cô ấy thường đi xe buýt đến chỗ làm', correctAnswer: 'She usually takes the bus to work', options: ['She', 'usually', 'takes', 'the', 'bus', 'to', 'work', 'walks'], orderIndex: 9 },
  { questionType: 'truefalse', difficulty: 'easy', pointRatio: 1, contentEN: 'A cat is an animal', contentVI: 'Mèo là một con vật', correctAnswer: 'true', options: null, orderIndex: 10 },
  { questionType: 'truefalse', difficulty: 'easy', pointRatio: 1, contentEN: 'The dog is black', contentVI: 'Con chó màu trắng', correctAnswer: 'false', options: null, orderIndex: 11 },
  { questionType: 'truefalse', difficulty: 'hard', pointRatio: 1.5, contentEN: 'He has lived here for three years', contentVI: 'Anh ấy đã sống ở đây được ba năm', correctAnswer: 'true', options: null, orderIndex: 12 },
  { questionType: 'speakrepeat', difficulty: 'easy', pointRatio: 1, contentEN: 'I can help you', contentVI: 'Tôi có thể giúp bạn', correctAnswer: 'I can help you', options: { passScore: 70 }, orderIndex: 13 },
  { questionType: 'speakrepeat', difficulty: 'easy', pointRatio: 1, contentEN: 'Open the door please', contentVI: 'Vui lòng mở cửa', correctAnswer: 'Open the door please', options: { passScore: 70 }, orderIndex: 14 },
  { questionType: 'speakrepeat', difficulty: 'hard', pointRatio: 1.5, contentEN: 'The weather changed quickly after lunch', contentVI: 'Thời tiết thay đổi nhanh sau bữa trưa', correctAnswer: 'The weather changed quickly after lunch', options: { passScore: 75 }, orderIndex: 15 }
];

async function seed() {
  await connectDB();
  await ensureOnboardingSchema();
  const pool = getPool();
  let inserted = 0;
  let updated = 0;
  for (const item of QUESTIONS) {
    const existing = await pool.query(`
      SELECT Id
      FROM PlacementMiniGameQuestions
      WHERE QuestionType = $1
        AND lower(ContentEN) = lower($2)
      ORDER BY CreatedAt ASC
      LIMIT 1
    `, [item.questionType, item.contentEN]);

    if (existing.rowCount > 0) {
      const result = await pool.query(`
        UPDATE PlacementMiniGameQuestions
        SET ContentVI = $1,
            CorrectAnswer = $2,
            Options = $3::jsonb,
            Difficulty = $4,
            PointRatio = $5,
            OrderIndex = $6,
            UpdatedAt = NOW()
        WHERE Id = $7
      `, [
        item.contentVI,
        item.correctAnswer,
        item.options ? JSON.stringify(item.options) : null,
        item.difficulty,
        item.pointRatio,
        item.orderIndex,
        existing.rows[0].id
      ]);
      updated += result.rowCount;
      continue;
    }

    await pool.query(`
      INSERT INTO PlacementMiniGameQuestions
        (QuestionType, ContentEN, ContentVI, CorrectAnswer, Options, Difficulty, PointRatio, IsActive, OrderIndex)
      VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, true, $8)
    `, [
      item.questionType,
      item.contentEN,
      item.contentVI,
      item.correctAnswer,
      item.options ? JSON.stringify(item.options) : null,
      item.difficulty,
      item.pointRatio,
      item.orderIndex
    ]);
    inserted += 1;
  }

  console.log(JSON.stringify({
    insertedPlacementMiniGameQuestions: inserted,
    updatedPlacementMiniGameQuestions: updated
  }, null, 2));
}

seed()
  .catch((error) => {
    console.error('Seed placement minigame questions failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDB();
  });