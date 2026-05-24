require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

const listeningLessons = [
  {
    title: 'A Morning Routine',
    description: 'Nghe hội thoại ngắn về thói quen buổi sáng.',
    level: 'A1',
    topic: 'Daily life',
    objective: 'Nhận biết thời gian, hoạt động hằng ngày và ý chính của cuộc hội thoại.',
    duration: '8 phút',
    vocabulary: [['weekday', 'ngày trong tuần'], ['catch the bus', 'bắt xe buýt'], ['usually', 'thường xuyên'], ['news', 'tin tức']],
    segments: [
      ['Anna', 'Hi Ben. What time do you wake up on weekdays?'],
      ['Ben', 'I usually wake up at six thirty. I catch the bus at seven fifteen.'],
      ['Anna', 'That is early. I wake up at seven and have breakfast at home.'],
      ['Ben', 'What do you eat for breakfast?'],
      ['Anna', 'I eat bread, drink coffee, and read the news for ten minutes.'],
      ['Ben', 'That sounds calm. My mornings are always busy.']
    ],
    questions: [
      ['multiple_choice', 'What is the conversation mainly about?', ['Weekend plans', 'Morning routines', 'A bus ticket', 'A school test'], 'Morning routines', null, '', 'Anna and Ben talk about waking up, breakfast, and going out in the morning.'],
      ['true_false', 'Ben catches the bus at seven fifteen.', [], '', true, '', 'Ben says he catches the bus at seven fifteen.'],
      ['fill_blank', 'Anna drinks coffee and reads the ____.', [], 'news', null, 'news\nthe news', 'The missing word is "news".']
    ]
  },
  {
    title: 'Checking In At A Hotel',
    description: 'Nghe tình huống nhận phòng khách sạn.',
    level: 'A2',
    topic: 'Travel',
    objective: 'Bắt thông tin về đặt phòng, giấy tờ và thời gian trả phòng.',
    duration: '10 phút',
    vocabulary: [['reservation', 'đặt phòng'], ['passport', 'hộ chiếu'], ['key card', 'thẻ phòng'], ['check-out', 'trả phòng']],
    segments: [
      ['Receptionist', 'Good evening. Welcome to Green Lake Hotel. How can I help you?'],
      ['Guest', 'Hello. I have a reservation under the name Nguyen.'],
      ['Receptionist', 'Let me check. Yes, one single room for two nights.'],
      ['Guest', 'That is right. Do you need my passport?'],
      ['Receptionist', 'Yes, please. Here is your key card. Breakfast is from six thirty to nine.'],
      ['Guest', 'Great. What time is check-out?'],
      ['Receptionist', 'Check-out is at eleven in the morning.']
    ],
    questions: [
      ['multiple_choice', 'How long will the guest stay?', ['One night', 'Two nights', 'Three nights', 'One week'], 'Two nights', null, '', 'The receptionist confirms one single room for two nights.'],
      ['true_false', 'Breakfast starts at six thirty.', [], '', true, '', 'The receptionist says breakfast is from six thirty to nine.'],
      ['fill_blank', 'Check-out is at ____ in the morning.', [], 'eleven', null, 'eleven\n11\n11:00', 'Check-out is at eleven in the morning.']
    ]
  }
];

