// ============================================
// Seed Games — Insert sample games, questions and options
// ============================================
require('dotenv').config();
const { connectDB, getPool } = require('./src/config/database');
const { sql } = require('./src/config/database');

async function seed() {
  await connectDB();
  const pool = getPool();

  console.log('🎮 Seeding Games...');

  // ===== GAME 1: Multiple Choice — Basic Vocabulary =====
  const g1 = await pool.request().query(`
    INSERT INTO Games (Name, Type, Difficulty) OUTPUT INSERTED.Id
    VALUES (N'Vocabulary Challenge', 'multiple_choice', 'easy')
  `);
  const game1Id = g1.recordset[0].Id;

  const g1Questions = [
    { q: 'What does "apple" mean?', answer: 'Quả táo', options: ['Quả táo', 'Quả cam', 'Quả chuối', 'Quả nho'] },
    { q: 'What does "book" mean?', answer: 'Quyển sách', options: ['Cái bàn', 'Quyển sách', 'Cái ghế', 'Cái bút'] },
    { q: 'What does "water" mean?', answer: 'Nước', options: ['Lửa', 'Đất', 'Nước', 'Gió'] },
    { q: 'What does "school" mean?', answer: 'Trường học', options: ['Bệnh viện', 'Trường học', 'Nhà thờ', 'Công viên'] },
    { q: 'What does "happy" mean?', answer: 'Vui vẻ', options: ['Buồn', 'Tức giận', 'Vui vẻ', 'Sợ hãi'] },
  ];

  for (const item of g1Questions) {
    const qRes = await pool.request()
      .input('gameId', sql.UniqueIdentifier, game1Id)
      .input('question', sql.NVarChar, item.q)
      .input('correctAnswer', sql.NVarChar, item.answer)
      .query(`INSERT INTO GameQuestions (GameId, Question, QuestionType, CorrectAnswer)
              OUTPUT INSERTED.Id VALUES (@gameId, @question, 'text', @correctAnswer)`);
    const qId = qRes.recordset[0].Id;
    for (const opt of item.options) {
      await pool.request()
        .input('questionId', sql.UniqueIdentifier, qId)
        .input('optionText', sql.NVarChar, opt)
        .query('INSERT INTO GameOptions (QuestionId, OptionText) VALUES (@questionId, @optionText)');
    }
  }
  console.log('  ✅ Game 1: Vocabulary Challenge (multiple_choice)');

  // ===== GAME 2: Listening — Audio Comprehension =====
  const g2 = await pool.request().query(`
    INSERT INTO Games (Name, Type, Difficulty) OUTPUT INSERTED.Id
    VALUES (N'Listening Comprehension', 'listening', 'medium')
  `);
  const game2Id = g2.recordset[0].Id;

  const g2Questions = [
    { q: 'Listen and choose the correct word: "I like to ___ in the morning."', answer: 'run', options: ['run', 'sleep', 'eat', 'drive'] },
    { q: 'Choose the correct phrase: "She ___ to music every day."', answer: 'listens', options: ['listens', 'reads', 'writes', 'speaks'] },
    { q: 'Fill in: "The cat is ___ the table."', answer: 'under', options: ['over', 'under', 'beside', 'behind'] },
    { q: 'Choose: "He ___ breakfast at 7 AM."', answer: 'has', options: ['has', 'does', 'makes', 'takes'] },
    { q: 'Select: "They ___ going to the park."', answer: 'are', options: ['is', 'am', 'are', 'was'] },
  ];

  for (const item of g2Questions) {
    const qRes = await pool.request()
      .input('gameId', sql.UniqueIdentifier, game2Id)
      .input('question', sql.NVarChar, item.q)
      .input('correctAnswer', sql.NVarChar, item.answer)
      .query(`INSERT INTO GameQuestions (GameId, Question, QuestionType, CorrectAnswer)
              OUTPUT INSERTED.Id VALUES (@gameId, @question, 'text', @correctAnswer)`);
    const qId = qRes.recordset[0].Id;
    for (const opt of item.options) {
      await pool.request()
        .input('questionId', sql.UniqueIdentifier, qId)
        .input('optionText', sql.NVarChar, opt)
        .query('INSERT INTO GameOptions (QuestionId, OptionText) VALUES (@questionId, @optionText)');
    }
  }
  console.log('  ✅ Game 2: Listening Comprehension (listening)');

  // ===== GAME 3: Typing — Spell It Out =====
  const g3 = await pool.request().query(`
    INSERT INTO Games (Name, Type, Difficulty) OUTPUT INSERTED.Id
    VALUES (N'Spell It Out', 'typing', 'medium')
  `);
  const game3Id = g3.recordset[0].Id;

  const g3Questions = [
    { q: 'Type the English word for "Con mèo"', answer: 'cat' },
    { q: 'Type the English word for "Con chó"', answer: 'dog' },
    { q: 'Type the English word for "Ngôi nhà"', answer: 'house' },
    { q: 'Type the English word for "Gia đình"', answer: 'family' },
    { q: 'Type the English word for "Bạn bè"', answer: 'friend' },
    { q: 'Type the English word for "Giáo viên"', answer: 'teacher' },
    { q: 'Type the English word for "Học sinh"', answer: 'student' },
  ];

  for (const item of g3Questions) {
    await pool.request()
      .input('gameId', sql.UniqueIdentifier, game3Id)
      .input('question', sql.NVarChar, item.q)
      .input('correctAnswer', sql.NVarChar, item.answer)
      .query(`INSERT INTO GameQuestions (GameId, Question, QuestionType, CorrectAnswer)
              VALUES (@gameId, @question, 'fill_blank', @correctAnswer)`);
  }
  console.log('  ✅ Game 3: Spell It Out (typing)');

  // ===== GAME 4: Matching — Word Pairs =====
  const g4 = await pool.request().query(`
    INSERT INTO Games (Name, Type, Difficulty) OUTPUT INSERTED.Id
    VALUES (N'Word Match', 'matching', 'easy')
  `);
  const game4Id = g4.recordset[0].Id;

  const g4Questions = [
    { q: 'Match the word "Hello" with its Vietnamese meaning:', answer: 'Xin chào', options: ['Tạm biệt', 'Xin chào', 'Cảm ơn', 'Xin lỗi'] },
    { q: 'Match the word "Goodbye" with its Vietnamese meaning:', answer: 'Tạm biệt', options: ['Xin chào', 'Cảm ơn', 'Tạm biệt', 'Xin lỗi'] },
    { q: 'Match the word "Thank you" with its Vietnamese meaning:', answer: 'Cảm ơn', options: ['Xin chào', 'Tạm biệt', 'Xin lỗi', 'Cảm ơn'] },
    { q: 'Match the word "Sorry" with its Vietnamese meaning:', answer: 'Xin lỗi', options: ['Cảm ơn', 'Xin lỗi', 'Xin chào', 'Tạm biệt'] },
    { q: 'Match the word "Please" with its Vietnamese meaning:', answer: 'Làm ơn', options: ['Cảm ơn', 'Xin chào', 'Làm ơn', 'Tạm biệt'] },
  ];

  for (const item of g4Questions) {
    const qRes = await pool.request()
      .input('gameId', sql.UniqueIdentifier, game4Id)
      .input('question', sql.NVarChar, item.q)
      .input('correctAnswer', sql.NVarChar, item.answer)
      .query(`INSERT INTO GameQuestions (GameId, Question, QuestionType, CorrectAnswer)
              OUTPUT INSERTED.Id VALUES (@gameId, @question, 'matching', @correctAnswer)`);
    const qId = qRes.recordset[0].Id;
    for (const opt of item.options) {
      await pool.request()
        .input('questionId', sql.UniqueIdentifier, qId)
        .input('optionText', sql.NVarChar, opt)
        .query('INSERT INTO GameOptions (QuestionId, OptionText) VALUES (@questionId, @optionText)');
    }
  }
  console.log('  ✅ Game 4: Word Match (matching)');

  // ===== SEED ACHIEVEMENTS =====
  console.log('\n🏆 Seeding Achievements...');
  const achievements = [
    { name: 'First Game', desc: 'Play your first game', condition: 'Play 1 game' },
    { name: 'Game Addict', desc: 'Play 10 games', condition: 'Play 10 games' },
    { name: 'Perfect Score', desc: 'Get 100% on any game', condition: 'Get 1 perfect 100% score' },
    { name: 'Speed Demon', desc: 'Complete a game in under 30 seconds', condition: 'Complete game under 30s' },
    { name: 'Word Master', desc: 'Play 5 games', condition: 'Play 5 games' },
  ];

  for (const a of achievements) {
    try {
      await pool.request()
        .input('name', sql.NVarChar, a.name)
        .input('desc', sql.NVarChar, a.desc)
        .input('condition', sql.NVarChar, a.condition)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Achievements WHERE Name = @name)
          INSERT INTO Achievements (Name, Description, [Condition]) VALUES (@name, @desc, @condition)
        `);
    } catch (e) {
      // table might not exist yet, skip
    }
  }
  console.log('  ✅ Achievements seeded');

  console.log('\n🎉 All game data seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
