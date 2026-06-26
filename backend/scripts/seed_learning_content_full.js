require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { connectDB, getPool, closeDB } = require('../src/config/database');

const SKILL_TOPICS = [
  {
    title: 'Chào hỏi cơ bản',
    topic: 'Greetings',
    level: 'A1',
    foundation: true,
    words: [['greeting', 'lời chào'], ['neighbor', 'hàng xóm'], ['classmate', 'bạn cùng lớp'], ['polite', 'lịch sự']],
    keyWord: 'neighbor',
    vi: 'Tôi chào người hàng xóm mới vào buổi sáng.',
    en: 'I greet my new neighbor in the morning.',
    passage: [
      'Mia moves to a new street and wants to be friendly.',
      'In the morning, she says hello to her neighbor and asks a simple question.',
      'The short conversation helps both people feel comfortable.'
    ]
  },
  {
    title: 'Giới thiệu bản thân',
    topic: 'Self introduction',
    level: 'A1',
    foundation: true,
    words: [['name', 'tên'], ['from', 'đến từ'], ['student', 'học sinh'], ['favorite', 'yêu thích']],
    keyWord: 'student',
    vi: 'Tôi là học sinh và tôi đến từ Việt Nam.',
    en: 'I am a student and I am from Vietnam.',
    passage: [
      'Tom joins a new English club this week.',
      'He tells the group his name, his country, and his favorite hobby.',
      'A clear self introduction makes the first meeting easier.'
    ]
  },
  {
    title: 'Tại quán cà phê',
    topic: 'Cafe',
    level: 'A1',
    foundation: true,
    words: [['menu', 'thực đơn'], ['coffee', 'cà phê'], ['table', 'bàn'], ['receipt', 'hóa đơn']],
    keyWord: 'menu',
    vi: 'Tôi xem thực đơn và gọi một ly cà phê.',
    en: 'I look at the menu and order a coffee.',
    passage: [
      'A small cafe opens near the school.',
      'Lan looks at the menu and orders a coffee with milk.',
      'She keeps the receipt because she needs to return to class soon.'
    ]
  },
  {
    title: 'Hỏi đường',
    topic: 'Directions',
    level: 'A1',
    foundation: true,
    words: [['turn left', 'rẽ trái'], ['station', 'nhà ga'], ['corner', 'góc đường'], ['straight', 'đi thẳng']],
    keyWord: 'station',
    vi: 'Nhà ga ở bên trái sau góc đường.',
    en: 'The station is on the left after the corner.',
    passage: [
      'A visitor cannot find the train station.',
      'A local person tells him to go straight and turn left at the corner.',
      'The directions are short, so the visitor can remember them.'
    ]
  },
  {
    title: 'Mua sắm',
    topic: 'Shopping',
    level: 'A1',
    foundation: true,
    words: [['price', 'giá'], ['size', 'kích cỡ'], ['cheap', 'rẻ'], ['cash', 'tiền mặt']],
    keyWord: 'price',
    vi: 'Tôi hỏi giá của chiếc áo màu xanh.',
    en: 'I ask about the price of the blue shirt.',
    passage: [
      'Ben wants to buy a blue shirt for school.',
      'He asks about the price and checks the size before paying.',
      'The shop assistant is polite and gives him a small bag.'
    ]
  },
  {
    title: 'Lên kế hoạch cuối tuần',
    topic: 'Weekend plans',
    level: 'A2',
    foundation: false,
    words: [['plan', 'kế hoạch'], ['museum', 'bảo tàng'], ['invite', 'mời'], ['available', 'rảnh']],
    keyWord: 'museum',
    vi: 'Chúng tôi dự định đi bảo tàng vào thứ Bảy.',
    en: 'We plan to visit the museum on Saturday.',
    passage: [
      'Two friends are planning their weekend after a busy week.',
      'They choose the city museum because it has a new science show.',
      'They invite one more classmate and agree to meet at nine.'
    ]
  },
  {
    title: 'Cuộc hẹn bác sĩ',
    topic: 'Health',
    level: 'A2',
    foundation: false,
    words: [['appointment', 'cuộc hẹn'], ['headache', 'đau đầu'], ['medicine', 'thuốc'], ['rest', 'nghỉ ngơi']],
    keyWord: 'appointment',
    vi: 'Tôi có một cuộc hẹn với bác sĩ vào chiều nay.',
    en: 'I have an appointment with the doctor this afternoon.',
    passage: [
      'Nam has a headache and feels tired after school.',
      'His mother calls the clinic and makes an appointment for the afternoon.',
      'The doctor tells him to drink water, take medicine, and rest early.'
    ]
  },
  {
    title: 'Đi du lịch',
    topic: 'Travel',
    level: 'A2',
    foundation: false,
    words: [['ticket', 'vé'], ['luggage', 'hành lý'], ['reservation', 'đặt chỗ'], ['platform', 'sân ga']],
    keyWord: 'ticket',
    vi: 'Tôi kiểm tra vé và mang hành lý lên tàu.',
    en: 'I check my ticket and take my luggage onto the train.',
    passage: [
      'A family is taking the train to Da Nang for a short holiday.',
      'They check their tickets, find the platform, and put their luggage near the seats.',
      'The trip starts on time and everyone is excited.'
    ]
  },
  {
    title: 'Công việc',
    topic: 'Work',
    level: 'B1',
    foundation: false,
    words: [['meeting', 'cuộc họp'], ['deadline', 'hạn chót'], ['report', 'báo cáo'], ['feedback', 'phản hồi']],
    keyWord: 'deadline',
    vi: 'Tôi hoàn thành báo cáo trước hạn chót.',
    en: 'I finish the report before the deadline.',
    passage: [
      'Mai has a meeting with her team on Monday morning.',
      'They discuss the report deadline and share feedback on the first draft.',
      'Good planning helps the team finish the work on time.'
    ]
  },
  {
    title: 'Bảo vệ môi trường',
    topic: 'Environment',
    level: 'B1',
    foundation: false,
    words: [['recycle', 'tái chế'], ['reduce', 'giảm'], ['waste', 'rác thải'], ['habit', 'thói quen']],
    keyWord: 'recycle',
    vi: 'Chúng ta nên tái chế giấy và giảm rác thải nhựa.',
    en: 'We should recycle paper and reduce plastic waste.',
    passage: [
      'Small daily habits can protect the environment.',
      'Students can recycle paper, bring reusable bottles, and reduce plastic waste.',
      'These actions are simple, but they create a cleaner school.'
    ]
  }
];

