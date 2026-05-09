// ============================================
// Seed Mini Games — Matching + Listening (3 levels each)
// ============================================
require('dotenv').config();
const { connectDB, getPool, sql } = require('./src/config/database');

async function seed() {
  await connectDB();
  const pool = getPool();

  // Helper
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
      .input('t', sql.Int, time).input('p', sql.Int, pass).input('l', sql.Bit, locked)
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

  console.log('🎮 Seeding Mini Games...\n');

  // ============================
  // SET 1: MATCHING GAME — Basic
  // ============================
  const matchSet1 = await insertSet('Word Match — Cơ bản', 'Nối từ tiếng Anh với nghĩa tiếng Việt', 'matching', '🔗', 0, 'none');

  // Level 1: Animals (easy, 6 pairs)
  const mL1 = await insertLevel(matchSet1, 1, 'Động vật', 'easy', 60, 70, false);
  await insertQ(mL1, 'match_pair', 'Dog', 'Con chó', null, null, 'Con chó', null, 0);
  await insertQ(mL1, 'match_pair', 'Cat', 'Con mèo', null, null, 'Con mèo', null, 1);
  await insertQ(mL1, 'match_pair', 'Bird', 'Con chim', null, null, 'Con chim', null, 2);
  await insertQ(mL1, 'match_pair', 'Fish', 'Con cá', null, null, 'Con cá', null, 3);
  await insertQ(mL1, 'match_pair', 'Horse', 'Con ngựa', null, null, 'Con ngựa', null, 4);
  await insertQ(mL1, 'match_pair', 'Rabbit', 'Con thỏ', null, null, 'Con thỏ', null, 5);

  // Level 2: Food (easy, 6 pairs)
  const mL2 = await insertLevel(matchSet1, 2, 'Thức ăn', 'easy', 60, 70, true);
  await insertQ(mL2, 'match_pair', 'Rice', 'Cơm', null, null, 'Cơm', null, 0);
  await insertQ(mL2, 'match_pair', 'Bread', 'Bánh mì', null, null, 'Bánh mì', null, 1);
  await insertQ(mL2, 'match_pair', 'Milk', 'Sữa', null, null, 'Sữa', null, 2);
  await insertQ(mL2, 'match_pair', 'Egg', 'Trứng', null, null, 'Trứng', null, 3);
  await insertQ(mL2, 'match_pair', 'Apple', 'Táo', null, null, 'Táo', null, 4);
  await insertQ(mL2, 'match_pair', 'Water', 'Nước', null, null, 'Nước', null, 5);

  // Level 3: Colors & adjectives (medium, 8 pairs)
  const mL3 = await insertLevel(matchSet1, 3, 'Màu sắc & Tính từ', 'medium', 90, 70, true);
  await insertQ(mL3, 'match_pair', 'Beautiful', 'Xinh đẹp', null, null, 'Xinh đẹp', null, 0);
  await insertQ(mL3, 'match_pair', 'Happy', 'Vui vẻ', null, null, 'Vui vẻ', null, 1);
  await insertQ(mL3, 'match_pair', 'Sad', 'Buồn', null, null, 'Buồn', null, 2);
  await insertQ(mL3, 'match_pair', 'Fast', 'Nhanh', null, null, 'Nhanh', null, 3);
  await insertQ(mL3, 'match_pair', 'Slow', 'Chậm', null, null, 'Chậm', null, 4);
  await insertQ(mL3, 'match_pair', 'Big', 'Lớn', null, null, 'Lớn', null, 5);
  await insertQ(mL3, 'match_pair', 'Small', 'Nhỏ', null, null, 'Nhỏ', null, 6);
  await insertQ(mL3, 'match_pair', 'Strong', 'Mạnh mẽ', null, null, 'Mạnh mẽ', null, 7);

  console.log('  ✅ Matching Game — 3 levels (6/6/8 pairs)');

  // ==============================
  // SET 2: LISTENING GAME — Basic
  // ==============================
  const listenSet1 = await insertSet('Listening Quiz — Cơ bản', 'Nghe và chọn đáp án đúng', 'listening', '🎧', 1, 'none');

  // Use Free Dictionary API audio URLs (these are real public audio files)
  const audioBase = 'https://api.dictionaryapi.dev/media/pronunciations/en';

  // Level 1: Simple words
  const lL1 = await insertLevel(listenSet1, 1, 'Từ đơn giản', 'easy', 90, 70, false);
  await insertQ(lL1, 'listen_choose', 'hello', 'Xin chào', `${audioBase}/hello-us.mp3`, null, 'hello', ['hello', 'help', 'hold', 'hill'], 0);
  await insertQ(lL1, 'listen_choose', 'thank', 'Cảm ơn', `${audioBase}/thank-us.mp3`, null, 'thank', ['think', 'thank', 'tank', 'thick'], 1);
  await insertQ(lL1, 'listen_choose', 'water', 'Nước', `${audioBase}/water-au.mp3`, null, 'water', ['winter', 'waiter', 'water', 'weather'], 2);
  await insertQ(lL1, 'listen_choose', 'apple', 'Quả táo', `${audioBase}/apple-us.mp3`, null, 'apple', ['apple', 'apply', 'able', 'april'], 3);
  await insertQ(lL1, 'listen_choose', 'school', 'Trường học', `${audioBase}/school-us.mp3`, null, 'school', ['stool', 'school', 'skull', 'scroll'], 4);

  // Level 2: Medium words
  const lL2 = await insertLevel(listenSet1, 2, 'Từ vựng giao tiếp', 'easy', 90, 70, true);
  await insertQ(lL2, 'listen_choose', 'beautiful', 'Xinh đẹp', `${audioBase}/beautiful-us.mp3`, null, 'beautiful', ['beautiful', 'butterfly', 'botanical', 'bountiful'], 0);
  await insertQ(lL2, 'listen_choose', 'different', 'Khác nhau', `${audioBase}/different-us.mp3`, null, 'different', ['difficult', 'different', 'deficient', 'diffident'], 1);
  await insertQ(lL2, 'listen_choose', 'important', 'Quan trọng', `${audioBase}/important-us.mp3`, null, 'important', ['impatient', 'important', 'imported', 'imposing'], 2);
  await insertQ(lL2, 'listen_choose', 'together', 'Cùng nhau', `${audioBase}/together-us.mp3`, null, 'together', ['today', 'together', 'tomorrow', 'toward'], 3);
  await insertQ(lL2, 'listen_choose', 'remember', 'Nhớ', `${audioBase}/remember-us.mp3`, null, 'remember', ['remember', 'remind', 'remove', 'remain'], 4);

  // Level 3: Harder words
  const lL3 = await insertLevel(listenSet1, 3, 'Từ vựng nâng cao', 'medium', 120, 70, true);
  await insertQ(lL3, 'listen_choose', 'environment', 'Môi trường', `${audioBase}/environment-us.mp3`, null, 'environment', ['entertainment', 'environment', 'encouragement', 'engagement'], 0);
  await insertQ(lL3, 'listen_choose', 'technology', 'Công nghệ', `${audioBase}/technology-us.mp3`, null, 'technology', ['terminology', 'technique', 'technology', 'telescope'], 1);
  await insertQ(lL3, 'listen_choose', 'communication', 'Giao tiếp', `${audioBase}/communication-us.mp3`, null, 'communication', ['communication', 'combination', 'competition', 'compensation'], 2);
  await insertQ(lL3, 'listen_choose', 'experience', 'Kinh nghiệm', `${audioBase}/experience-us.mp3`, null, 'experience', ['experiment', 'expensive', 'experience', 'expression'], 3);
  await insertQ(lL3, 'listen_choose', 'opportunity', 'Cơ hội', `${audioBase}/opportunity-us.mp3`, null, 'opportunity', ['operation', 'opposition', 'opportunity', 'optimistic'], 4);

  console.log('  ✅ Listening Game — 3 levels (5/5/5 questions)');

  console.log('\n🎉 Mini Game seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error('❌', err.message); process.exit(1); });
