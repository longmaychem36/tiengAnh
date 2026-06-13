require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { connectDB, getPool, closeDB } = require('../src/config/database');
const { LEVEL_THRESHOLDS, MAX_LEVEL } = require('../src/utils/constants');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function demoLevelForIndex(index) {
  return clamp(MAX_LEVEL - index, 1, MAX_LEVEL);
}

function demoExpForLevel(level, index, userCount) {
  const current = LEVEL_THRESHOLDS[level] || 0;
  const next = LEVEL_THRESHOLDS[level + 1] || (current + 1200);
  const room = Math.max(0, next - current - 1);
  const bonus = Math.min(room, 35 + ((userCount - index) * 17));
  return current + bonus;
}

function demoSecondsForDay(userIndex, userCount, dayIndex, monthOffset) {
  const rankWeight = userCount - userIndex;
  const baseMinutes = 12 + (rankWeight * 7) + (monthOffset === 0 ? rankWeight * 3 : 0);
  const wave = ((dayIndex + 1) * (userIndex + 3) + monthOffset * 5) % 18;
  return (baseMinutes + wave) * 60;
}

function shouldSeedDay(userIndex, userCount, dayIndex, monthOffset) {
  const rankWeight = userCount - userIndex;
  const activeEvery = clamp(7 - Math.ceil(rankWeight / 2), 2, 6);
  return ((dayIndex + userIndex + monthOffset) % activeEvery) !== 0;
}

function datesForLastMonths(monthCount = 12) {
  const now = new Date();
  const result = [];

  for (let monthOffset = 0; monthOffset < monthCount; monthOffset += 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const daysInMonth = monthOffset === 0
      ? now.getDate()
      : new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

    const step = monthOffset === 0 ? 1 : 3;
    for (let day = 1; day <= daysInMonth; day += step) {
      result.push({
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
        monthOffset,
        dayIndex: day - 1
      });
    }
  }

  return result;
}

async function ensureStudyTimeTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS StudyTimeDaily (
      UserId uuid NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      ActivityDate date NOT NULL DEFAULT CURRENT_DATE,
      ActiveSeconds integer NOT NULL DEFAULT 0,
      UpdatedAt timestamp NOT NULL DEFAULT NOW(),
      PRIMARY KEY (UserId, ActivityDate)
    )
  `);
}

async function run() {
  await connectDB();
  const pool = getPool();

  try {
    await ensureStudyTimeTable(pool);

    const usersResult = await pool.query(`
      SELECT Id AS "id", Username AS "username"
      FROM Users
      WHERE Role = 'user'
      ORDER BY CreatedAt ASC, Username ASC
    `);
    const users = usersResult.rows;

    if (users.length === 0) {
      console.log('No learner users found. Nothing to seed.');
      return;
    }

    const dates = datesForLastMonths(12);
    let studyRows = 0;

    for (let index = 0; index < users.length; index += 1) {
      const user = users[index];
      const userId = user.id;
      const level = demoLevelForIndex(index);
      const exp = demoExpForLevel(level, index, users.length);
      const streakDays = clamp((users.length - index) * 2 + 3, 1, 45);

      await pool.query(`
        INSERT INTO UserStats (UserId, Exp, Level, StreakDays, LastLogin)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (UserId)
        DO UPDATE SET
          Exp = GREATEST(UserStats.Exp, EXCLUDED.Exp),
          Level = GREATEST(UserStats.Level, EXCLUDED.Level),
          StreakDays = GREATEST(UserStats.StreakDays, EXCLUDED.StreakDays),
          LastLogin = COALESCE(UserStats.LastLogin, EXCLUDED.LastLogin)
      `, [userId, exp, level, streakDays]);

      for (const item of dates) {
        if (!shouldSeedDay(index, users.length, item.dayIndex, item.monthOffset)) continue;

        const seconds = demoSecondsForDay(index, users.length, item.dayIndex, item.monthOffset);
        await pool.query(`
          INSERT INTO StudyTimeDaily (UserId, ActivityDate, ActiveSeconds, UpdatedAt)
          VALUES ($1, $2::date, $3, NOW())
          ON CONFLICT (UserId, ActivityDate)
          DO UPDATE SET
            ActiveSeconds = GREATEST(StudyTimeDaily.ActiveSeconds, EXCLUDED.ActiveSeconds),
            UpdatedAt = NOW()
        `, [userId, formatDate(item.date), seconds]);
        studyRows += 1;
      }
    }

    console.log(`Seeded leaderboard demo data for ${users.length} learner user(s).`);
    console.log(`Upserted ${studyRows} StudyTimeDaily row(s).`);
    console.log('Monthly and total level leaderboards should now have demo rankings.');
  } finally {
    await closeDB();
  }
}

run().catch((error) => {
  console.error('Failed to seed leaderboard demo data:', error.message);
  process.exitCode = 1;
});