const VOCAB_DECKS = [
  {
    name: 'Từ vựng sinh hoạt hằng ngày',
    description: 'Các từ dùng trong lịch trình, nhà cửa và giao tiếp thường ngày.',
    words: [
      ['routine', 'thói quen hằng ngày', 'My morning routine starts at six.'],
      ['meal', 'bữa ăn', 'Dinner is my favorite meal.'],
      ['laundry', 'việc giặt giũ', 'I do the laundry on Sunday.'],
      ['neighbor', 'hàng xóm', 'Our neighbor is very friendly.'],
      ['errand', 'việc vặt', 'I have two errands after work.'],
      ['tidy', 'gọn gàng', 'Please keep your desk tidy.'],
      ['usually', 'thường xuyên', 'I usually walk to school.'],
      ['prepare', 'chuẩn bị', 'We prepare lunch together.']
    ]
  },
  {
    name: 'Từ vựng ăn uống và mua sắm',
    description: 'Từ vựng gọi món, hỏi giá, thanh toán và lựa chọn sản phẩm.',
    words: [
      ['menu', 'thực đơn', 'The menu has many drinks.'],
      ['receipt', 'hóa đơn', 'Keep the receipt after paying.'],
      ['discount', 'giảm giá', 'This jacket has a discount.'],
      ['cashier', 'thu ngân', 'The cashier is near the door.'],
      ['order', 'gọi món', 'I order rice and chicken.'],
      ['portion', 'khẩu phần', 'The portion is quite large.'],
      ['refund', 'hoàn tiền', 'Can I get a refund?'],
      ['recommend', 'giới thiệu', 'Can you recommend a good dish?']
    ]
  },
  {
    name: 'Từ vựng học tập và công việc',
    description: 'Từ vựng cho lớp học, bài tập, họp nhóm và công việc văn phòng.',
    words: [
      ['assignment', 'bài tập được giao', 'The assignment is due Friday.'],
      ['deadline', 'hạn chót', 'The deadline is tomorrow.'],
      ['meeting', 'cuộc họp', 'We have a meeting at ten.'],
      ['feedback', 'phản hồi', 'The teacher gave helpful feedback.'],
      ['submit', 'nộp', 'Please submit your work online.'],
      ['presentation', 'bài thuyết trình', 'Her presentation was clear.'],
      ['colleague', 'đồng nghiệp', 'My colleague helped me.'],
      ['priority', 'việc ưu tiên', 'Speaking practice is my priority.']
    ]
  },
  {
    name: 'Từ vựng du lịch và dịch vụ',
    description: 'Từ vựng đặt phòng, hỏi đường, đi tàu xe và xử lý tình huống du lịch.',
    words: [
      ['reservation', 'sự đặt chỗ', 'I have a reservation for two nights.'],
      ['luggage', 'hành lý', 'My luggage is heavy.'],
      ['platform', 'sân ga', 'The train leaves from platform two.'],
      ['boarding pass', 'thẻ lên máy bay', 'Show your boarding pass at the gate.'],
      ['delay', 'sự chậm trễ', 'The flight has a delay.'],
      ['direction', 'chỉ dẫn đường đi', 'Can you give me directions?'],
      ['available', 'có sẵn', 'Is a room available tonight?'],
      ['cancel', 'hủy', 'I need to cancel the booking.']
    ]
  },
  {
    name: 'Từ vựng sức khỏe và môi trường',
    description: 'Từ vựng thông dụng về cơ thể, thói quen tốt và bảo vệ môi trường.',
    words: [
      ['appointment', 'cuộc hẹn', 'I have a doctor appointment.'],
      ['medicine', 'thuốc', 'Take this medicine after meals.'],
      ['symptom', 'triệu chứng', 'A fever is a common symptom.'],
      ['healthy', 'lành mạnh', 'Fruit is a healthy snack.'],
      ['recycle', 'tái chế', 'We recycle paper at school.'],
      ['waste', 'rác thải', 'Plastic waste is a problem.'],
      ['reduce', 'giảm', 'We should reduce waste.'],
      ['energy', 'năng lượng', 'Walking saves energy.']
    ]
  }
];

