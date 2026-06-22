require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

const BANK = [
  ['A cat and a dog', 'Một con mèo và một con chó'],
  ['I drink water every day', 'Tôi uống nước mỗi ngày'],
  ['She goes to school by bus', 'Cô ấy đi học bằng xe buýt'],
  ['We are making weekend plans', 'Chúng tôi đang lên kế hoạch cuối tuần'],
  ['Please speak slowly', 'Vui lòng nói chậm lại'],
  ['I would like some orange juice', 'Tôi muốn một ít nước cam'],
  ['The weather is nice today', 'Thời tiết hôm nay đẹp'],
  ['Can you help me with this', 'Bạn có thể giúp tôi việc này không'],
  ['I usually have breakfast at seven', 'Tôi thường ăn sáng lúc bảy giờ'],
  ['This lesson is a little difficult', 'Bài học này hơi khó'],
  ['Could you repeat the question', 'Bạn có thể lặp lại câu hỏi không'],
  ['I am practicing English pronunciation', 'Tôi đang luyện phát âm tiếng Anh']
];

function pickQuestions(levelNumber) {
  const start = ((Number(levelNumber) || 1) - 1) * 2;
  return [
    BANK[start % BANK.length],
    BANK[(start + 1) % BANK.length]
  ];
}

async function getSpeakingCount(pool, levelId) {
  const result = await pool.query(`
    SELECT COUNT(*)::int AS count
    FROM MiniGameQuestions
    WHERE LevelId = $1 AND QuestionType = 'speakrepeat'
  `, [levelId]);
  return result.rows[0]?.count || 0;
}

async function questionExists(pool, levelId, contentEN) {
  const result = await pool.query(`
    SELECT 1
    FROM MiniGameQuestions
    WHERE LevelId = $1
      AND QuestionType = 'speakrepeat'
      AND lower(ContentEN) = lower($2)
    LIMIT 1
  `, [levelId, contentEN]);
  return result.rows.length > 0;
}

async function nextOrderIndex(pool, levelId) {
  const result = await pool.query(`
    SELECT COALESCE(MAX(OrderIndex), -1) + 1 AS next_index
    FROM MiniGameQuestions
    WHERE LevelId = $1
  `, [levelId]);
  return Number(result.rows[0]?.next_index || 0);
}

async function run() {
  await connectDB();
  const pool = getPool();

  const levels = await pool.query(`
    SELECT Id, LevelNumber, Name, TimeLimit
    FROM GameLevels
    ORDER BY LevelNumber ASC
  `);

  const inserted = [];
  for (const level of levels.rows) {
    let speakingCount = await getSpeakingCount(pool, level.id);
    let orderIndex = await nextOrderIndex(pool, level.id);

    for (const [contentEN, contentVI] of pickQuestions(level.levelnumber)) {
      if (speakingCount >= 2) break;
      if (await questionExists(pool, level.id, contentEN)) continue;

      await pool.query(`
        INSERT INTO MiniGameQuestions (
          Id, LevelId, QuestionType, ContentEN, ContentVI, AudioUrl, CorrectAnswer, Options, OrderIndex
        )
        VALUES (gen_random_uuid(), $1, 'speakrepeat', $2, $3, NULL, $2, $4, $5)
      `, [
        level.id,
        contentEN,
        contentVI,
        JSON.stringify({ passScore: 70 }),
        orderIndex
      ]);

      inserted.push({
        levelNumber: level.levelnumber,
        levelName: level.name,
        contentEN
      });
      speakingCount += 1;
      orderIndex += 1;
    }

    await pool.query(`
      UPDATE GameLevels
      SET TimeLimit = GREATEST(TimeLimit, 120)
      WHERE Id = $1
    `, [level.id]);
  }

  console.log(JSON.stringify({
    insertedSpeakingMiniGameQuestions: inserted.length,
    inserted
  }, null, 2));
}

run()
  .catch((error) => {
    console.error('Insert mini game speaking questions failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDB();
  });
