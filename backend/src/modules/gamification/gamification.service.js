// ============================================
// Gamification Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');
const { LEVEL_THRESHOLDS } = require('../../utils/constants');

const gamificationService = {
  async getStats(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query('SELECT UserId, Exp, Level, StreakDays, LastLogin FROM UserStats WHERE UserId = @userId');

    if (result.recordset.length === 0) return null;

    const stats = result.recordset[0];
    const currentLevel = stats.Level;
    const nextLevelExp = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const prevLevelExp = LEVEL_THRESHOLDS[currentLevel - 1] || 0;

    return {
      ...stats,
      expToNextLevel: nextLevelExp - stats.Exp,
      levelProgress: Math.round(((stats.Exp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100)
    };
  },

  async addExp(userId, amount) {
    const pool = getPool();

    // Calculate new level
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('exp', sql.Int, amount)
      .query(`
        UPDATE UserStats
        SET Exp = Exp + @exp,
            Level = CASE
              WHEN Exp + @exp >= 10000 THEN 10
              WHEN Exp + @exp >= 7500 THEN 9
              WHEN Exp + @exp >= 5500 THEN 8
              WHEN Exp + @exp >= 4000 THEN 7
              WHEN Exp + @exp >= 2800 THEN 6
              WHEN Exp + @exp >= 1800 THEN 5
              WHEN Exp + @exp >= 1000 THEN 4
              WHEN Exp + @exp >= 500 THEN 3
              WHEN Exp + @exp >= 250 THEN 2
              WHEN Exp + @exp >= 100 THEN 1
              ELSE Level
            END
        OUTPUT INSERTED.Exp, INSERTED.Level, INSERTED.StreakDays
        WHERE UserId = @userId
      `);

    return result.recordset[0];
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
  }
};

module.exports = gamificationService;
