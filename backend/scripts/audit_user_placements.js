require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

async function tableExists(pool, tableName) {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public' AND lower(table_name) = lower($1)
    ) AS exists
  `, [tableName]);
  return Boolean(result.rows[0]?.exists);
}

async function run() {
  await connectDB();
  const pool = getPool();

  try {
    const users = await pool.query(`
      SELECT
        u.Id,
        u.Username,
        u.Email,
        u.Role,
        u.OnboardingCompleted,
        u.PlacementLevel,
        u.PlacementSource,
        u.PlacementCompletedAt,
        u.CreatedAt
      FROM Users u
      WHERE u.Role = 'user'
      ORDER BY u.CreatedAt ASC
    `);

    let attemptsByUser = new Map();
    if (await tableExists(pool, 'PlacementAttempts')) {
      const attempts = await pool.query(`
        SELECT DISTINCT ON (UserId)
          UserId,
          Status,
          Score,
          ResultLevel,
          StartedAt,
          SubmittedAt
        FROM PlacementAttempts
        WHERE Status = 'completed'
        ORDER BY UserId, SubmittedAt DESC NULLS LAST, StartedAt DESC
      `);
      attemptsByUser = new Map(attempts.rows.map((row) => [String(row.userid), row]));
    }

    const rows = users.rows.map((user) => {
      const attempt = attemptsByUser.get(String(user.id));
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        placementLevel: user.placementlevel,
        placementSource: user.placementsource,
        onboardingCompleted: user.onboardingcompleted,
        createdAt: user.createdat,
        latestAttempt: attempt ? {
          status: attempt.status,
          score: attempt.score,
          resultLevel: attempt.resultlevel,
          startedAt: attempt.startedat,
          submittedAt: attempt.submittedat
        } : null
      };
    });

    const summary = rows.reduce((acc, row) => {
      const key = row.placementLevel || 'null';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    console.log(JSON.stringify({ summary, users: rows }, null, 2));
  } finally {
    await closeDB();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
