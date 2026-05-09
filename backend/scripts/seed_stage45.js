// ============================================
// Seed Stage 4-5: Typing Game + Sentence Builder
// ============================================
require('dotenv').config();
const { connectDB, getPool, sql } = require('./src/config/database');

async function seed() {
  await connectDB();
  const pool = getPool();

  async function insertSet(name, desc, type, icon, order, unlock) {
    const r = await pool.request()
      .input('n', sql.NVarChar, name).input('d', sql.NVarChar, desc)
      .input('t', sql.NVarChar, type).input('i', sql.NVarChar, icon)
      .input('o', sql.Int, order).input('u', sql.NVarChar, unlock)
      .query('INSERT INTO GameSets (Name,Description,GameType,Icon,OrderIndex,UnlockCondition) OUTPUT INSERTED.Id VALUES (@n,@d,@t,@i,@o,@u)');
    return r.recordset[0].Id;
  }
  async function insertLevel(setId, num, name, diff, time, pass, locked) {
    const r = await pool.request()
      .input('s', sql.UniqueIdentifier, setId).input('n', sql.Int, num)
      .input('nm', sql.NVarChar, name).input('d', sql.NVarChar, diff)
      .input('t', sql.Int, time).input('p', sql.Int, pass).input('l', sql.Int, locked ? 1 : 0)
      .query('INSERT INTO GameLevels (SetId,LevelNumber,Name,Difficulty,TimeLimit,PassScore,IsLocked) OUTPUT INSERTED.Id VALUES (@s,@n,@nm,@d,@t,@p,@l)');
    return r.recordset[0].Id;
  }
  async function insertQ(levelId, type, en, vi, audio, image, answer, options, order) {
    await pool.request()
      .input('lid', sql.UniqueIdentifier, levelId).input('t', sql.NVarChar, type)
      .input('en', sql.NVarChar, en).input('vi', sql.NVarChar, vi)
      .input('au', sql.NVarChar, audio).input('im', sql.NVarChar, image)
      .input('a', sql.NVarChar, answer)
      .input('o', sql.NVarChar, options ? JSON.stringify(options) : null)
      .input('oi', sql.Int, order)
      .query('INSERT INTO MiniGameQuestions (LevelId,QuestionType,ContentEN,ContentVI,AudioUrl,ImageUrl,CorrectAnswer,Options,OrderIndex) VALUES (@lid,@t,@en,@vi,@au,@im,@a,@o,@oi)');
  }

  console.log('⌨️  Seeding Typing Game + Sentence Builder...\n');

  // ============================
  // STAGE 4: TYPING GAME
  // ============================
  const typeSet = await insertSet('Typing Challenge', 'Nghe hoặc đọc, sau đó gõ lại câu đúng', 'typing', '⌨️', 2, 'none');

  // Level 1: Simple words
  const tL1 = await insertLevel(typeSet, 1, 'Gõ từ đơn', 'easy', 90, 60, false);
  await insertQ(tL1, 'type_answer', 'apple', 'Quả táo', 'https://api.dictionaryapi.dev/media/pronunciations/en/apple-us.mp3', null, 'apple', null, 0);
  await insertQ(tL1, 'type_answer', 'banana', 'Quả chuối', null, null, 'banana', null, 1);
  await insertQ(tL1, 'type_answer', 'orange', 'Quả cam', null, null, 'orange', null, 2);
  await insertQ(tL1, 'type_answer', 'school', 'Trường học', 'https://api.dictionaryapi.dev/media/pronunciations/en/school-us.mp3', null, 'school', null, 3);
  await insertQ(tL1, 'type_answer', 'teacher', 'Giáo viên', null, null, 'teacher', null, 4);
  await insertQ(tL1, 'type_answer', 'student', 'Học sinh', null, null, 'student', null, 5);
  console.log('  ✅ Typing Level 1: Gõ từ đơn (6 từ)');

  // Level 2: Short phrases
  const tL2 = await insertLevel(typeSet, 2, 'Gõ cụm từ', 'medium', 120, 60, true);
  await insertQ(tL2, 'type_answer', 'good morning', 'Chào buổi sáng', null, null, 'good morning', null, 0);
  await insertQ(tL2, 'type_answer', 'thank you very much', 'Cảm ơn rất nhiều', null, null, 'thank you very much', null, 1);
  await insertQ(tL2, 'type_answer', 'nice to meet you', 'Rất vui được gặp bạn', null, null, 'nice to meet you', null, 2);
  await insertQ(tL2, 'type_answer', 'how are you', 'Bạn khỏe không', null, null, 'how are you', null, 3);
  await insertQ(tL2, 'type_answer', 'see you later', 'Hẹn gặp lại', null, null, 'see you later', null, 4);
  console.log('  ✅ Typing Level 2: Gõ cụm từ (5 câu)');

  // Level 3: Full sentences
  const tL3 = await insertLevel(typeSet, 3, 'Gõ câu hoàn chỉnh', 'hard', 180, 60, true);
  await insertQ(tL3, 'type_answer', 'I go to school every day', 'Tôi đi học mỗi ngày', null, null, 'i go to school every day', null, 0);
  await insertQ(tL3, 'type_answer', 'She likes to read books', 'Cô ấy thích đọc sách', null, null, 'she likes to read books', null, 1);
  await insertQ(tL3, 'type_answer', 'We are learning English', 'Chúng tôi đang học tiếng Anh', null, null, 'we are learning english', null, 2);
  await insertQ(tL3, 'type_answer', 'The weather is beautiful today', 'Thời tiết hôm nay đẹp', null, null, 'the weather is beautiful today', null, 3);
  await insertQ(tL3, 'type_answer', 'They play football on weekends', 'Họ chơi bóng đá vào cuối tuần', null, null, 'they play football on weekends', null, 4);
  console.log('  ✅ Typing Level 3: Gõ câu hoàn chỉnh (5 câu)');

  // ============================
  // STAGE 5: SENTENCE BUILDER
  // ============================
  const sentSet = await insertSet('Sentence Builder', 'Sắp xếp các từ thành câu đúng', 'sentence', '📝', 3, 'none');

  // Level 1: Simple sentences (3-5 words)
  const sL1 = await insertLevel(sentSet, 1, 'Câu đơn giản', 'easy', 90, 60, false);
  await insertQ(sL1, 'order_sentence', 'I am a student', 'Tôi là một học sinh', null, null, 'I am a student', ['am', 'I', 'student', 'a'], 0);
  await insertQ(sL1, 'order_sentence', 'She is my friend', 'Cô ấy là bạn tôi', null, null, 'She is my friend', ['friend', 'She', 'my', 'is'], 1);
  await insertQ(sL1, 'order_sentence', 'We like music', 'Chúng tôi thích nhạc', null, null, 'We like music', ['music', 'We', 'like'], 2);
  await insertQ(sL1, 'order_sentence', 'He plays guitar', 'Anh ấy chơi guitar', null, null, 'He plays guitar', ['guitar', 'plays', 'He'], 3);
  await insertQ(sL1, 'order_sentence', 'They are happy', 'Họ vui vẻ', null, null, 'They are happy', ['happy', 'They', 'are'], 4);
  console.log('  ✅ Sentence Level 1: Câu đơn giản (5 câu)');

  // Level 2: Medium sentences (5-7 words)
  const sL2 = await insertLevel(sentSet, 2, 'Câu trung bình', 'medium', 120, 60, true);
  await insertQ(sL2, 'order_sentence', 'I go to school every day', 'Tôi đi học mỗi ngày', null, null, 'I go to school every day', ['every', 'go', 'I', 'school', 'day', 'to'], 0);
  await insertQ(sL2, 'order_sentence', 'She reads books in the library', 'Cô ấy đọc sách ở thư viện', null, null, 'She reads books in the library', ['library', 'in', 'She', 'books', 'reads', 'the'], 1);
  await insertQ(sL2, 'order_sentence', 'We eat lunch at twelve o clock', 'Chúng tôi ăn trưa lúc 12 giờ', null, null, 'We eat lunch at twelve o clock', ['eat', 'twelve', 'at', 'We', 'lunch', 'o', 'clock'], 2);
  await insertQ(sL2, 'order_sentence', 'He likes playing football with friends', 'Anh ấy thích chơi bóng đá với bạn bè', null, null, 'He likes playing football with friends', ['football', 'He', 'playing', 'likes', 'friends', 'with'], 3);
  await insertQ(sL2, 'order_sentence', 'The cat is sleeping on the sofa', 'Con mèo đang ngủ trên sofa', null, null, 'The cat is sleeping on the sofa', ['sleeping', 'The', 'on', 'cat', 'the', 'is', 'sofa'], 4);
  console.log('  ✅ Sentence Level 2: Câu trung bình (5 câu)');

  // Level 3: Complex sentences
  const sL3 = await insertLevel(sentSet, 3, 'Câu phức tạp', 'hard', 150, 60, true);
  await insertQ(sL3, 'order_sentence', 'I have been studying English for two years', 'Tôi đã học tiếng Anh được 2 năm', null, null, 'I have been studying English for two years', ['studying', 'for', 'I', 'two', 'have', 'English', 'been', 'years'], 0);
  await insertQ(sL3, 'order_sentence', 'She will travel to Japan next summer', 'Cô ấy sẽ du lịch Nhật Bản mùa hè tới', null, null, 'She will travel to Japan next summer', ['Japan', 'She', 'travel', 'summer', 'next', 'will', 'to'], 1);
  await insertQ(sL3, 'order_sentence', 'They are going to the cinema tonight', 'Họ sẽ đi xem phim tối nay', null, null, 'They are going to the cinema tonight', ['cinema', 'going', 'to', 'the', 'They', 'tonight', 'are'], 2);
  await insertQ(sL3, 'order_sentence', 'We should learn something new every day', 'Chúng ta nên học điều gì đó mới mỗi ngày', null, null, 'We should learn something new every day', ['new', 'We', 'every', 'learn', 'day', 'should', 'something'], 3);
  await insertQ(sL3, 'order_sentence', 'If it rains tomorrow I will stay home', 'Nếu ngày mai mưa tôi sẽ ở nhà', null, null, 'If it rains tomorrow I will stay home', ['rains', 'If', 'home', 'will', 'it', 'stay', 'I', 'tomorrow'], 4);
  console.log('  ✅ Sentence Level 3: Câu phức tạp (5 câu)');

  console.log('\n🎉 Stage 4 + 5 seeded!');
  process.exit(0);
}

seed().catch(err => { console.error('❌', err.message); process.exit(1); });