function normalizeId(row) {
  return row?.id || row?.Id;
}

function makeListeningLesson(topic, index) {
  const [speakerA, speakerB] = index % 2 === 0 ? ['Emma', 'Daniel'] : ['Jenny', 'Mark'];
  return {
    ...topic,
    description: `Nghe hội thoại về chủ đề ${topic.topic.toLowerCase()}.`,
    objective: `Nghe hiểu ý chính và thông tin quan trọng về ${topic.topic.toLowerCase()}.`,
    duration: topic.foundation ? '8 phút' : '10 phút',
    passageTitle: topic.title,
    speakers: [
      { name: speakerA, gender: 'female', voiceName: 'Jenny', orderIndex: 1 },
      { name: speakerB, gender: 'male', voiceName: 'Guy', orderIndex: 2 }
    ],
    segments: [
      [speakerA, `Hi ${speakerB}. Are you ready for our ${topic.topic.toLowerCase()} practice?`],
      [speakerB, `Yes. I learned one useful word today: ${topic.keyWord}.`],
      [speakerA, `Great. Can you use it in a sentence?`],
      [speakerB, topic.en],
      [speakerA, 'That sounds natural. What should we remember?'],
      [speakerB, `We should speak clearly and listen for the word ${topic.keyWord}.`]
    ],
    questions: [
      ['multiple_choice', `What topic are the speakers practicing?`, [topic.topic, 'Sports news', 'A birthday party', 'A movie review'], topic.topic, null, '', `They talk about ${topic.topic.toLowerCase()}.`],
      ['true_false', `The useful word is "${topic.keyWord}".`, [], '', true, '', `The speaker says the useful word is ${topic.keyWord}.`],
      ['fill_blank', `The speaker says: ${topic.en.replace(topic.keyWord, '____')}`, [], topic.keyWord, null, `${topic.keyWord}`, `The missing word is ${topic.keyWord}.`]
    ]
  };
}

