require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const crypto = require('crypto');
const { connectDB, getPool, closeDB } = require('../src/config/database');
const { ensureOnboardingSchema } = require('../src/modules/onboarding/onboarding.schema');

function stableId(scope, value) {
  const hex = crypto.createHash('sha1').update(`${scope}:${value}`).digest('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `${((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)}${hex.slice(17, 20)}`,
    hex.slice(20, 32)
  ].join('-');
}

const listeningLessons = [
  {
    key: 'hello-name',
    title: 'Chào hỏi và giới thiệu tên',
    description: 'Nghe các câu chào hỏi rất ngắn cho người mới bắt đầu.',
    topic: 'Greetings',
    orderIndex: -40,
    segments: [
      ['Anna', 'Hello. My name is Anna.'],
      ['Ben', 'Hi Anna. I am Ben.'],
      ['Anna', 'Nice to meet you, Ben.'],
      ['Ben', 'Nice to meet you too.']
    ],
    vocab: [['hello', 'xin chào'], ['name', 'tên'], ['nice to meet you', 'rất vui được gặp bạn']],
    questions: [
      ['multiple_choice', 'What is the woman’s name?', ['Anna', 'Ben', 'Mai', 'Tom'], 'Anna'],
      ['true_false', 'Ben says: I am Ben.', [], 'true'],
      ['fill_blank', 'Nice to ____ you.', [], 'meet']
    ]
  },
  {
    key: 'numbers-info',
    title: 'Số và thông tin cá nhân',
    description: 'Nghe số tuổi, số điện thoại đơn giản và câu hỏi thông tin cá nhân.',
    topic: 'Personal information',
    orderIndex: -39,
    segments: [
      ['Mai', 'How old are you?'],
      ['Tom', 'I am eighteen years old.'],
      ['Mai', 'What is your phone number?'],
      ['Tom', 'It is one two three four.']
    ],
    vocab: [['old', 'tuổi'], ['phone number', 'số điện thoại'], ['eighteen', 'mười tám']],
    questions: [
      ['multiple_choice', 'How old is Tom?', ['Eight', 'Eighteen', 'Twenty', 'Ten'], 'Eighteen'],
      ['true_false', 'Tom’s number starts with one.', [], 'true'],
      ['fill_blank', 'What is your phone ____?', [], 'number']
    ]
  }
];

const readingLessons = [
  {
    key: 'my-name',
    title: 'My Name Is Linh',
    description: 'Đọc đoạn giới thiệu bản thân rất ngắn.',
    topic: 'Self introduction',
    orderIndex: -40,
    passageTitle: 'A Short Introduction',
    paragraphs: [
      'My name is Linh. I am a student. I live in Da Nang.',
      'I like English. I study English every day.'
    ],
    vocab: [['student', 'học sinh/sinh viên'], ['live', 'sống'], ['study', 'học']],
    questions: [
      ['multiple_choice', 'What is her name?', ['Linh', 'Anna', 'Ben', 'Tom'], 'Linh'],
      ['true_false', 'Linh lives in Da Nang.', [], 'true'],
      ['fill_blank', 'I ____ English every day.', [], 'study']
    ]
  },
  {
    key: 'classroom-things',
    title: 'Things In My Classroom',
    description: 'Đọc tên đồ vật quen thuộc trong lớp học.',
    topic: 'Classroom',
    orderIndex: -39,
    passageTitle: 'My Classroom',
    paragraphs: [
      'This is my classroom. There is a board, a desk, and many chairs.',
      'My book is on the desk. My pen is in my bag.'
    ],
    vocab: [['board', 'bảng'], ['desk', 'bàn học'], ['chair', 'ghế']],
    questions: [
      ['multiple_choice', 'Where is the book?', ['On the desk', 'In the bag', 'Under the chair', 'Near the door'], 'On the desk'],
      ['true_false', 'The pen is in the bag.', [], 'true'],
      ['fill_blank', 'There is a ____ in the classroom.', [], 'board']
    ]
  }
];

