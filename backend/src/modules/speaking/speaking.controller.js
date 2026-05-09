// ============================================
// Speaking Module — Controller
// ============================================
const speakingService = require('./speaking.service');
const { success, created, badRequest } = require('../../utils/responseHelper');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const speakingController = {
  async uploadRecording(req, res, next) {
    try {
      const { lessonId } = req.body;
      if (!lessonId) return badRequest(res, 'Lesson ID is required');
      if (!req.file) return badRequest(res, 'Audio file is required');

      const audioUrl = `/uploads/audio/${req.file.filename}`;
      const record = await speakingService.saveRecording(req.user.id, lessonId, audioUrl);
      return created(res, record, 'Recording saved');
    } catch (err) {
      next(err);
    }
  },

  async transcribeAudio(req, res, next) {
    try {
      if (!req.file) return badRequest(res, 'Audio file is required');

      const filePath = path.resolve(req.file.path);
      const axios = require('axios');
      
      try {
        const response = await axios.post('http://127.0.0.1:5001/transcribe', { file: filePath });
        const result = response.data;
        
        if (result.error) {
          console.error('Whisper Server Error:', result.error);
          return res.status(500).json({ success: false, message: result.error });
        }
        
        return success(res, { transcript: result.text });
      } catch (err) {
        console.error('Failed to communicate with Whisper Server:', err.message);
        // Clean up file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return res.status(500).json({ success: false, message: 'Speech recognition engine is offline. Please make sure the whisper server is running.' });
      }
    } catch (err) {
      next(err);
    }
  },

  async getRecords(req, res, next) {
    try {
      const records = await speakingService.getRecords(req.user.id);
      return success(res, records);
    } catch (err) {
      next(err);
    }
  },

  // ==========================================
  // NEW FLUENTEZ-LIKE MODULE ENDPOINTS
  // ==========================================
  
  async getLessons(req, res, next) {
    try {
      const { sql, getPool } = require('../../config/database');
      const query = `
        SELECT l.Id, l.Title as Name, l.OrderIndex, COUNT(q.Id) as QuestionCount
        FROM SpeakingLessons l
        LEFT JOIN SpeakingQuestions q ON q.LessonId = l.Id
        GROUP BY l.Id, l.Title, l.OrderIndex
        ORDER BY l.OrderIndex ASC
      `;
      const pool = getPool();
      const result = await pool.request().query(query);
      
      const progressQuery = `SELECT LessonId FROM SpeakingProgress WHERE UserId = @userId AND Status = 'completed'`;
      const progressResult = await pool.request().input('userId', sql.UniqueIdentifier, req.user.id).query(progressQuery);
      const completedLevels = progressResult.recordset.map(r => r.LessonId);

      const lessons = result.recordset.map((row, index) => {
        const isCompleted = completedLevels.includes(row.Id);
        const isLocked = index > 0 && !completedLevels.includes(result.recordset[index - 1].Id);
        
        return {
          id: row.Id,
          title: row.Name,
          questionCount: row.QuestionCount,
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
      const { sql, getPool } = require('../../config/database');
      const { id } = req.params;
      
      const pool = getPool();
      const levelResult = await pool.request().input('id', sql.UniqueIdentifier, id).query(`SELECT Id, Title as Name FROM SpeakingLessons WHERE Id = @id`);
      if (levelResult.recordset.length === 0) return badRequest(res, 'Lesson not found');

      const qResult = await pool.request().input('id', sql.UniqueIdentifier, id).query(`
        SELECT Id, Question, Translation, Option1, Option2, Option3
        FROM SpeakingQuestions
        WHERE LessonId = @id
        ORDER BY OrderIndex ASC
      `);

      const sentences = qResult.recordset.map(q => ({
        id: q.Id,
        question: q.Question,
        translation: q.Translation,
        options: [q.Option1, q.Option2, q.Option3].filter(Boolean)
      }));

      return success(res, { 
        lesson: { id: levelResult.recordset[0].Id, title: levelResult.recordset[0].Name },
        sentences 
      });
    } catch (err) {
      next(err);
    }
  },

  async saveProgress(req, res, next) {
    try {
      const { sql, getPool } = require('../../config/database');
      const { lessonId, completed } = req.body;
      const pool = getPool();
      
      await pool.request()
        .input('userId', sql.UniqueIdentifier, req.user.id)
        .input('lessonId', sql.UniqueIdentifier, lessonId)
        .query(`
          IF EXISTS (SELECT 1 FROM SpeakingProgress WHERE UserId = @userId AND LessonId = @lessonId)
            UPDATE SpeakingProgress SET Status = 'completed', UpdatedAt = GETDATE() WHERE UserId = @userId AND LessonId = @lessonId
          ELSE
            INSERT INTO SpeakingProgress (UserId, LessonId, Score, Status) VALUES (@userId, @lessonId, 100, 'completed')
        `);
        
      return success(res, { message: 'Progress saved' });
    } catch (err) {
      next(err);
    }
  },

  async analyzeText(req, res, next) {
    try {
      const { targetTexts, transcript } = req.body;
      
      if (!targetTexts || !Array.isArray(targetTexts) || !transcript) {
        return badRequest(res, 'targetTexts (array) and transcript are required');
      }

      // Calculate Levenshtein distance on words
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

      const isSimilar = (target, user) => {
        if (target === user) return true;
        if (target.includes(user) || user.includes(target)) return true;
        const dist = levenshtein(target, user);
        if (target.length <= 3 && dist <= 1) return true;
        if (target.length > 3 && dist <= 2) return true;
        return false;
      };

      const userWords = transcript.toLowerCase().replace(/[.,?!]/g, '').split(' ').filter(Boolean);
      
      let maxScore = 0;
      let bestMatch = null;

      for (let targetText of targetTexts) {
        const targetWords = targetText.toLowerCase().replace(/[.,?!]/g, '').split(' ').filter(Boolean);
        let matchCount = 0;
        targetWords.forEach(tw => { 
          if (userWords.some(uw => isSimilar(tw, uw))) matchCount++; 
        });
        const currentScore = Math.round((matchCount / (targetWords.length || 1)) * 100);
        if (currentScore > maxScore) {
          maxScore = currentScore;
          bestMatch = targetText;
        }
      }

      const score = maxScore;
      let feedback = score >= 60 ? 'Thật tuyệt vời, bạn nói rất tốt!' : 'Chưa được chính xác lắm, hãy thử lại nhé!';

      return success(res, {
        transcript: transcript,
        score: score,
        feedback: feedback,
        matchedText: bestMatch
      });

    } catch (err) {
      next(err);
    }
  }
};

module.exports = speakingController;