function makeReadingLesson(topic) {
  return {
    ...topic,
    description: `Đọc đoạn văn ngắn về ${topic.topic.toLowerCase()}.`,
    objective: `Tìm ý chính, từ khóa và chi tiết trong chủ đề ${topic.topic.toLowerCase()}.`,
    duration: topic.foundation ? '7 phút' : '9 phút',
    passageTitle: topic.title,
    paragraphs: topic.passage,
    questions: [
      ['multiple_choice', 'What is the passage mainly about?', [topic.topic, 'A sports match', 'A fantasy story', 'A weather report'], topic.topic, null, '', `The passage focuses on ${topic.topic.toLowerCase()}.`],
      ['true_false', `The passage includes the word "${topic.keyWord}".`, [], '', true, '', `The vocabulary list includes ${topic.keyWord}.`],
      ['fill_blank', topic.en.replace(topic.keyWord, '____'), [], topic.keyWord, null, topic.keyWord, `The missing word is ${topic.keyWord}.`]
    ]
  };
}

function makeSpeakingLesson(topic, index) {
  const prompts = [
    [`Say this sentence clearly: ${topic.en}`, topic.vi],
    [`Ask a question about ${topic.topic.toLowerCase()}.`, `Hãy hỏi một câu về ${topic.topic.toLowerCase()}.`],
    [`Tell a friend: ${topic.en}`, topic.vi],
    [`Explain one useful word: ${topic.keyWord}.`, `Giải thích từ ${topic.keyWord}.`],
    [`Make a short answer about ${topic.topic.toLowerCase()}.`, `Tạo câu trả lời ngắn về ${topic.topic.toLowerCase()}.`]
  ];
  return {
    title: topic.title,
    description: `Luyện nói theo chủ đề ${topic.topic.toLowerCase()}.`,
    foundation: topic.foundation,
    orderIndex: index + 1,
    questions: prompts.map(([question, translation], orderIndex) => ({
      question,
      translation,
      option1: topic.en,
      option1vi: topic.vi,
      option2: `I can talk about ${topic.topic.toLowerCase()}.`,
      option2vi: `Tôi có thể nói về ${topic.topic.toLowerCase()}.`,
      option3: `The key word is ${topic.keyWord}.`,
      option3vi: `Từ khóa là ${topic.keyWord}.`,
      orderIndex: orderIndex + 1
    }))
  };
}

function makeWritingLesson(topic, index) {
  return {
    title: topic.title,
    description: `Luyện viết câu theo chủ đề ${topic.topic.toLowerCase()}.`,
    foundation: topic.foundation,
    orderIndex: index + 1,
    passageEN: `${topic.en} This topic is useful for daily English. I can write short and clear sentences about it.`,
    passageVI: `${topic.vi} Chủ đề này hữu ích cho tiếng Anh hằng ngày. Tôi có thể viết câu ngắn và rõ ràng về nó.`,
    exercises: [
      [topic.vi, topic.en],
      [`Từ khóa của bài học là ${topic.keyWord}.`, `The key word of the lesson is ${topic.keyWord}.`],
      [`Tôi có thể luyện viết về ${topic.topic.toLowerCase()}.`, `I can practice writing about ${topic.topic.toLowerCase()}.`],
      ['Câu trả lời của tôi ngắn và rõ ràng.', 'My answer is short and clear.']
    ]
  };
}

