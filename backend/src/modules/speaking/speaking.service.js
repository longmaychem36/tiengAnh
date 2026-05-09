// ============================================
// Speaking Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');

const speakingService = {
  async saveRecording(userId, lessonId, audioUrl) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .input('audioUrl', sql.NVarChar, audioUrl)
      .query(`
        INSERT INTO SpeakingRecords (UserId, LessonId, AudioUrl)
        OUTPUT INSERTED.*
        VALUES (@userId, @lessonId, @audioUrl)
      `);
    return result.recordset[0];
  },

  async getRecords(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT sr.Id, sr.LessonId, sr.AudioUrl, sr.Score, sr.Feedback,
               l.Title as LessonTitle
        FROM SpeakingRecords sr
        LEFT JOIN Lessons l ON sr.LessonId = l.Id
        WHERE sr.UserId = @userId
        ORDER BY sr.Id DESC
      `);
    return result.recordset;
  }
};

module.exports = speakingService;
