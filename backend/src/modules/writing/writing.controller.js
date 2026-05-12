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
      const result = await pool.query(query);
      
      const progressQuery = `SELECT LessonId FROM WritingProgress WHERE UserId = $1 AND Status = 'completed'`;
      const progressResult = await pool.query(progressQuery, [req.user.id]);
      const completedLessons = progressResult.rows.map(r => r.lessonid);

      const lessons = result.rows.map((row, index) => {
        const isCompleted = completedLessons.includes(row.id);
        const isLocked = index > 0 && !completedLessons.includes(result.rows[index - 1].id);
        
        return {
          id: row.id,
          title: row.title,
          description: row.description,
          exerciseCount: row.exercisecount,
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
      
      const lessonResult = await pool.query(`SELECT Id, Title FROM WritingLessons WHERE Id = $1`, [id]);
      if (lessonResult.rows.length === 0) return badRequest(res, 'Lesson not found');

      const exerResult = await pool.query(`
        SELECT Id, ContentVI, CorrectAnswerEN
        FROM WritingExercises
        WHERE LessonId = $1
        ORDER BY OrderIndex ASC
      `, [id]);

      const exercises = [];
      for (let row of exerResult.rows) {
        const vocabRes = await pool.query(`
          SELECT Word, Meaning FROM WritingVocab WHERE ExerciseId = $1
        `, [row.id]);
        exercises.push({
          id: row.id,
          contentVI: row.contentvi,
          correctAnswerEN: row.correctansweren,
          vocab: vocabRes.rows.map(v => ({ word: v.word, meaning: v.meaning }))
        });
      }

      return success(res, { 
        lesson: { id: lessonResult.rows[0].id, title: lessonResult.rows[0].title },
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
      
      const existRes = await pool.query(`SELECT 1 FROM WritingProgress WHERE UserId = $1 AND LessonId = $2`, [req.user.id, lessonId]);
      if (existRes.rows.length > 0) {
        await pool.query(`UPDATE WritingProgress SET Status = 'completed', UpdatedAt = NOW() WHERE UserId = $1 AND LessonId = $2`, [req.user.id, lessonId]);
      } else {
        await pool.query(`INSERT INTO WritingProgress (Id, UserId, LessonId, Score, Status) VALUES (gen_random_uuid(), $1, $2, 100, 'completed')`, [req.user.id, lessonId]);
      }
        
      return success(res, { message: 'Progress saved' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = writingController;