function makeGameLevel(topic, index) {
  const words = topic.words;
  const sentenceWords = topic.en.replace(/[.]/g, '').split(' ');
  const secondSentence = `The key word is ${topic.keyWord}.`;
  const secondSentenceVi = `Từ khóa là ${topic.keyWord}.`;
  const secondSentenceWords = secondSentence.replace(/[.]/g, '').split(' ');
  return {
    levelNumber: index + 1,
    name: `${index + 1}. ${topic.title}`,
    difficulty: index < 4 ? 'easy' : index < 8 ? 'medium' : 'hard',
    timeLimit: index < 4 ? 90 : 120,
    passScore: 70,
    isLocked: index > 0,
    questions: [
      {
        type: 'matching',
        contentEN: words[0][0],
        contentVI: words[0][1],
        correctAnswer: words[0][1],
        options: [words[1][1], words[2][1], words[3][1]]
      },
      {
        type: 'matching',
        contentEN: words[1][0],
        contentVI: words[1][1],
        correctAnswer: words[1][1],
        options: [words[0][1], words[2][1], words[3][1]]
      },
      {
        type: 'listening',
        contentEN: topic.en,
        contentVI: topic.vi,
        correctAnswer: topic.en,
        options: [topic.en, `I like ${topic.topic.toLowerCase()}.`, `This is my book.`, `We are at school.`]
      },
      {
        type: 'listening',
        contentEN: secondSentence,
        contentVI: secondSentenceVi,
        correctAnswer: secondSentence,
        options: [secondSentence, `The answer is easy.`, `I go home early.`, `Please open the door.`]
      },
      {
        type: 'listenbuild',
        contentEN: topic.en,
        contentVI: topic.vi,
        correctAnswer: topic.en,
        options: sentenceWords
      },
      {
        type: 'listenbuild',
        contentEN: secondSentence,
        contentVI: secondSentenceVi,
        correctAnswer: secondSentence,
        options: secondSentenceWords
      },
      {
        type: 'truefalse',
        contentEN: topic.en,
        contentVI: topic.vi,
        correctAnswer: 'true',
        options: []
      },
      {
        type: 'truefalse',
        contentEN: secondSentence,
        contentVI: `Tôi thích ${topic.topic.toLowerCase()}.`,
        correctAnswer: 'false',
        options: []
      },
      {
        type: 'speakrepeat',
        contentEN: topic.en,
        contentVI: topic.vi,
        correctAnswer: topic.en,
        options: { passScore: 70 }
      },
      {
        type: 'speakrepeat',
        contentEN: secondSentence,
        contentVI: secondSentenceVi,
        correctAnswer: secondSentence,
        options: { passScore: 70 }
      }
    ]
  };
}

async function upsertLesson(pool, table, lesson, extra = {}) {
  const existing = await pool.query(`SELECT Id FROM ${table} WHERE lower(Title) = lower($1) LIMIT 1`, [lesson.title]);
  if (existing.rows[0]) {
    const id = normalizeId(existing.rows[0]);
    await pool.query(`
      UPDATE ${table}
      SET Title = $2,
          Description = $3,
          IsFoundation = $4,
          OrderIndex = $5
          ${extra.updateSql || ''}
      WHERE Id = $1
    `, [id, lesson.title, lesson.description, lesson.foundation, lesson.orderIndex, ...(extra.updateValues || [])]);
    return id;
  }

  const inserted = await pool.query(`
    INSERT INTO ${table}
      (Title, Description, IsFoundation, OrderIndex ${extra.insertColumns || ''})
    VALUES
      ($1, $2, $3, $4 ${extra.insertPlaceholders || ''})
    RETURNING Id
  `, [lesson.title, lesson.description, lesson.foundation, lesson.orderIndex, ...(extra.insertValues || [])]);
  return normalizeId(inserted.rows[0]);
}

async function seedListening(pool) {
  const lessons = SKILL_TOPICS.map(makeListeningLesson);
  let count = 0;
  for (let i = 0; i < lessons.length; i += 1) {
    const lesson = { ...lessons[i], orderIndex: i + 1 };
    const lessonId = await upsertLesson(pool, 'ListeningLessons', lesson, {
      updateSql: ', Level = $6, Topic = $7, Objective = $8, Duration = $9, PassageTitle = $10, UpdatedAt = NOW()',
      updateValues: [lesson.level, lesson.topic, lesson.objective, lesson.duration, lesson.passageTitle],
      insertColumns: ', Level, Topic, Objective, Duration, PassageTitle, UpdatedAt',
      insertPlaceholders: ', $5, $6, $7, $8, $9, NOW()',
      insertValues: [lesson.level, lesson.topic, lesson.objective, lesson.duration, lesson.passageTitle]
    });

    await pool.query('DELETE FROM ListeningQuestions WHERE LessonId = $1', [lessonId]);
    await pool.query('DELETE FROM ListeningVocabulary WHERE LessonId = $1', [lessonId]);
    await pool.query('DELETE FROM ListeningSegments WHERE LessonId = $1', [lessonId]);
    await pool.query('DELETE FROM ListeningSpeakers WHERE LessonId = $1', [lessonId]);

    const speakerIds = {};
    for (const speaker of lesson.speakers) {
      const res = await pool.query(`
        INSERT INTO ListeningSpeakers (LessonId, Name, Gender, VoiceName, VoiceURI, OrderIndex, UpdatedAt)
        VALUES ($1, $2, $3, $4, NULL, $5, NOW())
        RETURNING Id
      `, [lessonId, speaker.name, speaker.gender, speaker.voiceName, speaker.orderIndex]);
      speakerIds[speaker.name] = normalizeId(res.rows[0]);
    }

    for (let j = 0; j < lesson.segments.length; j += 1) {
      const [speaker, text] = lesson.segments[j];
      await pool.query(`
        INSERT INTO ListeningSegments (LessonId, SpeakerId, Speaker, Text, OrderIndex)
        VALUES ($1, $2, $3, $4, $5)
      `, [lessonId, speakerIds[speaker], speaker, text, j + 1]);
    }

    await insertReceptiveChildren(pool, 'Listening', lessonId, lesson);
    count += 1;
  }
  return count;
}

