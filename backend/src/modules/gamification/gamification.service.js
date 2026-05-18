// ============================================
// Gamification Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');
const { LEVEL_THRESHOLDS, MAX_LEVEL } = require('../../utils/constants');

function getLevelForExp(exp = 0) {
  const safeExp = Math.max(0, Number.parseInt(exp, 10) || 0);
  let level = 1;

  for (let currentLevel = 1; currentLevel <= MAX_LEVEL; currentLevel += 1) {
    if (safeExp >= LEVEL_THRESHOLDS[currentLevel]) {
      level = currentLevel;
    }
  }

  return level;
}

function getLevelMeta(exp = 0, level = getLevelForExp(exp)) {
  const safeExp = Math.max(0, Number.parseInt(exp, 10) || 0);
  const safeLevel = Math.min(Math.max(Number.parseInt(level, 10) || 1, 1), MAX_LEVEL);
  const currentLevelExp = LEVEL_THRESHOLDS[safeLevel] || 0;
  const nextLevelExp = safeLevel >= MAX_LEVEL
    ? currentLevelExp
    : LEVEL_THRESHOLDS[safeLevel + 1];
  const requiredExp = Math.max(0, nextLevelExp - currentLevelExp);
  const earnedInLevel = Math.max(0, safeExp - currentLevelExp);
  const levelProgress = safeLevel >= MAX_LEVEL
    ? 100
    : Math.max(0, Math.min(100, Math.round((earnedInLevel / requiredExp) * 100)));

  return {
    level: safeLevel,
    currentLevelExp,
    nextLevelExp,
    requiredLevelExp: requiredExp,
    currentLevelEarnedExp: safeLevel >= MAX_LEVEL ? 0 : earnedInLevel,
    expToNextLevel: safeLevel >= MAX_LEVEL ? 0 : Math.max(0, nextLevelExp - safeExp),
    levelProgress
  };
}

function shapeStats(stats) {
  if (!stats) return null;

  const exp = Number.parseInt(stats.Exp ?? stats.exp, 10) || 0;
  const computedLevel = getLevelForExp(exp);
  const level = computedLevel;
  const meta = getLevelMeta(exp, level);

  return {
    ...stats,
    Exp: exp,
    Level: level,
    expToNextLevel: meta.expToNextLevel,
    levelProgress: meta.levelProgress,
    currentLevelExp: meta.currentLevelEarnedExp,
    requiredLevelExp: meta.requiredLevelExp,
    nextLevelExp: meta.nextLevelExp,
    maxLevel: MAX_LEVEL
  };
}

const gamificationService = {
  async getStats(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query('SELECT UserId, Exp, Level, StreakDays, LastLogin FROM UserStats WHERE UserId = @userId');

    if (result.recordset.length === 0) return null;

    return shapeStats(result.recordset[0]);
  },

  async ensureUserStats(userId) {
    const pool = getPool();
    await pool.query(`
      INSERT INTO UserStats (UserId, Exp, Level, StreakDays)
      VALUES ($1, 0, 1, 0)
      ON CONFLICT (UserId) DO NOTHING
    `, [userId]);
  },

  async addExp(userId, amount, reason = 'learning_activity') {
    const pool = getPool();
    const safeAmount = Math.max(0, Math.round(Number(amount) || 0));
    if (safeAmount <= 0) {
      const currentStats = await this.getStats(userId);
      return {
        amount: 0,
        reason,
        previous: currentStats,
        current: currentStats,
        leveledUp: false,
        levelsGained: 0
      };
    }

    await this.ensureUserStats(userId);

    const beforeResult = await pool.query(
      'SELECT UserId, Exp, Level, StreakDays, LastLogin FROM UserStats WHERE UserId = $1',
      [userId]
    );
    const before = shapeStats(beforeResult.rows[0]);
    const nextExp = before.Exp + safeAmount;
    const nextLevel = getLevelForExp(nextExp);

    const result = await pool.query(`
      UPDATE UserStats
      SET Exp = $2,
          Level = $3
      WHERE UserId = $1
      RETURNING UserId, Exp, Level, StreakDays, LastLogin
    `, [userId, nextExp, nextLevel]);

    const current = shapeStats(result.rows[0]);
    const levelsGained = Math.max(0, current.Level - before.Level);

    return {
      amount: safeAmount,
      reason,
      previous: before,
      current,
      leveledUp: levelsGained > 0,
      levelsGained
    };
  },

  async getAllAchievements() {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT Id, Name, Description, Condition FROM Achievements');
    return result.recordset;
  },

  async getUserAchievements(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT a.Id, a.Name, a.Description, a.Condition, ua.UnlockedAt
        FROM UserAchievements ua
        INNER JOIN Achievements a ON ua.AchievementId = a.Id
        WHERE ua.UserId = @userId
        ORDER BY ua.UnlockedAt DESC
      `);
    return result.recordset;
  },
  getLevelForExp,
  getLevelMeta,
  shapeStats
};

module.exports = gamificationService;
