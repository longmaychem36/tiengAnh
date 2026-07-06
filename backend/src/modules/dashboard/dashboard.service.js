const { getPool } = require('../../config/database');
const gamificationService = require('../gamification/gamification.service');
const studyTimeService = require('../study-time/study-time.service');
const { ensureSoftDeleteSchema } = require('../soft-delete/soft-delete.schema');

const MONTH_COUNT = 12;
const LEADERBOARD_LIMIT = 10;

function isOptionalSchemaError(err) {
  return err?.code === '42P01' || err?.code === '42703' || /does not exist/i.test(err?.message || '');
}

async function safeQuery(pool, query, params = []) {
  try {
    return await pool.query(query, params);
  } catch (err) {
    if (isOptionalSchemaError(err)) return { rows: [] };
    throw err;
  }
}

function monthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function buildMonthBuckets() {
  const now = new Date();
  const buckets = [];

  for (let offset = MONTH_COUNT - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    buckets.push({
      monthKey: monthKey(date),
      label: `T${date.getMonth() + 1}/${String(date.getFullYear()).slice(-2)}`,
      seconds: 0,
      minutes: 0,
      hours: 0,
      activeDays: 0
    });
  }

  return buckets;
}

function startOfVisibleRange() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - (MONTH_COUNT - 1), 1);
}

function toHours(seconds) {
  return Math.round((Number(seconds || 0) / 3600) * 10) / 10;
}

function toMinutes(seconds) {
  return Math.round(Number(seconds || 0) / 60);
}

function rankRows(rows) {
  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

const dashboardService = {
  async getOverview(userId) {
    const pool = getPool();
    await studyTimeService.ensureTable();
    await ensureSoftDeleteSchema();

    const stats = await gamificationService.getStats(userId);
    const monthBuckets = buildMonthBuckets();
    const bucketMap = new Map(monthBuckets.map((bucket) => [bucket.monthKey, bucket]));
    const startDate = startOfVisibleRange();

    const monthlyResult = await safeQuery(pool, `
      SELECT
        to_char(date_trunc('month', ActivityDate), 'YYYY-MM') AS "monthKey",
        COALESCE(SUM(ActiveSeconds), 0)::int AS "seconds",
        COUNT(*)::int AS "activeDays"
      FROM StudyTimeDaily
      WHERE UserId = $1
        AND ActivityDate >= $2
      GROUP BY 1
    `, [userId, startDate]);

    monthlyResult.rows.forEach((row) => {
      const key = row.monthKey || row.monthkey;
      const bucket = bucketMap.get(key);
      if (!bucket) return;

      bucket.seconds = Number(row.seconds || 0);
      bucket.minutes = toMinutes(bucket.seconds);
      bucket.hours = toHours(bucket.seconds);
      bucket.activeDays = Number(row.activeDays || row.activedays || 0);
    });

    const currentMonth = monthBuckets[monthBuckets.length - 1] || {
      seconds: 0,
      minutes: 0,
      hours: 0,
      activeDays: 0
    };

    const monthlyLeaderboardResult = await safeQuery(pool, `
      SELECT
        u.Id AS "userId",
        u.Username AS "username",
        u.AvatarUrl AS "avatarUrl",
        COALESCE(us.Level, 1)::int AS "level",
        COALESCE(us.Exp, 0)::int AS "exp",
        COALESCE(us.StreakDays, 0)::int AS "streakDays",
        COALESCE(SUM(std.ActiveSeconds), 0)::int AS "seconds",
        COUNT(std.ActivityDate)::int AS "activeDays"
      FROM StudyTimeDaily std
      INNER JOIN Users u ON u.Id = std.UserId
      LEFT JOIN UserStats us ON us.UserId = u.Id
      WHERE u.Role = 'user'
        AND COALESCE(u.IsDeleted, false) = false
        AND std.ActivityDate >= date_trunc('month', NOW())::date
      GROUP BY u.Id, u.Username, u.AvatarUrl, us.Level, us.Exp, us.StreakDays
      ORDER BY COALESCE(SUM(std.ActiveSeconds), 0) DESC,
               COUNT(std.ActivityDate) DESC,
               COALESCE(us.Level, 1) DESC,
               COALESCE(us.Exp, 0) DESC
      LIMIT $1
    `, [LEADERBOARD_LIMIT]);

    const monthlyLeaderboard = rankRows(monthlyLeaderboardResult.rows.map((row) => {
      const seconds = Number(row.seconds || 0);
      return {
        userId: String(row.userId || row.userid),
        username: row.username || row.Username || 'User',
        avatarUrl: row.avatarUrl || row.avatarurl || null,
        level: Number(row.level || 1),
        exp: Number(row.exp || 0),
        streakDays: Number(row.streakDays || row.streakdays || 0),
        seconds,
        minutes: toMinutes(seconds),
        hours: toHours(seconds),
        activeDays: Number(row.activeDays || row.activedays || 0)
      };
    }));

    const levelResult = await safeQuery(pool, `
      SELECT
        u.Id AS "userId",
        u.Username AS "username",
        u.AvatarUrl AS "avatarUrl",
        COALESCE(us.Level, 1)::int AS "level",
        COALESCE(us.Exp, 0)::int AS "exp",
        COALESCE(us.StreakDays, 0)::int AS "streakDays"
      FROM Users u
      LEFT JOIN UserStats us ON us.UserId = u.Id
      WHERE u.Role = 'user'
        AND COALESCE(u.IsDeleted, false) = false
      ORDER BY COALESCE(us.Level, 1) DESC, COALESCE(us.Exp, 0) DESC, COALESCE(us.StreakDays, 0) DESC, u.Username ASC
      LIMIT $1
    `, [LEADERBOARD_LIMIT]);

    const levelLeaderboard = rankRows(levelResult.rows.map((row) => ({
      userId: String(row.userId || row.userid),
      username: row.username || row.Username || 'User',
      avatarUrl: row.avatarUrl || row.avatarurl || null,
      level: Number(row.level || 1),
      exp: Number(row.exp || 0),
      streakDays: Number(row.streakDays || row.streakdays || 0)
    })));

    const totalSecondsLast12Months = monthBuckets.reduce((sum, bucket) => sum + bucket.seconds, 0);

    return {
      stats,
      study: {
        periodLabel: currentMonth.label,
        currentMonthSeconds: currentMonth.seconds,
        currentMonthMinutes: currentMonth.minutes,
        currentMonthHours: currentMonth.hours,
        currentMonthActiveDays: currentMonth.activeDays,
        totalSecondsLast12Months,
        totalMinutesLast12Months: toMinutes(totalSecondsLast12Months),
        totalHoursLast12Months: toHours(totalSecondsLast12Months),
        months: monthBuckets
      },
      leaderboards: {
        monthly: monthlyLeaderboard,
        level: levelLeaderboard
      }
    };
  }
};

module.exports = dashboardService;