const speakingLessons = [
  {
    key: 'basic-greetings',
    title: 'Chào hỏi cơ bản',
    description: 'Tập nói các câu chào hỏi ngắn và rõ.',
    orderIndex: -40,
    questions: [
      ['Hello. What is your name?', 'Xin chào. Bạn tên là gì?', [['My name is Linh.', 'Tên tôi là Linh.'], ['I am a student.', 'Tôi là học sinh.'], ['I live in Vietnam.', 'Tôi sống ở Việt Nam.']]],
      ['How are you today?', 'Hôm nay bạn khỏe không?', [['I am fine, thank you.', 'Tôi khỏe, cảm ơn.'], ['My name is Nam.', 'Tên tôi là Nam.'], ['It is a book.', 'Nó là một quyển sách.']]],
      ['Nice to meet you.', 'Rất vui được gặp bạn.', [['Nice to meet you too.', 'Tôi cũng rất vui được gặp bạn.'], ['I am eighteen.', 'Tôi mười tám tuổi.'], ['This is my pen.', 'Đây là bút của tôi.']]]
    ]
  },
  {
    key: 'personal-info',
    title: 'Thông tin cá nhân',
    description: 'Tập trả lời tên, tuổi và nơi sống.',
    orderIndex: -39,
    questions: [
      ['Where do you live?', 'Bạn sống ở đâu?', [['I live in Hanoi.', 'Tôi sống ở Hà Nội.'], ['I am fine.', 'Tôi khỏe.'], ['It is on the desk.', 'Nó ở trên bàn.']]],
      ['How old are you?', 'Bạn bao nhiêu tuổi?', [['I am eighteen years old.', 'Tôi mười tám tuổi.'], ['I like coffee.', 'Tôi thích cà phê.'], ['My bag is blue.', 'Cặp của tôi màu xanh.']]],
      ['Are you a student?', 'Bạn có phải học sinh/sinh viên không?', [['Yes, I am a student.', 'Vâng, tôi là học sinh/sinh viên.'], ['I live in Da Nang.', 'Tôi sống ở Đà Nẵng.'], ['This is my classroom.', 'Đây là lớp học của tôi.']]]
    ]
  }
];

const writingLessons = [
  {
    key: 'i-am-sentences',
    title: 'Viết câu với I am',
    description: 'Viết câu giới thiệu bản thân ngắn.',
    orderIndex: -40,
    passageEN: 'My name is Linh. I am a student. I am happy today.',
    passageVI: 'Tên tôi là Linh. Tôi là học sinh. Hôm nay tôi vui.',
    exercises: [
      ['Tên tôi là Linh.', 'My name is Linh.', [['name', 'tên']]],
      ['Tôi là học sinh.', 'I am a student.', [['student', 'học sinh/sinh viên']]],
      ['Hôm nay tôi vui.', 'I am happy today.', [['happy', 'vui']]]
    ]
  },
  {
    key: 'simple-things',
    title: 'Viết câu về đồ vật',
    description: 'Viết câu đơn với This is và My.',
    orderIndex: -39,
    passageEN: 'This is my book. My pen is blue. My bag is on the chair.',
    passageVI: 'Đây là sách của tôi. Bút của tôi màu xanh. Cặp của tôi ở trên ghế.',
    exercises: [
      ['Đây là sách của tôi.', 'This is my book.', [['book', 'sách']]],
      ['Bút của tôi màu xanh.', 'My pen is blue.', [['blue', 'màu xanh']]],
      ['Cặp của tôi ở trên ghế.', 'My bag is on the chair.', [['chair', 'ghế']]]
    ]
  }
];

async function resetLessonChildren(pool, lessonId, tables) {
  for (const table of tables) {
    await pool.query(`DELETE FROM ${table} WHERE LessonId = $1`, [lessonId]);
  }
}

