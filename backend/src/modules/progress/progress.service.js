// ============================================
// Progress Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');
const { EXP_REWARDS } = require('../../utils/constants');

const progressService = {
  async getOverall(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT 
          (SELECT COUNT(*) FROM UserProgress WHERE UserId = @userId) as TotalLessons,
          (SELECT COUNT(*) FROM UserProgress WHERE UserId = @userId AND Status = 'completed') as CompletedLessons,
          (SELECT COUNT(*) FROM UserVocabulary WHERE UserId = @userId) as TotalVocab,
          (SELECT COUNT(*) FROM UserVocabulary WHERE UserId = @userId AND Status = 'mastered') as MasteredVocab,
          (SELECT COUNT(*) FROM UserGameSession WHERE UserId = @userId) as GamesPlayed,
          (SELECT COALESCE(AVG(Score), 0) FROM UserProgress WHERE UserId = @userId AND Score IS NOT NULL) as AvgScore
      `);
    return result.recordset[0];
  },

  async updateLesson(userId, lessonId, status, score) {
    const pool = getPool();

    // Upsert progress
    await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .input('status', sql.NVarChar, status || 'in_progress')
      .input('score', sql.Int, score || null)
      .query(`
        MERGE UserProgress AS target
        USING (SELECT @userId as UserId, @lessonId as LessonId) AS source
        ON target.UserId = source.UserId AND target.LessonId = source.LessonId
        WHEN MATCHED THEN UPDATE SET Status = @status, Score = COALESCE(@score, target.Score)
        WHEN NOT MATCHED THEN INSERT (UserId, LessonId, Status, Score) VALUES (@userId, @lessonId, @status, @score);
      `);

    // Award EXP if completed
    if (status === 'completed') {
      await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .input('exp', sql.Int, EXP_REWARDS.LESSON_COMPLETE)
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
          WHERE UserId = @userId
        `);
    }

    return { userId, lessonId, status, score };
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
