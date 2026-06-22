require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { connectDB, getPool, closeDB } = require('../src/config/database');

const decks = [
  {
    name: 'Daily Conversations A1-A2',
    description: 'Từ vựng giao tiếp hằng ngày cho chào hỏi, lịch trình và tình huống quen thuộc.',
    words: [
      ['greeting', 'lời chào', 'A friendly greeting can start a good conversation.'],
      ['appointment', 'cuộc hẹn', 'I have a doctor appointment at three oclock.'],
      ['schedule', 'lịch trình', 'My schedule is full this morning.'],
      ['nearby', 'ở gần đây', 'Is there a pharmacy nearby?'],
      ['available', 'có sẵn, rảnh', 'Are you available after lunch?'],
      ['prefer', 'thích hơn', 'I prefer tea to coffee.'],
      ['usually', 'thường xuyên', 'I usually wake up at six thirty.'],
      ['borrow', 'mượn', 'Can I borrow your pen for a minute?'],
      ['receipt', 'hóa đơn', 'Please keep the receipt.'],
      ['crowded', 'đông đúc', 'The bus is crowded today.'],
      ['polite', 'lịch sự', 'It is polite to say thank you.'],
      ['remind', 'nhắc nhở', 'Please remind me to call Anna.']
    ]
  },
  {
    name: 'Travel & Services A2-B1',
    description: 'Từ vựng dùng khi đi du lịch, đặt dịch vụ, hỏi đường và xử lý sự cố đơn giản.',
    words: [
      ['reservation', 'sự đặt chỗ', 'We have a reservation for two nights.'],
      ['luggage', 'hành lý', 'My luggage is near the taxi.'],
      ['boarding pass', 'thẻ lên máy bay', 'Please show your boarding pass at the gate.'],
      ['delay', 'sự chậm trễ, trì hoãn', 'The flight has a short delay.'],
      ['cancel', 'hủy', 'I need to cancel my booking.'],
      ['entrance fee', 'phí vào cửa', 'The entrance fee is five dollars.'],
      ['itinerary', 'lịch trình chuyến đi', 'Our itinerary includes three cities.'],
      ['directions', 'chỉ dẫn đường đi', 'Can you give me directions to the station?'],
      ['exchange', 'đổi, trao đổi', 'Where can I exchange money?'],
      ['recommend', 'giới thiệu, đề xuất', 'Can you recommend a local restaurant?'],
      ['single room', 'phòng đơn', 'I booked a single room for tonight.'],
      ['customer service', 'dịch vụ khách hàng', 'Customer service helped me change the ticket.']
    ]
  },
  {
    name: 'Work & Study B1',
    description: 'Từ vựng học tập và công việc: deadline, họp nhóm, phản hồi và tiến độ.',
    words: [
      ['deadline', 'hạn chót', 'The deadline for the report is Friday.'],
      ['assignment', 'bài tập được giao', 'The teacher gave us a writing assignment.'],
      ['attend', 'tham dự', 'I will attend the meeting online.'],
      ['submit', 'nộp', 'Please submit your homework before midnight.'],
      ['colleague', 'đồng nghiệp', 'My colleague helped me prepare the slides.'],
      ['presentation', 'bài thuyết trình', 'Her presentation was clear and confident.'],
      ['research', 'nghiên cứu', 'We need more research before making a decision.'],
      ['feedback', 'phản hồi', 'The manager gave useful feedback.'],
      ['priority', 'việc ưu tiên', 'Improving speaking is my priority this month.'],
      ['requirement', 'yêu cầu', 'The course has a final project requirement.'],
      ['progress', 'tiến độ', 'I can see progress after two weeks.'],
      ['improve', 'cải thiện', 'Practice helps you improve your pronunciation.']
    ]
  },
  {
    name: 'IELTS Topic Vocabulary B1-B2',
    description: 'Từ vựng nền cho các chủ đề IELTS phổ biến như môi trường, xã hội và giáo dục.',
    words: [
      ['sustainable', 'bền vững', 'Cities need sustainable transport systems.'],
      ['emissions', 'khí thải', 'Car emissions can harm air quality.'],
      ['conserve', 'bảo tồn, tiết kiệm', 'We should conserve water during dry seasons.'],
      ['impact', 'tác động', 'Technology has a major impact on education.'],
      ['evidence', 'bằng chứng', 'The report provides clear evidence.'],
      ['policy', 'chính sách', 'The new policy supports online learning.'],
      ['shortage', 'sự thiếu hụt', 'Some areas have a shortage of clean water.'],
      ['significant', 'đáng kể, quan trọng', 'There was a significant increase in sales.'],
      ['reliable', 'đáng tin cậy', 'Students need reliable information sources.'],
      ['challenge', 'thách thức', 'Time management is a common challenge.'],
      ['factor', 'yếu tố', 'Cost is an important factor for many families.'],
      ['solution', 'giải pháp', 'Public transport can be part of the solution.']
    ]
  }
];