async function seedListening(pool) {
  for (const lesson of listeningLessons) {
    const lessonId = stableId('listening-foundation', lesson.key);
    await pool.query(`
      INSERT INTO ListeningLessons (Id, Title, Description, Level, Topic, Objective, Duration, PassageTitle, AudioUrl, IsFoundation, OrderIndex, UpdatedAt)
      VALUES ($1, $2, $3, 'A0', $4, $5, '5 phút', $2, '', true, $6, NOW())
      ON CONFLICT (Id) DO UPDATE SET
        Title = EXCLUDED.Title,
        Description = EXCLUDED.Description,
        Level = EXCLUDED.Level,
        Topic = EXCLUDED.Topic,
        Objective = EXCLUDED.Objective,
        Duration = EXCLUDED.Duration,
        PassageTitle = EXCLUDED.PassageTitle,
        IsFoundation = true,
        OrderIndex = EXCLUDED.OrderIndex,
        UpdatedAt = NOW()
    `, [lessonId, lesson.title, lesson.description, lesson.topic, lesson.description, lesson.orderIndex]);

    await resetLessonChildren(pool, lessonId, ['ListeningSegments', 'ListeningVocabulary', 'ListeningQuestions']);
    for (const [index, [speaker, text]] of lesson.segments.entries()) {
      await pool.query(`
        INSERT INTO ListeningSegments (Id, LessonId, Speaker, Text, OrderIndex)
        VALUES ($1, $2, $3, $4, $5)
      `, [stableId('listening-segment', `${lesson.key}-${index}`), lessonId, speaker, text, index + 1]);
    }
    for (const [index, [word, meaning]] of lesson.vocab.entries()) {
      await pool.query(`
        INSERT INTO ListeningVocabulary (Id, LessonId, Word, Meaning, OrderIndex)
        VALUES ($1, $2, $3, $4, $5)
      `, [stableId('listening-vocab', `${lesson.key}-${word}`), lessonId, word, meaning, index + 1]);
    }
    for (const [index, question] of lesson.questions.entries()) {
      const [type, prompt, options, answer] = question;
      await pool.query(`
        INSERT INTO ListeningQuestions
          (Id, LessonId, QuestionType, Prompt, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, CorrectBoolean, AcceptedAnswers, Explanation, OrderIndex)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, '', $12)
      `, [
        stableId('listening-question', `${lesson.key}-${index}`),
        lessonId,
        type,
        prompt,
        options[0] || '',
        options[1] || '',
        options[2] || '',
        options[3] || '',
        type === 'true_false' ? '' : answer,
        answer === 'true',
        type === 'fill_blank' ? answer : '',
        index + 1
      ]);
    }
  }
}

async function seedReading(pool) {
  for (const lesson of readingLessons) {
    const lessonId = stableId('reading-foundation', lesson.key);
    await pool.query(`
      INSERT INTO ReadingLessons (Id, Title, Description, Level, Topic, Objective, Duration, PassageTitle, AudioUrl, IsFoundation, OrderIndex, UpdatedAt)
      VALUES ($1, $2, $3, 'A0', $4, $5, '5 phút', $6, '', true, $7, NOW())
      ON CONFLICT (Id) DO UPDATE SET
        Title = EXCLUDED.Title,
        Description = EXCLUDED.Description,
        Level = EXCLUDED.Level,
        Topic = EXCLUDED.Topic,
        Objective = EXCLUDED.Objective,
        Duration = EXCLUDED.Duration,
        PassageTitle = EXCLUDED.PassageTitle,
        IsFoundation = true,
        OrderIndex = EXCLUDED.OrderIndex,
        UpdatedAt = NOW()
    `, [lessonId, lesson.title, lesson.description, lesson.topic, lesson.description, lesson.passageTitle, lesson.orderIndex]);

    await resetLessonChildren(pool, lessonId, ['ReadingParagraphs', 'ReadingVocabulary', 'ReadingQuestions']);
    for (const [index, content] of lesson.paragraphs.entries()) {
      await pool.query(`
        INSERT INTO ReadingParagraphs (Id, LessonId, Content, OrderIndex)
        VALUES ($1, $2, $3, $4)
      `, [stableId('reading-paragraph', `${lesson.key}-${index}`), lessonId, content, index + 1]);
    }
    for (const [index, [word, meaning]] of lesson.vocab.entries()) {
      await pool.query(`
        INSERT INTO ReadingVocabulary (Id, LessonId, Word, Meaning, OrderIndex)
        VALUES ($1, $2, $3, $4, $5)
      `, [stableId('reading-vocab', `${lesson.key}-${word}`), lessonId, word, meaning, index + 1]);
    }
    for (const [index, question] of lesson.questions.entries()) {
      const [type, prompt, options, answer] = question;
      await pool.query(`
        INSERT INTO ReadingQuestions
          (Id, LessonId, QuestionType, Prompt, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, CorrectBoolean, AcceptedAnswers, Explanation, OrderIndex)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, '', $12)
      `, [
        stableId('reading-question', `${lesson.key}-${index}`),
        lessonId,
        type,
        prompt,
        options[0] || '',
        options[1] || '',
        options[2] || '',
        options[3] || '',
        type === 'true_false' ? '' : answer,
        answer === 'true',
        type === 'fill_blank' ? answer : '',
        index + 1
      ]);
    }
  }
}

