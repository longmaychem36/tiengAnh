require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, sql } = require('../src/config/database');

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
      {
        Title: 'Giới thiệu bản thân',
        Description: 'Luyện các câu quan trọng trong một đoạn giới thiệu bản thân hoàn chỉnh',
        OrderIndex: 1,
        PassageEN: 'Hello, my name is Nam and I am 25 years old. I am from Vietnam, but I currently live in Japan. I work as a software engineer for a technology company. In my job, I build useful web applications and solve technical problems every day. In the future, I want to improve my English so I can work with international teams.',
        PassageVI: 'Xin chào, tên tôi là Nam và tôi 25 tuổi. Tôi đến từ Việt Nam, nhưng hiện tại tôi sống ở Nhật Bản. Tôi làm kỹ sư phần mềm cho một công ty công nghệ. Trong công việc, tôi xây dựng các ứng dụng web hữu ích và giải quyết vấn đề kỹ thuật mỗi ngày. Trong tương lai, tôi muốn cải thiện tiếng Anh để có thể làm việc với các nhóm quốc tế.'
      },
      {
        Title: 'Sở thích cá nhân',
        Description: 'Viết một đoạn văn ngắn về sở thích và thói quen cá nhân',
        OrderIndex: 2,
        PassageEN: 'In my free time, I like reading books and listening to music. Reading helps me learn new ideas and relax after a busy day. My biggest hobby is traveling and exploring new places. When I travel, I enjoy trying local food and talking to different people. I also usually play soccer with my friends every weekend.',
        PassageVI: 'Vào thời gian rảnh, tôi thích đọc sách và nghe nhạc. Đọc sách giúp tôi học những ý tưởng mới và thư giãn sau một ngày bận rộn. Sở thích lớn nhất của tôi là đi du lịch và khám phá những nơi mới. Khi đi du lịch, tôi thích thử món ăn địa phương và nói chuyện với nhiều người khác nhau. Tôi cũng thường chơi bóng đá với bạn bè vào mỗi cuối tuần.'
      },
      {
        Title: 'Email công việc',
        Description: 'Luyện các câu chính trong một email công việc hoàn chỉnh',
        OrderIndex: 3,
        PassageEN: 'Dear Mr. Smith, I am writing this email to discuss the new project. Our team has reviewed the plan and prepared several suggestions. Please find the attached document for more details. Could we schedule a short meeting this week to confirm the next steps? I look forward to hearing from you soon. Sincerely, Nam.',
        PassageVI: 'Kính gửi ông Smith, tôi viết email này để thảo luận về dự án mới. Nhóm của chúng tôi đã xem lại kế hoạch và chuẩn bị một số đề xuất. Vui lòng xem tài liệu đính kèm để biết thêm chi tiết. Chúng ta có thể sắp xếp một cuộc họp ngắn trong tuần này để xác nhận các bước tiếp theo không? Tôi mong sớm nhận được phản hồi từ ông. Trân trọng, Nam.'
      }
    ];

    const exercisesData = [
      [
        { vi: 'Xin chào, tên tôi là Nam và tôi 25 tuổi.', en: 'Hello, my name is Nam and I am 25 years old.', vocab: [] },
        { vi: 'Tôi đến từ Việt Nam, nhưng hiện tại tôi sống ở Nhật Bản.', en: 'I am from Vietnam, but I currently live in Japan.', vocab: [{ w: 'currently', m: 'hiện tại' }] },
        { vi: 'Trong tương lai, tôi muốn cải thiện tiếng Anh để có thể làm việc với các nhóm quốc tế.', en: 'In the future, I want to improve my English so I can work with international teams.', vocab: [{ w: 'improve', m: 'cải thiện' }, { w: 'international teams', m: 'các nhóm quốc tế' }] }
      ],
      [
        { vi: 'Vào thời gian rảnh, tôi thích đọc sách và nghe nhạc.', en: 'In my free time, I like reading books and listening to music.', vocab: [] },
        { vi: 'Sở thích lớn nhất của tôi là đi du lịch và khám phá những nơi mới.', en: 'My biggest hobby is traveling and exploring new places.', vocab: [{ w: 'hobby', m: 'sở thích' }, { w: 'exploring', m: 'khám phá' }] },
        { vi: 'Tôi cũng thường chơi bóng đá với bạn bè vào mỗi cuối tuần.', en: 'I also usually play soccer with my friends every weekend.', vocab: [{ w: 'usually', m: 'thường xuyên' }] }
      ],
      [
        { vi: 'Kính gửi ông Smith, tôi viết email này để thảo luận về dự án mới.', en: 'Dear Mr. Smith, I am writing this email to discuss the new project.', vocab: [{ w: 'discuss', m: 'thảo luận' }] },
        { vi: 'Vui lòng xem tài liệu đính kèm để biết thêm chi tiết.', en: 'Please find the attached document for more details.', vocab: [{ w: 'attached', m: 'đính kèm' }, { w: 'details', m: 'chi tiết' }] },
        { vi: 'Tôi mong sớm nhận được phản hồi từ ông.', en: 'I look forward to hearing from you soon.', vocab: [{ w: 'look forward to', m: 'mong đợi' }] }
      ]
    ];

    console.log('Seeding topics and extracted exercises...');
    for (let i = 0; i < topics.length; i += 1) {
      const topic = topics[i];
      const res = await pool.request()
        .input('title', sql.NVarChar, topic.Title)
        .input('desc', sql.NVarChar, topic.Description)
        .input('passageEN', sql.NText, topic.PassageEN)
        .input('passageVI', sql.NText, topic.PassageVI)
        .input('order', sql.Int, topic.OrderIndex)
        .query(`
          INSERT INTO WritingLessons (Title, Description, PassageEN, PassageVI, OrderIndex)
          VALUES (@title, @desc, @passageEN, @passageVI, @order) RETURNING Id
        `);

      const topicId = res.recordset[0].Id;

      for (let j = 0; j < exercisesData[i].length; j += 1) {
        const question = exercisesData[i][j];
        const exerciseRes = await pool.request()
          .input('lessonId', sql.UniqueIdentifier, topicId)
          .input('vi', sql.NVarChar, question.vi)
          .input('en', sql.NVarChar, question.en)
          .input('order', sql.Int, j + 1)
          .query(`
            INSERT INTO WritingExercises (LessonId, ContentVI, CorrectAnswerEN, OrderIndex)
            VALUES (@lessonId, @vi, @en, @order) RETURNING Id
          `);

        const exerciseId = exerciseRes.recordset[0].Id;

        for (const vocab of question.vocab) {
          await pool.request()
            .input('exId', sql.UniqueIdentifier, exerciseId)
            .input('word', sql.NVarChar, vocab.w)
            .input('meaning', sql.NVarChar, vocab.m)
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
