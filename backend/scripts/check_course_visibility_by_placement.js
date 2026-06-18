require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');
const receptiveService = require('../src/modules/receptive/receptive.service');

const skillQueries = {
  speaking: `
    SELECT Id, Title, COALESCE(IsFoundation, false) AS isfoundation
    FROM SpeakingLessons
    ORDER BY COALESCE(IsFoundation, false) DESC, OrderIndex ASC
  `,
  writing: `
    SELECT Id, Title, COALESCE(IsFoundation, false) AS isfoundation
    FROM WritingLessons
    ORDER BY COALESCE(IsFoundation, false) DESC, OrderIndex ASC
  `
};

function splitCounts(rows) {
  return rows.reduce((acc, row) => {
    if (row.isFoundation || row.isfoundation) acc.foundation += 1;
    else acc.main += 1;
    return acc;
  }, { foundation: 0, main: 0 });
}

async function getUser(pool, level) {
  const result = await pool.query(`
    SELECT Id, Username, PlacementLevel
    FROM Users
    WHERE Role = 'user' AND PlacementLevel = $1
    ORDER BY CreatedAt ASC
    LIMIT 1
  `, [level]);
  return result.rows[0] || null;
}

async function getSpeakingOrWriting(pool, skill, userId) {
  const placement = await pool.query('SELECT PlacementLevel FROM Users WHERE Id = $1', [userId]);
  const placementLevel = placement.rows[0]?.placementlevel || 'basic';
  const result = await pool.query(skillQueries[skill]);
  return placementLevel === 'basic'
    ? result.rows.filter((row) => !row.isfoundation)
    : result.rows;
}

async function inspectForUser(pool, user) {
  if (!user) return null;
  const [listening, reading, speaking, writing] = await Promise.all([
    receptiveService.getLessons('listening', user.id),
    receptiveService.getLessons('reading', user.id),
    getSpeakingOrWriting(pool, 'speaking', user.id),
    getSpeakingOrWriting(pool, 'writing', user.id)
  ]);

  return {
    username: user.username,
    placementLevel: user.placementlevel,
    listening: splitCounts(listening),
    reading: splitCounts(reading),
    speaking: splitCounts(speaking),
    writing: splitCounts(writing)
  };
}

async function run() {
  await connectDB();
  const pool = getPool();

  try {
    const basicUser = await getUser(pool, 'basic');
    const newUser = await getUser(pool, 'new');
    const [basic, beginner] = await Promise.all([
      inspectForUser(pool, basicUser),
      inspectForUser(pool, newUser)
    ]);
    console.log(JSON.stringify({ basic, new: beginner }, null, 2));
  } finally {
    await closeDB();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