async function seedSpeaking(pool) {
  await pool.query(`
    ALTER TABLE SpeakingQuestions
    ADD COLUMN IF NOT EXISTS Option1 varchar(500),
    ADD COLUMN IF NOT EXISTS Option2 varchar(500),
    ADD COLUMN IF NOT EXISTS Option3 varchar(500),
    ADD COLUMN IF NOT EXISTS Option1VI varchar(500),
    ADD COLUMN IF NOT EXISTS Option2VI varchar(500),
    ADD COLUMN IF NOT EXISTS Option3VI varchar(500)
  `);

  for (const lesson of speakingLessons) {
    const lessonId = stableId('speaking-foundation', lesson.key);
    await pool.query(`
      INSERT INTO SpeakingLessons (Id, Title, Description, IsFoundation, OrderIndex)
      VALUES ($1, $2, $3, true, $4)
      ON CONFLICT (Id) DO UPDATE SET
        Title = EXCLUDED.Title,
        Description = EXCLUDED.Description,
        IsFoundation = true,
        OrderIndex = EXCLUDED.OrderIndex
    `, [lessonId, lesson.title, lesson.description, lesson.orderIndex]);

    await pool.query(`DELETE FROM SpeakingQuestions WHERE LessonId = $1`, [lessonId]);
    for (const [index, item] of lesson.questions.entries()) {
      const [question, translation, options] = item;
      await pool.query(`
        INSERT INTO SpeakingQuestions
          (Id, LessonId, Question, Translation, Option1, Option1VI, Option2, Option2VI, Option3, Option3VI, OrderIndex)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        stableId('speaking-question', `${lesson.key}-${index}`),
        lessonId,
        question,
        translation,
        options[0]?.[0] || '',
        options[0]?.[1] || '',
        options[1]?.[0] || '',
        options[1]?.[1] || '',
        options[2]?.[0] || '',
        options[2]?.[1] || '',
        index + 1
      ]);
    }
  }
}

async function seedWriting(pool) {
  for (const lesson of writingLessons) {
    const lessonId = stableId('writing-foundation', lesson.key);
    await pool.query(`
      INSERT INTO WritingLessons (Id, Title, Description, PassageEN, PassageVI, IsFoundation, OrderIndex)
      VALUES ($1, $2, $3, $4, $5, true, $6)
      ON CONFLICT (Id) DO UPDATE SET
        Title = EXCLUDED.Title,
        Description = EXCLUDED.Description,
        PassageEN = EXCLUDED.PassageEN,
        PassageVI = EXCLUDED.PassageVI,
        IsFoundation = true,
        OrderIndex = EXCLUDED.OrderIndex
    `, [lessonId, lesson.title, lesson.description, lesson.passageEN, lesson.passageVI, lesson.orderIndex]);

    await pool.query(`DELETE FROM WritingExercises WHERE LessonId = $1`, [lessonId]);
    for (const [index, [contentVI, answerEN, vocab]] of lesson.exercises.entries()) {
      const exerciseId = stableId('writing-exercise', `${lesson.key}-${index}`);
      await pool.query(`
        INSERT INTO WritingExercises (Id, LessonId, ContentVI, CorrectAnswerEN, OrderIndex)
        VALUES ($1, $2, $3, $4, $5)
      `, [exerciseId, lessonId, contentVI, answerEN, index + 1]);
      for (const [vocabIndex, [word, meaning]] of vocab.entries()) {
        await pool.query(`
          INSERT INTO WritingVocab (Id, ExerciseId, Word, Meaning)
          VALUES ($1, $2, $3, $4)
        `, [stableId('writing-vocab', `${lesson.key}-${index}-${vocabIndex}`), exerciseId, word, meaning]);
      }
    }
  }
}

async function seedPlacementTests(pool) {
  await pool.query('DELETE FROM PlacementTests WHERE IsActive = true');
  console.log('Static placement tests removed. Runtime placement now samples real skill lessons.');
}

async function seed() {
  try {
    await connectDB();
    const pool = getPool();
    await ensureOnboardingSchema();
    await seedListening(pool);
    await seedReading(pool);
    await seedSpeaking(pool);
    await seedWriting(pool);
    await seedPlacementTests(pool);
    console.log('Onboarding placement tests and beginner lessons seeded.');
  } catch (err) {
    console.error('Onboarding seed failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

seed();
