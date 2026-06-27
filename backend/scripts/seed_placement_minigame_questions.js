require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');
const { ensureOnboardingSchema } = require('../src/modules/onboarding/onboarding.schema');

const QUESTIONS = [
  { questionType: 'matching', difficulty: 'easy', pointRatio: 1, contentEN: 'apple', contentVI: 'quả táo', correctAnswer: 'quả táo', options: ['quả táo', 'quả chuối', 'quyển sách', 'cái ghế'], orderIndex: 1 },
  { questionType: 'matching', difficulty: 'easy', pointRatio: 1, contentEN: 'train', contentVI: 'tàu hỏa', correctAnswer: 'tàu hỏa', options: ['xe đạp', 'tàu hỏa', 'máy bay', 'xe buýt'], orderIndex: 2 },
  { questionType: 'matching', difficulty: 'easy', pointRatio: 1, contentEN: 'book', contentVI: 'quyển sách', correctAnswer: 'quyển sách', options: ['cây bút', 'quyển sách', 'cái bàn', 'cửa sổ'], orderIndex: 3 },
  { questionType: 'matching', difficulty: 'easy', pointRatio: 1, contentEN: 'water', contentVI: 'nước', correctAnswer: 'nước', options: ['cơm', 'sữa', 'nước', 'bánh mì'], orderIndex: 4 },
  { questionType: 'matching', difficulty: 'hard', pointRatio: 1.5, contentEN: 'responsibility', contentVI: 'trách nhiệm', correctAnswer: 'trách nhiệm', options: ['sự thuận tiện', 'trách nhiệm', 'lời mời', 'kỳ nghỉ'], orderIndex: 5 },
  { questionType: 'matching', difficulty: 'hard', pointRatio: 1.5, contentEN: 'opportunity', contentVI: 'cơ hội', correctAnswer: 'cơ hội', options: ['kinh nghiệm', 'cơ hội', 'thử thách', 'mục tiêu'], orderIndex: 6 },
  { questionType: 'matching', difficulty: 'hard', pointRatio: 1.5, contentEN: 'environment', contentVI: 'môi trường', correctAnswer: 'môi trường', options: ['môi trường', 'giáo dục', 'sức khỏe', 'công nghệ'], orderIndex: 7 },

  { questionType: 'listening', difficulty: 'easy', pointRatio: 1, contentEN: 'Good morning', contentVI: 'Chào buổi sáng', correctAnswer: 'Good morning', options: ['Good morning', 'Good night', 'Good evening', 'Goodbye'], orderIndex: 8 },
  { questionType: 'listening', difficulty: 'easy', pointRatio: 1, contentEN: 'I like milk', contentVI: 'Tôi thích sữa', correctAnswer: 'I like milk', options: ['I like milk', 'I like tea', 'I need milk', 'I drink water'], orderIndex: 9 },
  { questionType: 'listening', difficulty: 'easy', pointRatio: 1, contentEN: 'This is my pen', contentVI: 'Đây là bút của tôi', correctAnswer: 'This is my pen', options: ['This is my pen', 'This is my bag', 'That is my pen', 'This is your pen'], orderIndex: 10 },
  { questionType: 'listening', difficulty: 'easy', pointRatio: 1, contentEN: 'She is happy', contentVI: 'Cô ấy vui', correctAnswer: 'She is happy', options: ['She is happy', 'She is hungry', 'He is happy', 'She is busy'], orderIndex: 11 },
  { questionType: 'listening', difficulty: 'hard', pointRatio: 1.5, contentEN: 'Could you repeat that more slowly?', contentVI: 'Bạn có thể nhắc lại chậm hơn không?', correctAnswer: 'Could you repeat that more slowly?', options: ['Could you repeat that more slowly?', 'Could you read that more loudly?', 'Could you write that down for me?', 'Could you speak to my teacher?'], orderIndex: 12 },
  { questionType: 'listening', difficulty: 'hard', pointRatio: 1.5, contentEN: 'The meeting has been moved to Friday afternoon', contentVI: 'Cuộc họp đã được chuyển sang chiều thứ sáu', correctAnswer: 'The meeting has been moved to Friday afternoon', options: ['The meeting has been moved to Friday afternoon', 'The meeting has been canceled this Friday', 'The meeting will start on Monday morning', 'The meeting is in the main office'], orderIndex: 13 },
  { questionType: 'listening', difficulty: 'hard', pointRatio: 1.5, contentEN: 'Students should submit their assignments before midnight', contentVI: 'Học sinh nên nộp bài trước nửa đêm', correctAnswer: 'Students should submit their assignments before midnight', options: ['Students should submit their assignments before midnight', 'Students can start their assignments after midnight', 'Teachers should return assignments before midnight', 'Students should print their assignments in class'], orderIndex: 14 },

  { questionType: 'listenbuild', difficulty: 'easy', pointRatio: 1, contentEN: 'I am a student', contentVI: 'Tôi là học sinh', correctAnswer: 'I am a student', options: ['I', 'am', 'a', 'student', 'teacher'], orderIndex: 15 },
  { questionType: 'listenbuild', difficulty: 'easy', pointRatio: 1, contentEN: 'We go to school', contentVI: 'Chúng tôi đi học', correctAnswer: 'We go to school', options: ['We', 'go', 'to', 'school', 'home'], orderIndex: 16 },
  { questionType: 'listenbuild', difficulty: 'easy', pointRatio: 1, contentEN: 'They play football', contentVI: 'Họ chơi bóng đá', correctAnswer: 'They play football', options: ['They', 'play', 'football', 'watch', 'music'], orderIndex: 17 },
  { questionType: 'listenbuild', difficulty: 'easy', pointRatio: 1, contentEN: 'My father cooks dinner', contentVI: 'Bố tôi nấu bữa tối', correctAnswer: 'My father cooks dinner', options: ['My', 'father', 'cooks', 'dinner', 'mother'], orderIndex: 18 },
  { questionType: 'listenbuild', difficulty: 'hard', pointRatio: 1.5, contentEN: 'She usually takes the bus to work', contentVI: 'Cô ấy thường đi xe buýt đến chỗ làm', correctAnswer: 'She usually takes the bus to work', options: ['She', 'usually', 'takes', 'the', 'bus', 'to', 'work', 'walks'], orderIndex: 19 },
  { questionType: 'listenbuild', difficulty: 'hard', pointRatio: 1.5, contentEN: 'I have never visited that museum before', contentVI: 'Tôi chưa từng đến bảo tàng đó trước đây', correctAnswer: 'I have never visited that museum before', options: ['I', 'have', 'never', 'visited', 'that', 'museum', 'before', 'often'], orderIndex: 20 },
  { questionType: 'listenbuild', difficulty: 'hard', pointRatio: 1.5, contentEN: 'The teacher asked us to explain our answer', contentVI: 'Giáo viên yêu cầu chúng tôi giải thích câu trả lời', correctAnswer: 'The teacher asked us to explain our answer', options: ['The', 'teacher', 'asked', 'us', 'to', 'explain', 'our', 'answer', 'question'], orderIndex: 21 },

  { questionType: 'truefalse', difficulty: 'easy', pointRatio: 1, contentEN: 'A cat is an animal', contentVI: 'Mèo là một con vật', correctAnswer: 'true', options: null, orderIndex: 22 },
  { questionType: 'truefalse', difficulty: 'easy', pointRatio: 1, contentEN: 'The dog is black', contentVI: 'Con chó màu trắng', correctAnswer: 'false', options: null, orderIndex: 23 },
  { questionType: 'truefalse', difficulty: 'easy', pointRatio: 1, contentEN: 'Two plus two equals four', contentVI: 'Hai cộng hai bằng bốn', correctAnswer: 'true', options: null, orderIndex: 24 },
  { questionType: 'truefalse', difficulty: 'easy', pointRatio: 1, contentEN: 'Fish can fly in the sky', contentVI: 'Cá có thể bay trên trời', correctAnswer: 'false', options: null, orderIndex: 25 },
  { questionType: 'truefalse', difficulty: 'hard', pointRatio: 1.5, contentEN: 'He has lived here for three years', contentVI: 'Anh ấy đã sống ở đây được ba năm', correctAnswer: 'true', options: null, orderIndex: 26 },
  { questionType: 'truefalse', difficulty: 'hard', pointRatio: 1.5, contentEN: 'Although it was raining, they cancelled the umbrella', contentVI: 'Mặc dù trời mưa, họ đã hủy chiếc ô', correctAnswer: 'false', options: null, orderIndex: 27 },
  { questionType: 'truefalse', difficulty: 'hard', pointRatio: 1.5, contentEN: 'The report must be finished before the manager arrives', contentVI: 'Bản báo cáo phải được hoàn thành trước khi quản lý đến', correctAnswer: 'true', options: null, orderIndex: 28 },

  { questionType: 'speakrepeat', difficulty: 'easy', pointRatio: 1, contentEN: 'I can help you', contentVI: 'Tôi có thể giúp bạn', correctAnswer: 'I can help you', options: { passScore: 70 }, orderIndex: 29 },
  { questionType: 'speakrepeat', difficulty: 'easy', pointRatio: 1, contentEN: 'Open the door please', contentVI: 'Vui lòng mở cửa', correctAnswer: 'Open the door please', options: { passScore: 70 }, orderIndex: 30 },
  { questionType: 'speakrepeat', difficulty: 'easy', pointRatio: 1, contentEN: 'I need a glass of water', contentVI: 'Tôi cần một ly nước', correctAnswer: 'I need a glass of water', options: { passScore: 70 }, orderIndex: 31 },
  { questionType: 'speakrepeat', difficulty: 'easy', pointRatio: 1, contentEN: 'Can you see the board?', contentVI: 'Bạn có thể nhìn thấy bảng không?', correctAnswer: 'Can you see the board?', options: { passScore: 70 }, orderIndex: 32 },
  { questionType: 'speakrepeat', difficulty: 'hard', pointRatio: 1.5, contentEN: 'The weather changed quickly after lunch', contentVI: 'Thời tiết thay đổi nhanh sau bữa trưa', correctAnswer: 'The weather changed quickly after lunch', options: { passScore: 75 }, orderIndex: 33 },
  { questionType: 'speakrepeat', difficulty: 'hard', pointRatio: 1.5, contentEN: 'I would appreciate it if you could send the file today', contentVI: 'Tôi sẽ rất cảm kích nếu bạn có thể gửi tệp hôm nay', correctAnswer: 'I would appreciate it if you could send the file today', options: { passScore: 75 }, orderIndex: 34 },
  { questionType: 'speakrepeat', difficulty: 'hard', pointRatio: 1.5, contentEN: 'Learning a language requires patience and regular practice', contentVI: 'Học một ngôn ngữ cần sự kiên nhẫn và luyện tập đều đặn', correctAnswer: 'Learning a language requires patience and regular practice', options: { passScore: 75 }, orderIndex: 35 }
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

  const activeKeys = new Set(QUESTIONS.map((item) => `${item.questionType}::${item.contentEN.toLowerCase()}`));
  const allRows = await pool.query(`
    SELECT Id, QuestionType, ContentEN
    FROM PlacementMiniGameQuestions
    WHERE COALESCE(IsActive, true) = true
  `);
  let deactivated = 0;
  for (const row of allRows.rows) {
    const key = `${row.questiontype}::${String(row.contenten || '').toLowerCase()}`;
    if (activeKeys.has(key)) continue;
    const result = await pool.query(`
      UPDATE PlacementMiniGameQuestions
      SET IsActive = false,
          UpdatedAt = NOW()
      WHERE Id = $1
    `, [row.id]);
    deactivated += result.rowCount;
  }

  console.log(JSON.stringify({
    insertedPlacementMiniGameQuestions: inserted,
    updatedPlacementMiniGameQuestions: updated,
    deactivatedPlacementMiniGameQuestions: deactivated
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