async function seedReading(pool) {
  const lessons = SKILL_TOPICS.map(makeReadingLesson);
  let count = 0;
  for (let i = 0; i < lessons.length; i += 1) {
    const lesson = { ...lessons[i], orderIndex: i + 1 };
    const lessonId = await upsertLesson(pool, 'ReadingLessons', lesson, {
      updateSql: ', Level = $6, Topic = $7, Objective = $8, Duration = $9, PassageTitle = $10, UpdatedAt = NOW()',
      updateValues: [lesson.level, lesson.topic, lesson.objective, lesson.duration, lesson.passageTitle],
      insertColumns: ', Level, Topic, Objective, Duration, PassageTitle, UpdatedAt',
      insertPlaceholders: ', $5, $6, $7, $8, $9, NOW()',
      insertValues: [lesson.level, lesson.topic, lesson.objective, lesson.duration, lesson.passageTitle]
    });

    await pool.query('DELETE FROM ReadingQuestions WHERE LessonId = $1', [lessonId]);
    await pool.query('DELETE FROM ReadingVocabulary WHERE LessonId = $1', [lessonId]);
    await pool.query('DELETE FROM ReadingParagraphs WHERE LessonId = $1', [lessonId]);

    for (let j = 0; j < lesson.paragraphs.length; j += 1) {
      await pool.query('INSERT INTO ReadingParagraphs (LessonId, Content, OrderIndex) VALUES ($1, $2, $3)', [lessonId, lesson.paragraphs[j], j + 1]);
    }

    await insertReceptiveChildren(pool, 'Reading', lessonId, lesson);
    count += 1;
  }
  return count;
}

async function insertReceptiveChildren(pool, prefix, lessonId, lesson) {
  for (let j = 0; j < lesson.words.length; j += 1) {
    await pool.query(`INSERT INTO ${prefix}Vocabulary (LessonId, Word, Meaning, OrderIndex) VALUES ($1, $2, $3, $4)`, [lessonId, lesson.words[j][0], lesson.words[j][1], j + 1]);
  }

  for (let j = 0; j < lesson.questions.length; j += 1) {
    const [type, prompt, options, answer, boolAnswer, accepted, explanation] = lesson.questions[j];
    await pool.query(`
      INSERT INTO ${prefix}Questions
        (LessonId, QuestionType, Prompt, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, CorrectBoolean, AcceptedAnswers, Explanation, OrderIndex)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [lessonId, type, prompt, options[0] || '', options[1] || '', options[2] || '', options[3] || '', answer, boolAnswer, accepted, explanation, j + 1]);
  }
}

async function seedSpeaking(pool) {
  const lessons = SKILL_TOPICS.map(makeSpeakingLesson);
  let count = 0;
  for (const lesson of lessons) {
    const lessonId = await upsertLesson(pool, 'SpeakingLessons', lesson);
    await pool.query('DELETE FROM SpeakingQuestions WHERE LessonId = $1', [lessonId]);
    for (const item of lesson.questions) {
      await pool.query(`
        INSERT INTO SpeakingQuestions
          (LessonId, Question, Translation, Option1, Option1VI, Option2, Option2VI, Option3, Option3VI, OrderIndex)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [lessonId, item.question, item.translation, item.option1, item.option1vi, item.option2, item.option2vi, item.option3, item.option3vi, item.orderIndex]);
    }
    count += 1;
  }
  return count;
}

