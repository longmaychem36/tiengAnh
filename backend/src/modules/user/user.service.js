// ============================================
// User Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');
const { parsePagination } = require('../../utils/pagination');

const userService = {
  async getAll(page, limit) {
    const pool = getPool();
    const { offset } = parsePagination({ page, limit });

    const countResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM Users');
    const total = countResult.recordset[0].total;

    const result = await pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit))
      .query(`
        SELECT u.Id, u.Username, u.Email, u.Role, u.CreatedAt,
               ll.Code as LevelCode, ll.Name as LevelName
        FROM Users u
        LEFT JOIN LearningLevels ll ON u.LevelId = ll.Id
        ORDER BY u.CreatedAt DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);

    return { users: result.recordset, total };
  },

  async getById(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT u.Id, u.Username, u.Email, u.Role, u.LevelId, u.CreatedAt,
               ll.Code as LevelCode, ll.Name as LevelName
        FROM Users u
        LEFT JOIN LearningLevels ll ON u.LevelId = ll.Id
        WHERE u.Id = @userId
      `);
    return result.recordset[0] || null;
  },

  async update(userId, data) {
    const pool = getPool();
    const { username, levelId } = data;

    // Check duplicate username
    if (username) {
      const existing = await pool.request()
        .input('username', sql.NVarChar, username)
        .input('userId', sql.UniqueIdentifier, userId)
        .query('SELECT Id FROM Users WHERE Username = @username AND Id != @userId');
      if (existing.recordset.length > 0) {
        return { error: 'Username already taken.' };
      }
    }

    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('username', sql.NVarChar, username || null)
      .input('levelId', sql.Int, levelId || null)
      .query(`
        UPDATE Users
        SET Username = COALESCE(@username, Username),
            LevelId = COALESCE(@levelId, LevelId)
        OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.Email, INSERTED.Role, INSERTED.LevelId
        WHERE Id = @userId
      `);

    return result.recordset[0] || null;
  },

  async getStats(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT us.UserId, us.Exp, us.Level, us.StreakDays, us.LastLogin,
               (SELECT COUNT(*) FROM UserProgress WHERE UserId = @userId AND Status = 'completed') as CompletedLessons,
               (SELECT COUNT(*) FROM UserVocabulary WHERE UserId = @userId AND Status = 'mastered') as MasteredWords,
               (SELECT COUNT(*) FROM UserGameSession WHERE UserId = @userId) as GamesPlayed,
               (SELECT COUNT(*) FROM UserAchievements WHERE UserId = @userId) as AchievementsUnlocked
        FROM UserStats us
        WHERE us.UserId = @userId
      `);
    return result.recordset[0] || null;
  }
};

module.exports = userService;
