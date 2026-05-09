// ============================================
// Writing Module — Controller
// ============================================
const { success, badRequest } = require('../../utils/responseHelper');
const { sql, getPool } = require('../../config/database');

const writingController = {
  async getLessons(req, res, next) {
    try {
      const pool = getPool();
      const query = `
        SELECT l.Id, l.Title, l.Description, l.OrderIndex, COUNT(e.Id) as ExerciseCount
        FROM WritingLessons l
        LEFT JOIN WritingExercises e ON e.LessonId = l.Id
        GROUP BY l.Id, l.Title, l.Description, l.OrderIndex
        ORDER BY l.OrderIndex ASC
      `;
      const result = await pool.request().query(query);
      
      const progressQuery = `SELECT LessonId FROM WritingProgress WHERE UserId = @userId AND Status = 'completed'`;
      const progressResult = await pool.request().input('userId', sql.UniqueIdentifier, req.user.id).query(progressQuery);
      const completedLessons = progressResult.recordset.map(r => r.LessonId);

      const lessons = result.recordset.map((row, index) => {
        const isCompleted = completedLessons.includes(row.Id);
        const isLocked = index > 0 && !completedLessons.includes(result.recordset[index - 1].Id);
        
        return {
          id: row.Id,
          title: row.Title,
          description: row.Description,
          exerciseCount: row.ExerciseCount,
          isCompleted,
          isLocked
        };
      });

      return success(res, { lessons });
    } catch (err) {
      next(err);
    }
  },

  async getLessonDetails(req, res, next) {
    try {
      const { id } = req.params;
      const pool = getPool();
      
      const lessonResult = await pool.request().input('id', sql.UniqueIdentifier, id).query(`SELECT Id, Title FROM WritingLessons WHERE Id = @id`);
      if (lessonResult.recordset.length === 0) return badRequest(res, 'Lesson not found');

      const exerResult = await pool.request().input('id', sql.UniqueIdentifier, id).query(`
        SELECT Id, ContentVI, CorrectAnswerEN
        FROM WritingExercises
        WHERE LessonId = @id
        ORDER BY OrderIndex ASC
      `);

      const exercises = [];
      for (let row of exerResult.recordset) {
        const vocabRes = await pool.request().input('exId', sql.UniqueIdentifier, row.Id).query(`
          SELECT Word, Meaning FROM WritingVocab WHERE ExerciseId = @exId
        `);
        exercises.push({
          id: row.Id,
          contentVI: row.ContentVI,
          correctAnswerEN: row.CorrectAnswerEN, // Send this so client can display it later
          vocab: vocabRes.recordset.map(v => ({ word: v.Word, meaning: v.Meaning }))
        });
      }

      return success(res, { 
        lesson: { id: lessonResult.recordset[0].Id, title: lessonResult.recordset[0].Title },
        exercises 
      });
    } catch (err) {
      next(err);
    }
  },

  async checkWriting(req, res, next) {
    try {
      const { userText, targetText } = req.body;
      if (!userText || !targetText) {
        return badRequest(res, 'userText and targetText are required');
      }

      // Preprocessing: lower case, remove all punctuation
      const cleanString = (str) => {
        return str.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
      };

      const cleanUser = cleanString(userText);
      const cleanTarget = cleanString(targetText);

      // Levenshtein distance on characters
      const levenshtein = (a, b) => {
        if(a.length === 0) return b.length;
        if(b.length === 0) return a.length;
        let matrix = [];
        for(let i = 0; i <= b.length; i++) matrix[i] = [i];
        for(let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for(let i = 1; i <= b.length; i++){
          for(let j = 1; j <= a.length; j++){
            if(b.charAt(i-1) == a.charAt(j-1)) matrix[i][j] = matrix[i-1][j-1];
            else matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1));
          }
        }
        return matrix[b.length][a.length];
      };

      const dist = levenshtein(cleanUser, cleanTarget);
      const maxLen = Math.max(cleanUser.length, cleanTarget.length);
      const score = maxLen === 0 ? 100 : Math.max(0, Math.round((1 - dist / maxLen) * 100));

      const passed = score >= 80;

      return success(res, {
        score,
        passed,
        feedback: passed ? 'Chính xác! Bạn làm rất tốt.' : 'Chưa đủ chính xác, hãy xem lại đáp án nhé.'
      });
    } catch (err) {
      next(err);
    }
  },

  async saveProgress(req, res, next) {
    try {
      const { lessonId, completed } = req.body;
      const pool = getPool();
      
      await pool.request()
        .input('userId', sql.UniqueIdentifier, req.user.id)
        .input('lessonId', sql.UniqueIdentifier, lessonId)
        .query(`
          IF EXISTS (SELECT 1 FROM WritingProgress WHERE UserId = @userId AND LessonId = @lessonId)
            UPDATE WritingProgress SET Status = 'completed', UpdatedAt = GETDATE() WHERE UserId = @userId AND LessonId = @lessonId
          ELSE
            INSERT INTO WritingProgress (UserId, LessonId, Score, Status) VALUES (@userId, @lessonId, 100, 'completed')
        `);
        
      return success(res, { message: 'Progress saved' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = writingController;
