// ============================================
// Progress Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');
const { EXP_REWARDS } = require('../../utils/constants');
const gamificationService = require('../gamification/gamification.service');

const progressService = {
  async getOverall(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT 
          (SELECT COUNT(*)::int FROM UserProgress WHERE UserId = @userId) as TotalLessons,
          (SELECT COUNT(*)::int FROM UserProgress WHERE UserId = @userId AND Status = 'completed') as CompletedLessons,
          (SELECT COUNT(*)::int FROM UserVocabulary WHERE UserId = @userId) as TotalVocab,
          (SELECT COUNT(*)::int FROM UserVocabulary WHERE UserId = @userId AND Status = 'mastered') as MasteredVocab,
          (SELECT COALESCE(SUM(Attempts), 0)::int FROM UserGameProgress WHERE UserId = @userId) as GamesPlayed,
          (SELECT COALESCE(AVG(Score), 0)::float FROM UserProgress WHERE UserId = @userId AND Score IS NOT NULL) as AvgScore
      `);
    return result.recordset[0];
  },

  async updateLesson(userId, lessonId, status, score) {
    const pool = getPool();
    const normalizedStatus = status || 'in_progress';

    const existingResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .query(`
        SELECT Status, Score
        FROM UserProgress
        WHERE UserId = @userId AND LessonId = @lessonId
      `);
    const wasCompleted = existingResult.recordset[0]?.Status === 'completed';

    const updateResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .input('status', sql.NVarChar, normalizedStatus)
      .input('score', sql.Int, score || null)
      .query(`
        UPDATE UserProgress
        SET Status = @status,
            Score = COALESCE(@score, Score)
        WHERE UserId = @userId AND LessonId = @lessonId
      `);

    if (updateResult.rowsAffected[0] === 0) {
      await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .input('lessonId', sql.UniqueIdentifier, lessonId)
        .input('status', sql.NVarChar, normalizedStatus)
        .input('score', sql.Int, score || null)
        .query(`
          INSERT INTO UserProgress (UserId, LessonId, Status, Score)
          VALUES (@userId, @lessonId, @status, @score)
        `);
    }

    let expReward = null;
    if (normalizedStatus === 'completed' && !wasCompleted) {
      expReward = await gamificationService.addExp(
        userId,
        EXP_REWARDS.LESSON_COMPLETE,
        'lesson_complete'
      );
    }

    return {
      userId,
      lessonId,
      status: normalizedStatus,
      score,
      alreadyCompleted: wasCompleted,
      expReward
    };
  },

  async getByCourse(userId, courseId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('courseId', sql.UniqueIdentifier, courseId)
      .query(`
        SELECT l.Id as LessonId, l.Title, l.OrderIndex,
               up.Status, up.Score
        FROM Lessons l
        LEFT JOIN UserProgress up ON l.Id = up.LessonId AND up.UserId = @userId
        WHERE l.CourseId = @courseId
        ORDER BY l.OrderIndex ASC
      `);
    return result.recordset;
  }
};

module.exports = progressService;