async function findCreator(pool) {
  const result = await pool.query(`
    SELECT Id, Username, Email, Role
    FROM Users
    ORDER BY
      CASE WHEN Role = 'admin' THEN 0 ELSE 1 END,
      CreatedAt ASC
    LIMIT 1
  `);

  return result.rows[0] || null;
}

async function upsertDeck(pool, creator, deck) {
  const existing = await pool.query(`
    SELECT Id
    FROM UserCollections
    WHERE IsPublic = true AND lower(Name) = lower($1)
    ORDER BY CreatedAt ASC
    LIMIT 1
  `, [deck.name]);

  if (existing.rows[0]) {
    const id = existing.rows[0].id;
    await pool.query(`
      UPDATE UserCollections
      SET Description = $2,
          IsPublic = true,
          ReviewStatus = 'approved',
          ReviewedAt = COALESCE(ReviewedAt, NOW()),
          ReviewedBy = COALESCE(ReviewedBy, $3),
          UpdatedAt = NOW()
      WHERE Id = $1
    `, [id, deck.description, creator.role === 'admin' ? creator.id : null]);
    return id;
  }

  const inserted = await pool.query(`
    INSERT INTO UserCollections
      (UserId, Name, Description, IsPublic, ReviewStatus, SubmittedAt, ReviewedAt, ReviewedBy, UpdatedAt)
    VALUES
      ($1, $2, $3, true, 'approved', NOW(), NOW(), $4, NOW())
    RETURNING Id
  `, [
    creator.id,
    deck.name,
    deck.description,
    creator.role === 'admin' ? creator.id : null
  ]);

  return inserted.rows[0].id;
}

async function upsertWord(pool, collectionId, word) {
  const [customWord, customMeaning, customExample] = word;
  const existing = await pool.query(`
    SELECT Id
    FROM UserCollectionWords
    WHERE CollectionId = $1 AND lower(CustomWord) = lower($2)
    LIMIT 1
  `, [collectionId, customWord]);

  if (existing.rows[0]) {
    await pool.query(`
      UPDATE UserCollectionWords
      SET CustomMeaning = $2,
          CustomExample = $3,
          UpdatedAt = NOW()
      WHERE Id = $1
    `, [existing.rows[0].id, customMeaning, customExample]);
    return 'updated';
  }

  await pool.query(`
    INSERT INTO UserCollectionWords
      (CollectionId, CustomWord, CustomMeaning, CustomExample, UpdatedAt)
    VALUES
      ($1, $2, $3, $4, NOW())
  `, [collectionId, customWord, customMeaning, customExample]);
  return 'inserted';
}

async function seedVocabulary() {
  await connectDB();
  const pool = getPool();

  await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

  const creator = await findCreator(pool);
  if (!creator) {
    throw new Error('No user found. Create at least one user/admin before seeding vocabulary.');
  }

  let insertedWords = 0;
  let updatedWords = 0;

  for (const deck of decks) {
    const collectionId = await upsertDeck(pool, creator, deck);

    for (const word of deck.words) {
      const action = await upsertWord(pool, collectionId, word);
      if (action === 'inserted') insertedWords += 1;
      if (action === 'updated') updatedWords += 1;
    }

    await pool.query('UPDATE UserCollections SET UpdatedAt = NOW() WHERE Id = $1', [collectionId]);
  }

  console.log(`Seeded ${decks.length} public vocabulary decks for ${creator.username || creator.email}.`);
  console.log(`Words inserted: ${insertedWords}. Words updated: ${updatedWords}.`);
}

seedVocabulary()
  .catch((error) => {
    console.error('Vocabulary seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDB();
  });