const readingLessons = [
  {
    title: 'A Healthy Breakfast',
    description: 'Đọc đoạn văn ngắn về bữa sáng lành mạnh.',
    level: 'A1',
    topic: 'Health',
    objective: 'Hiểu ý chính, nhận biết thực phẩm và thói quen đơn giản.',
    duration: '7 phút',
    passageTitle: 'Why Breakfast Matters',
    vocabulary: [['healthy', 'lành mạnh'], ['energy', 'năng lượng'], ['instead of', 'thay vì'], ['habit', 'thói quen']],
    paragraphs: [
      'Many students skip breakfast because they are busy in the morning. This can make them feel tired before lunch.',
      'A healthy breakfast does not need to be complicated. A banana, an egg, some bread, or a bowl of rice can give the body energy.',
      'Drinking water is also important. It is better to drink water or milk instead of sweet drinks every morning.'
    ],
    questions: [
      ['multiple_choice', 'What is the main idea of the passage?', ['Breakfast can help students have energy', 'Students should sleep late', 'Sweet drinks are the best choice', 'Lunch is not important'], 'Breakfast can help students have energy', null, '', 'The passage explains why breakfast gives students energy.'],
      ['true_false', 'A healthy breakfast must be complicated.', [], '', false, '', 'The passage says a healthy breakfast does not need to be complicated.'],
      ['fill_blank', 'It is better to drink water or ____ instead of sweet drinks.', [], 'milk', null, 'milk', 'The final paragraph mentions water or milk.']
    ]
  },
  {
    title: 'The City Library',
    description: 'Đọc thông báo về thư viện thành phố.',
    level: 'A2',
    topic: 'Community',
    objective: 'Tìm thông tin về giờ mở cửa, dịch vụ và quy định.',
    duration: '9 phút',
    passageTitle: 'New Services At The City Library',
    vocabulary: [['membership card', 'thẻ thành viên'], ['borrow', 'mượn'], ['return', 'trả lại'], ['quiet area', 'khu vực yên tĩnh']],
    paragraphs: [
      'The City Library is open from 8 a.m. to 7 p.m. from Monday to Saturday. It is closed on Sundays.',
      'Visitors can read newspapers, use computers, and borrow up to five books with a membership card. Books must be returned within two weeks.',
      'The second floor is a quiet area for reading and studying. Phone calls are not allowed there.'
    ],
    questions: [
      ['multiple_choice', 'When is the library closed?', ['Monday', 'Friday', 'Saturday', 'Sunday'], 'Sunday', null, '', 'The first paragraph says the library is closed on Sundays.'],
      ['true_false', 'Visitors can borrow up to five books.', [], '', true, '', 'The notice says visitors can borrow up to five books with a membership card.'],
      ['fill_blank', 'Books must be returned within two ____.', [], 'weeks', null, 'weeks\nweek', 'Books must be returned within two weeks.']
    ]
  }
];

async function seedSkill(pool, skill, lessons) {
  const prefix = skill === 'listening' ? 'Listening' : 'Reading';
  const contentTable = skill === 'listening' ? 'ListeningSegments' : 'ReadingParagraphs';

  for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex += 1) {
    const lesson = lessons[lessonIndex];
    const existing = await pool.query(`SELECT Id FROM ${prefix}Lessons WHERE Title = $1 LIMIT 1`, [lesson.title]);
    if (existing.rows.length > 0) {
      console.log(`Skipped existing ${skill} lesson: ${lesson.title}`);
      continue;
    }

    const lessonResult = await pool.query(`
      INSERT INTO ${prefix}Lessons
        (Title, Description, Level, Topic, Objective, Duration, PassageTitle, OrderIndex, UpdatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING Id
    `, [lesson.title, lesson.description, lesson.level, lesson.topic, lesson.objective, lesson.duration, lesson.passageTitle || '', lessonIndex]);
    const lessonId = lessonResult.rows[0].id;

    for (let i = 0; i < lesson.vocabulary.length; i += 1) {
      await pool.query(`
        INSERT INTO ${prefix}Vocabulary (LessonId, Word, Meaning, OrderIndex)
        VALUES ($1, $2, $3, $4)
      `, [lessonId, lesson.vocabulary[i][0], lesson.vocabulary[i][1], i]);
    }

    if (skill === 'listening') {
      for (let i = 0; i < lesson.segments.length; i += 1) {
        await pool.query(`
          INSERT INTO ${contentTable} (LessonId, Speaker, Text, OrderIndex)
          VALUES ($1, $2, $3, $4)
        `, [lessonId, lesson.segments[i][0], lesson.segments[i][1], i]);
      }
    } else {
      for (let i = 0; i < lesson.paragraphs.length; i += 1) {
        await pool.query(`
          INSERT INTO ${contentTable} (LessonId, Content, OrderIndex)
          VALUES ($1, $2, $3)
        `, [lessonId, lesson.paragraphs[i], i]);
      }
    }

    for (let i = 0; i < lesson.questions.length; i += 1) {
      const [type, prompt, options, answer, boolAnswer, accepted, explanation] = lesson.questions[i];
      await pool.query(`
        INSERT INTO ${prefix}Questions
          (LessonId, QuestionType, Prompt, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, CorrectBoolean, AcceptedAnswers, Explanation, OrderIndex)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        lessonId,
        type,
        prompt,
        options[0] || '',
        options[1] || '',
        options[2] || '',
        options[3] || '',
        answer,
        boolAnswer,
        accepted,
        explanation,
        i
      ]);
    }

    console.log(`Seeded ${skill} lesson: ${lesson.title}`);
  }
}

async function seed() {
  try {
    await connectDB();
    const pool = getPool();
    await seedSkill(pool, 'listening', listeningLessons);
    await seedSkill(pool, 'reading', readingLessons);
    console.log('Listening/Reading seed completed.');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

seed();
