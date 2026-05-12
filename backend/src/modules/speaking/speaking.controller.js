// ============================================
// Speaking Module — Controller
// ============================================
const speakingService = require('./speaking.service');
const { success, created, badRequest } = require('../../utils/responseHelper');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const WHISPER_SERVER_URL = process.env.WHISPER_SERVER_URL || 'http://127.0.0.1:5001';

const speakingController = {
  /**
   * Transcribe audio file using Whisper server.
   * Receives audio upload from frontend, forwards to Python Whisper server.
   */
  async transcribeAudio(req, res, next) {
    try {
      if (!req.file) return badRequest(res, 'Audio file is required');

      const filePath = path.resolve(req.file.path);
      
      try {
        // Create form data to send to Whisper server
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath), {
          filename: req.file.filename || 'audio.webm',
          contentType: req.file.mimetype || 'audio/webm'
        });

        const response = await axios.post(`${WHISPER_SERVER_URL}/transcribe`, formData, {
          headers: {
            ...formData.getHeaders()
          },
          timeout: 30000, // 30 second timeout
          maxContentLength: 50 * 1024 * 1024
        });

        const result = response.data;
        
        if (result.error) {
          console.error('Whisper Server Error:', result.error);
          return res.status(500).json({ success: false, message: result.error });
        }
        
        return success(res, { 
          transcript: result.text,
          duration: result.duration,
          language: result.language
        });
      } catch (err) {
        console.error('Failed to communicate with Whisper Server:', err.message);
        return res.status(500).json({ 
          success: false, 
          message: 'Whisper server đang offline. Vui lòng chạy: python whisper_server.py' 
        });
      } finally {
        // Clean up uploaded file
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (e) {
          console.error('Failed to delete temp audio file:', e.message);
        }
      }
    } catch (err) {
      next(err);
    }
  },

  /**
   * Combined transcribe + analyze in one request.
   * Saves a network round-trip by doing both on the Whisper server.
   */
  async transcribeAndAnalyze(req, res, next) {
    try {
      if (!req.file) return badRequest(res, 'Audio file is required');
      
      const { targetTexts } = req.body;
      if (!targetTexts) return badRequest(res, 'targetTexts is required');

      const filePath = path.resolve(req.file.path);

      try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath), {
          filename: req.file.filename || 'audio.webm',
          contentType: req.file.mimetype || 'audio/webm'
        });
        // Send target texts as pipe-separated string
        const textsArray = typeof targetTexts === 'string' ? JSON.parse(targetTexts) : targetTexts;
        formData.append('targetTexts', JSON.stringify(textsArray));

        const response = await axios.post(`${WHISPER_SERVER_URL}/transcribe-and-analyze`, formData, {
          headers: { ...formData.getHeaders() },
          timeout: 30000,
          maxContentLength: 50 * 1024 * 1024
        });

        const result = response.data;

        if (result.error) {
          console.error('Whisper Server Error:', result.error);
          return res.status(500).json({ success: false, message: result.error });
        }

        return success(res, {
          transcript: result.transcript || result.text,
          score: result.score,
          feedback: result.feedback,
          matchedText: result.matchedText,
          processingTime: result.processingTime
        });
      } catch (err) {
        console.error('Failed to communicate with Whisper Server:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Whisper server đang offline. Vui lòng chạy: python whisper_server.py'
        });
      } finally {
        try {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) {}
      }
    } catch (err) {
      next(err);
    }
  },

  // ==========================================
  // LESSON ENDPOINTS
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
        SELECT Id, Question, Translation, Option1, Option1VI, Option2, Option2VI, Option3, Option3VI
        FROM SpeakingQuestions
        WHERE LessonId = @id
        ORDER BY OrderIndex ASC
      `);

      const sentences = qResult.recordset.map(q => {
        const opts = [];
        if (q.Option1) opts.push({ text: q.Option1, translation: q.Option1VI || '' });
        if (q.Option2) opts.push({ text: q.Option2, translation: q.Option2VI || '' });
        if (q.Option3) opts.push({ text: q.Option3, translation: q.Option3VI || '' });
        return {
          id: q.Id,
          question: q.Question,
          translation: q.Translation,
          options: opts
        };
      });

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
      
      // PostgreSQL UPSERT — insert or update on conflict
      await pool.query(`
        INSERT INTO SpeakingProgress (UserId, LessonId, Score, Status, UpdatedAt)
        VALUES ($1, $2, 100, 'completed', NOW())
        ON CONFLICT (UserId, LessonId)
        DO UPDATE SET Status = 'completed', UpdatedAt = NOW()
      `, [req.user.id, lessonId]);
        
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