async function seedWriting(pool) {
  const lessons = SKILL_TOPICS.map(makeWritingLesson);
  let count = 0;
  for (const lesson of lessons) {
    const lessonId = await upsertLesson(pool, 'WritingLessons', lesson, {
      updateSql: ', PassageEN = $6, PassageVI = $7',
      updateValues: [lesson.passageEN, lesson.passageVI],
      insertColumns: ', PassageEN, PassageVI',
      insertPlaceholders: ', $5, $6',
      insertValues: [lesson.passageEN, lesson.passageVI]
    });
    await pool.query('DELETE FROM WritingVocab WHERE ExerciseId IN (SELECT Id FROM WritingExercises WHERE LessonId = $1)', [lessonId]);
    await pool.query('DELETE FROM WritingExercises WHERE LessonId = $1', [lessonId]);
    for (let i = 0; i < lesson.exercises.length; i += 1) {
      const [contentVI, correctAnswerEN] = lesson.exercises[i];
      const res = await pool.query(`
        INSERT INTO WritingExercises (LessonId, ContentVI, CorrectAnswerEN, OrderIndex)
        VALUES ($1, $2, $3, $4)
        RETURNING Id
      `, [lessonId, contentVI, correctAnswerEN, i + 1]);
      const exerciseId = normalizeId(res.rows[0]);
      await pool.query('INSERT INTO WritingVocab (ExerciseId, Word, Meaning) VALUES ($1, $2, $3)', [exerciseId, SKILL_TOPICS[i % SKILL_TOPICS.length].keyWord, 'từ khóa trong bài']);
    }
    count += 1;
  }
  return count;
}

