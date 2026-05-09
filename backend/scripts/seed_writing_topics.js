const { connectDB, getPool, sql } = require('./src/config/database');

async function seed() {
  try {
    await connectDB();
    const pool = getPool();
    
    console.log('Clearing old writing topics and exercises...');
    await pool.request().query(`DELETE FROM WritingVocab`);
    await pool.request().query(`DELETE FROM WritingExercises`);
    await pool.request().query(`DELETE FROM WritingProgress`);
    await pool.request().query(`DELETE FROM WritingLessons`);

    const topics = [
      { Title: 'Giới thiệu bản thân', Description: 'Viết các câu cơ bản giới thiệu về bản thân', OrderIndex: 1 },
      { Title: 'Sở thích cá nhân', Description: 'Mô tả những điều bạn thích làm', OrderIndex: 2 },
      { Title: 'Email công việc', Description: 'Các mẫu câu thông dụng trong email', OrderIndex: 3 }
    ];

    const exercisesData = [
      // Topic 1
      [
        { vi: 'Xin chào, tên tôi là Nam và tôi 25 tuổi.', en: 'Hello, my name is Nam and I am 25 years old.', vocab: [] },
        { vi: 'Tôi đến từ Việt Nam nhưng hiện tại tôi sống ở Nhật Bản.', en: 'I am from Vietnam but currently I live in Japan.', vocab: [{ w: 'currently', m: 'hiện tại' }] },
        { vi: 'Tôi là một kỹ sư phần mềm làm việc cho một công ty công nghệ.', en: 'I am a software engineer working for a technology company.', vocab: [{ w: 'engineer', m: 'kỹ sư' }] },
      ],
      // Topic 2
      [
        { vi: 'Vào thời gian rảnh, tôi thích đọc sách và nghe nhạc.', en: 'In my free time, I like reading books and listening to music.', vocab: [] },
        { vi: 'Sở thích lớn nhất của tôi là đi du lịch và khám phá những vùng đất mới.', en: 'My biggest hobby is traveling and exploring new lands.', vocab: [{ w: 'hobby', m: 'sở thích' }, { w: 'exploring', m: 'khám phá' }] },
        { vi: 'Tôi thường chơi bóng đá với bạn bè vào mỗi cuối tuần.', en: 'I usually play soccer with my friends every weekend.', vocab: [{ w: 'usually', m: 'thường xuyên' }] }
      ],
      // Topic 3
      [
        { vi: 'Kính gửi ông Smith, tôi viết email này để thảo luận về dự án mới.', en: 'Dear Mr. Smith, I am writing this email to discuss the new project.', vocab: [{ w: 'discuss', m: 'thảo luận' }] },
        { vi: 'Vui lòng tìm tài liệu đính kèm để biết thêm chi tiết.', en: 'Please find the attached document for more details.', vocab: [{ w: 'attached', m: 'đính kèm' }, { w: 'details', m: 'chi tiết' }] },
        { vi: 'Tôi mong sớm nhận được phản hồi từ bạn. Trân trọng.', en: 'I look forward to hearing from you soon. Sincerely.', vocab: [{ w: 'look forward to', m: 'mong đợi' }, { w: 'Sincerely', m: 'Trân trọng' }] }
      ]
    ];

    console.log('Seeding topics and exercises...');
    for (let i = 0; i < topics.length; i++) {
      const t = topics[i];
      const res = await pool.request()
        .input('title', sql.NVarChar, t.Title)
        .input('desc', sql.NVarChar, t.Description)
        .input('order', sql.Int, t.OrderIndex)
        .query(`
          INSERT INTO WritingLessons (Title, Description, OrderIndex)
          OUTPUT INSERTED.Id
          VALUES (@title, @desc, @order)
        `);
      
      const topicId = res.recordset[0].Id;

      for (let j = 0; j < exercisesData[i].length; j++) {
        const q = exercisesData[i][j];
        const exerRes = await pool.request()
          .input('lessonId', sql.UniqueIdentifier, topicId)
          .input('vi', sql.NVarChar, q.vi)
          .input('en', sql.NVarChar, q.en)
          .input('order', sql.Int, j + 1)
          .query(`
            INSERT INTO WritingExercises (LessonId, ContentVI, CorrectAnswerEN, OrderIndex)
            OUTPUT INSERTED.Id
            VALUES (@lessonId, @vi, @en, @order)
          `);
        
        const exerciseId = exerRes.recordset[0].Id;

        // Insert Vocab
        for (let v of q.vocab) {
          await pool.request()
            .input('exId', sql.UniqueIdentifier, exerciseId)
            .input('word', sql.NVarChar, v.w)
            .input('meaning', sql.NVarChar, v.m)
            .query(`
              INSERT INTO WritingVocab (ExerciseId, Word, Meaning)
              VALUES (@exId, @word, @meaning)
            `);
        }
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
