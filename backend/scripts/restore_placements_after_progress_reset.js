require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

const DRY_RUN = process.argv.includes('--dry-run');

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

async function getLatestAttemptLevels(pool) {
  if (!await tableExists(pool, 'PlacementAttempts')) return [];
  const result = await pool.query(`
    SELECT DISTINCT ON (UserId)
      UserId,
      ResultLevel,
      Score,
      SubmittedAt
    FROM PlacementAttempts
    WHERE Status = 'completed'
      AND ResultLevel IN ('new', 'basic')
    ORDER BY UserId, SubmittedAt DESC NULLS LAST, StartedAt DESC
  `);
  return result.rows;
}

async function getPlacementSummary(pool) {
  const result = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE Role = 'user')::int AS learners,
      COUNT(*) FILTER (WHERE Role = 'user' AND PlacementLevel = 'new')::int AS new_count,
      COUNT(*) FILTER (WHERE Role = 'user' AND PlacementLevel = 'basic')::int AS basic_count,
      COUNT(*) FILTER (WHERE Role = 'user' AND PlacementSource = 'reset_learning_progress')::int AS reset_source_count
    FROM Users
  `);
  return result.rows[0];
}

async function run() {
  await connectDB();
  const pool = getPool();

  try {
    const before = await getPlacementSummary(pool);
    const attemptLevels = await getLatestAttemptLevels(pool);
    const operations = [];

    if (!DRY_RUN) await pool.query('BEGIN');

    for (const attempt of attemptLevels) {
      operations.push({
        userId: attempt.userid,
        placementLevel: attempt.resultlevel,
        source: 'test',
        score: attempt.score
      });
      if (!DRY_RUN) {
        await pool.query(`
          UPDATE Users
          SET PlacementLevel = $2,
              PlacementSource = 'test',
              PlacementCompletedAt = COALESCE($3, NOW()),
              OnboardingCompleted = true
          WHERE Id = $1
            AND Role = 'user'
        `, [attempt.userid, attempt.resultlevel, attempt.submittedat]);
      }
    }

    const attemptUserIds = attemptLevels.map((attempt) => attempt.userid);
    const fallbackResult = !DRY_RUN
      ? await pool.query(`
          UPDATE Users
          SET PlacementLevel = 'basic',
              PlacementSource = 'restored_default_basic',
              PlacementCompletedAt = NOW(),
              OnboardingCompleted = true
          WHERE Role = 'user'
            AND PlacementSource = 'reset_learning_progress'
            AND NOT (Id = ANY($1::uuid[]))
        `, [attemptUserIds])
      : await pool.query(`
          SELECT COUNT(*)::int AS count
          FROM Users
          WHERE Role = 'user'
            AND PlacementSource = 'reset_learning_progress'
            AND NOT (Id = ANY($1::uuid[]))
        `, [attemptUserIds]);

    operations.push({
      placementLevel: 'basic',
      source: 'restored_default_basic',
      usersWithoutRecoverableAttempt: DRY_RUN ? Number(fallbackResult.rows[0]?.count || 0) : fallbackResult.rowCount
    });

    const after = DRY_RUN ? null : await getPlacementSummary(pool);
    if (!DRY_RUN) await pool.query('COMMIT');

    console.log(JSON.stringify({
      dryRun: DRY_RUN,
      before,
      operations,
      after
    }, null, 2));
  } catch (error) {
    if (!DRY_RUN) await pool.query('ROLLBACK');
    throw error;
  } finally {
    await closeDB();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