async function seedGames(pool) {
  const levels = SKILL_TOPICS.map(makeGameLevel);
  let count = 0;
  for (const level of levels) {
    const existing = await pool.query('SELECT Id FROM GameLevels WHERE LevelNumber = $1 LIMIT 1', [level.levelNumber]);
    let levelId;
    if (existing.rows[0]) {
      levelId = normalizeId(existing.rows[0]);
      await pool.query(`
        UPDATE GameLevels
        SET Name = $2, Difficulty = $3, TimeLimit = $4, PassScore = $5, IsLocked = $6
        WHERE Id = $1
      `, [levelId, level.name, level.difficulty, level.timeLimit, level.passScore, level.isLocked]);
    } else {
      const inserted = await pool.query(`
        INSERT INTO GameLevels (LevelNumber, Name, Difficulty, TimeLimit, PassScore, IsLocked)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING Id
      `, [level.levelNumber, level.name, level.difficulty, level.timeLimit, level.passScore, level.isLocked]);
      levelId = normalizeId(inserted.rows[0]);
    }

    await pool.query('DELETE FROM MiniGameQuestions WHERE LevelId = $1', [levelId]);
    for (let i = 0; i < level.questions.length; i += 1) {
      const q = level.questions[i];
      await pool.query(`
        INSERT INTO MiniGameQuestions
          (LevelId, QuestionType, ContentEN, ContentVI, CorrectAnswer, Options, OrderIndex)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [levelId, q.type, q.contentEN, q.contentVI, q.correctAnswer, JSON.stringify(q.options), i + 1]);
    }
    count += 1;
  }
  return count;
}

async function findCreator(pool) {
  const res = await pool.query(`
    SELECT Id, Role, Username, Email
    FROM Users
    ORDER BY CASE WHEN Role = 'admin' THEN 0 ELSE 1 END, CreatedAt ASC
    LIMIT 1
  `);
  return res.rows[0] || null;
}

async function seedVocabulary(pool) {
  const creator = await findCreator(pool);
  if (!creator) throw new Error('No user found. Create an admin/user before seeding public vocabulary.');

  let count = 0;
  for (const deck of VOCAB_DECKS) {
    const existing = await pool.query('SELECT Id FROM UserCollections WHERE IsPublic = true AND lower(Name) = lower($1) LIMIT 1', [deck.name]);
    let collectionId;
    if (existing.rows[0]) {
      collectionId = normalizeId(existing.rows[0]);
      await pool.query(`
        UPDATE UserCollections
        SET Description = $2,
            IsPublic = true,
            ReviewStatus = 'approved',
            ReviewedAt = COALESCE(ReviewedAt, NOW()),
            ReviewedBy = COALESCE(ReviewedBy, $3),
            UpdatedAt = NOW()
        WHERE Id = $1
      `, [collectionId, deck.description, creator.role === 'admin' ? normalizeId(creator) : null]);
    } else {
      const inserted = await pool.query(`
        INSERT INTO UserCollections
          (UserId, Name, Description, IsPublic, ReviewStatus, SubmittedAt, ReviewedAt, ReviewedBy, UpdatedAt)
        VALUES ($1, $2, $3, true, 'approved', NOW(), NOW(), $4, NOW())
        RETURNING Id
      `, [normalizeId(creator), deck.name, deck.description, creator.role === 'admin' ? normalizeId(creator) : null]);
      collectionId = normalizeId(inserted.rows[0]);
    }

    await pool.query('DELETE FROM UserCollectionWords WHERE CollectionId = $1', [collectionId]);
    for (const word of deck.words) {
      await pool.query(`
        INSERT INTO UserCollectionWords (CollectionId, CustomWord, CustomMeaning, CustomExample, UpdatedAt)
        VALUES ($1, $2, $3, $4, NOW())
      `, [collectionId, word[0], word[1], word[2]]);
    }
    count += 1;
  }
  return count;
}

async function cleanupExtraSkillLessons(pool) {
  const managedTitles = new Set(SKILL_TOPICS.map((item) => item.title.toLowerCase()));
  const deleted = { speaking: 0, writing: 0 };

  const speakingRows = await pool.query('SELECT Id, Title FROM SpeakingLessons ORDER BY OrderIndex ASC, CreatedAt ASC');
  for (const row of speakingRows.rows) {
    const title = String(row.title || row.Title || '').toLowerCase();
    if (managedTitles.has(title)) continue;
    const id = normalizeId(row);
    await pool.query('DELETE FROM SpeakingProgress WHERE LessonId = $1', [id]);
    await pool.query('DELETE FROM SpeakingQuestions WHERE LessonId = $1', [id]);
    await pool.query('DELETE FROM SpeakingLessons WHERE Id = $1', [id]);
    deleted.speaking += 1;
  }

  const writingRows = await pool.query('SELECT Id, Title FROM WritingLessons ORDER BY OrderIndex ASC, CreatedAt ASC');
  for (const row of writingRows.rows) {
    const title = String(row.title || row.Title || '').toLowerCase();
    if (managedTitles.has(title)) continue;
    const id = normalizeId(row);
    await pool.query('DELETE FROM WritingProgress WHERE LessonId = $1', [id]);
    await pool.query('DELETE FROM WritingVocab WHERE ExerciseId IN (SELECT Id FROM WritingExercises WHERE LessonId = $1)', [id]);
    await pool.query('DELETE FROM WritingExercises WHERE LessonId = $1', [id]);
    await pool.query('DELETE FROM WritingLessons WHERE Id = $1', [id]);
    deleted.writing += 1;
  }

  return deleted;
}

async function getCounts(pool) {
  const names = [
    ['listeningLessons', 'ListeningLessons'],
    ['readingLessons', 'ReadingLessons'],
    ['speakingLessons', 'SpeakingLessons'],
    ['writingLessons', 'WritingLessons'],
    ['gameLevels', 'GameLevels'],
    ['publicVocabularyDecks', 'UserCollections WHERE IsPublic = true AND ReviewStatus = \'approved\'']
  ];
  const output = {};
  for (const [key, table] of names) {
    const res = await pool.query(`SELECT COUNT(*)::int AS count FROM ${table}`);
    output[key] = res.rows[0].count;
  }
  return output;
}

async function run() {
  await connectDB();
  const pool = getPool();
  await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  const requested = new Set(process.argv.slice(2).map((item) => item.toLowerCase()));
  const shouldRun = (name) => requested.size === 0 || requested.has(name) || requested.has('all');

  const before = await getCounts(pool);
  const seeded = {};
  if (shouldRun('listening')) seeded.listening = await seedListening(pool);
  if (shouldRun('reading')) seeded.reading = await seedReading(pool);
  if (shouldRun('speaking')) seeded.speaking = await seedSpeaking(pool);
  if (shouldRun('writing')) seeded.writing = await seedWriting(pool);
  if (shouldRun('games')) seeded.miniGameLevels = await seedGames(pool);
  if (shouldRun('vocabulary')) seeded.publicVocabularyDecks = await seedVocabulary(pool);
  if (shouldRun('cleanup')) seeded.cleanup = await cleanupExtraSkillLessons(pool);
  const after = await getCounts(pool);

  console.log(JSON.stringify({ before, seeded, after }, null, 2));
}

run()
  .catch((error) => {
    console.error('Full learning content seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDB();
  });
