const { connectDB, getPool, sql } = require('./src/config/database');

async function seed() {
  try {
    await connectDB();
    const pool = getPool();
    
    // Clear old data
    console.log('Clearing old speaking topics and questions...');
    await pool.request().query(`DELETE FROM SpeakingQuestions`);
    await pool.request().query(`DELETE FROM SpeakingProgress`);
    await pool.request().query(`DELETE FROM SpeakingLessons`);

    const topics = [
      { Title: 'Chào hỏi cơ bản', Description: 'Các mẫu câu chào hỏi hàng ngày', OrderIndex: 1 },
      { Title: 'Tại nhà hàng', Description: 'Giao tiếp khi đi ăn uống', OrderIndex: 2 },
      { Title: 'Sở thích cá nhân', Description: 'Nói về những gì bạn thích làm', OrderIndex: 3 }
    ];

    const questionsData = [
      // Topic 1: Chào hỏi
      [
        { q: 'How are you doing today?', t: 'Hôm nay bạn thế nào?', o1: 'I am doing well, thank you.', o2: 'Not too bad, how about you?', o3: 'I feel great today!' },
        { q: 'What is your name?', t: 'Tên của bạn là gì?', o1: 'My name is John.', o2: 'I am Sarah.', o3: 'You can call me Mike.' },
        { q: 'Where are you from?', t: 'Bạn đến từ đâu?', o1: 'I am from Vietnam.', o2: 'I come from the United States.', o3: 'I was born in London.' },
        { q: 'It was nice meeting you.', t: 'Rất vui được gặp bạn.', o1: 'Nice to meet you too.', o2: 'Likewise.', o3: 'It was a pleasure meeting you.' },
        { q: 'See you later!', t: 'Hẹn gặp lại nhé!', o1: 'Catch you later.', o2: 'See you soon.', o3: 'Take care!' }
      ],
      // Topic 2: Tại nhà hàng
      [
        { q: 'Are you ready to order?', t: 'Bạn đã sẵn sàng gọi món chưa?', o1: 'Yes, I will have the steak.', o2: 'Not yet, I need a few more minutes.', o3: 'Can you recommend something?' },
        { q: 'What would you like to drink?', t: 'Bạn muốn uống gì?', o1: 'Just water, please.', o2: 'I would like a glass of wine.', o3: 'Can I get a cup of coffee?' },
        { q: 'How is your food?', t: 'Thức ăn của bạn thế nào?', o1: 'It is delicious.', o2: 'It tastes amazing.', o3: 'It is a bit too salty.' },
        { q: 'Would you like some dessert?', t: 'Bạn có muốn dùng đồ tráng miệng không?', o1: 'No thank you, I am full.', o2: 'Yes, I will have the cheesecake.', o3: 'What desserts do you have?' },
        { q: 'Can I get the check, please?', t: 'Cho tôi xin hóa đơn nhé.', o1: 'Sure, I will bring it right away.', o2: 'Here is your bill.', o3: 'Are you paying together or separately?' }
      ],
      // Topic 3: Sở thích
      [
        { q: 'What do you like to do in your free time?', t: 'Bạn thích làm gì trong thời gian rảnh?', o1: 'I enjoy reading books.', o2: 'I love playing soccer.', o3: 'I usually watch movies.' },
        { q: 'Do you play any instruments?', t: 'Bạn có chơi nhạc cụ nào không?', o1: 'I play the guitar.', o2: 'I am learning to play the piano.', o3: 'No, I don\'t play any.' },
        { q: 'What kind of music do you like?', t: 'Bạn thích thể loại nhạc nào?', o1: 'I listen to pop music.', o2: 'I am a big fan of rock.', o3: 'I prefer classical music.' },
        { q: 'Have you seen any good movies lately?', t: 'Dạo này bạn có xem phim nào hay không?', o1: 'Yes, I watched a great action movie.', o2: 'Not really, I have been busy.', o3: 'I just saw a funny comedy.' },
        { q: 'Do you like traveling?', t: 'Bạn có thích đi du lịch không?', o1: 'Yes, I love visiting new places.', o2: 'I travel whenever I have time.', o3: 'Not much, I prefer staying home.' }
      ]
    ];

    console.log('Seeding topics and questions...');
    for (let i = 0; i < topics.length; i++) {
      const t = topics[i];
      const res = await pool.request()
        .input('title', sql.NVarChar, t.Title)
        .input('desc', sql.NVarChar, t.Description)
        .input('order', sql.Int, t.OrderIndex)
        .query(`
          INSERT INTO SpeakingLessons (Title, Description, OrderIndex)
          OUTPUT INSERTED.Id
          VALUES (@title, @desc, @order)
        `);
      
      const topicId = res.recordset[0].Id;

      for (let j = 0; j < questionsData[i].length; j++) {
        const q = questionsData[i][j];
        await pool.request()
          .input('lessonId', sql.UniqueIdentifier, topicId)
          .input('question', sql.NVarChar, q.q)
          .input('trans', sql.NVarChar, q.t)
          .input('o1', sql.NVarChar, q.o1)
          .input('o2', sql.NVarChar, q.o2)
          .input('o3', sql.NVarChar, q.o3)
          .input('order', sql.Int, j + 1)
          .query(`
            INSERT INTO SpeakingQuestions (LessonId, Question, Translation, Option1, Option2, Option3, OrderIndex)
            VALUES (@lessonId, @question, @trans, @o1, @o2, @o3, @order)
          `);
      }
    }

    console.log('Seed completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}
seed();
