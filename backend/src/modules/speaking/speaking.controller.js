// ============================================
// Speaking Module — Controller
// ============================================
const speakingService = require('./speaking.service');
const { success, created, badRequest } = require('../../utils/responseHelper');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const billingService = require('../billing/billing.service');

const WHISPER_SERVER_URL = process.env.WHISPER_SERVER_URL || 'http://127.0.0.1:5001';

const contractions = {
  "i'm": 'i am',
  "you're": 'you are',
  "he's": 'he is',
  "she's": 'she is',
  "it's": 'it is',
  "we're": 'we are',
  "they're": 'they are',
  "i've": 'i have',
  "you've": 'you have',
  "we've": 'we have',
  "they've": 'they have',
  "i'll": 'i will',
  "you'll": 'you will',
  "we'll": 'we will',
  "they'll": 'they will',
  "don't": 'do not',
  "doesn't": 'does not',
  "didn't": 'did not',
  "can't": 'can not',
  "cannot": 'can not',
  "won't": 'will not',
  "isn't": 'is not',
  "aren't": 'are not',
  "wasn't": 'was not',
  "weren't": 'were not',
  "there's": 'there is',
  "that's": 'that is',
  "what's": 'what is'
};

const fillerWords = new Set(['um', 'uh', 'erm', 'ah', 'hmm']);
const lightWords = new Set(['a', 'an', 'the', 'to', 'of', 'in', 'on', 'at', 'for', 'and', 'or']);

function normalizeSpeakingText(text = '') {
  let normalized = String(text).toLowerCase().trim();
  Object.entries(contractions).forEach(([short, expanded]) => {
    normalized = normalized.replace(new RegExp(`\\b${short.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'), expanded);
  });
  return normalized
    .replace(/[^a-z0-9\s']/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !fillerWords.has(word));
}

function lightStem(word) {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith('es')) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s')) return word.slice(0, -1);
  return word;
}

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let previous = Array.from({ length: a.length + 1 }, (_, index) => index);
  for (let i = 1; i <= b.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= a.length; j += 1) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[a.length];
}

function wordSimilarity(target, user) {
  if (target === user) return 1;
  if (lightStem(target) === lightStem(user)) return 0.96;
  const maxLen = Math.max(target.length, user.length, 1);
  const ratio = 1 - (levenshtein(target, user) / maxLen);
  if (maxLen <= 3) return ratio >= 0.67 ? ratio : 0;
  return ratio >= 0.72 ? ratio : 0;
}

function wordWeight(word) {
  return lightWords.has(word) ? 0.45 : 1;
}

function scoreSpeakingTarget(targetText, transcript) {
  const targetWords = normalizeSpeakingText(targetText);
  const userWords = normalizeSpeakingText(transcript);
  const targetLen = targetWords.length;
  const userLen = userWords.length;

  if (targetLen === 0) {
    return { score: 0, missingWords: [], extraWords: userWords };
  }

  const dp = Array.from({ length: targetLen + 1 }, () => Array(userLen + 1).fill(0));
  const back = Array.from({ length: targetLen + 1 }, () => Array(userLen + 1).fill(null));

  for (let i = 1; i <= targetLen; i += 1) {
    for (let j = 1; j <= userLen; j += 1) {
      let best = dp[i - 1][j];
      let move = 'skipTarget';

      if (dp[i][j - 1] > best) {
        best = dp[i][j - 1];
        move = 'skipUser';
      }

      const similarity = wordSimilarity(targetWords[i - 1], userWords[j - 1]);
      if (similarity > 0) {
        const candidate = dp[i - 1][j - 1] + (similarity * wordWeight(targetWords[i - 1]));
        if (candidate > best) {
          best = candidate;
          move = 'match';
        }
      }

      dp[i][j] = best;
      back[i][j] = move;
    }
  }

  const matchedTarget = new Set();
  const matchedUser = new Set();
  let i = targetLen;
  let j = userLen;

  while (i > 0 && j > 0) {
    const move = back[i][j];
    if (move === 'match') {
      matchedTarget.add(i - 1);
      matchedUser.add(j - 1);
      i -= 1;
      j -= 1;
    } else if (move === 'skipUser') {
      j -= 1;
    } else {
      i -= 1;
    }
  }

  const targetWeight = targetWords.reduce((sum, word) => sum + wordWeight(word), 0) || 1;
  const userWeight = userWords.reduce((sum, word) => sum + wordWeight(word), 0) || 1;
  const matchedWeight = dp[targetLen][userLen];
  const recall = matchedWeight / targetWeight;
  const precision = matchedWeight / userWeight;
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  const lengthRatio = Math.min(userLen, targetLen) / Math.max(userLen, targetLen, 1);
  const score = Math.round(Math.max(0, Math.min(1, (0.72 * recall) + (0.20 * f1) + (0.08 * lengthRatio))) * 100);

  return {
    score,
    missingWords: targetWords.filter((word, index) => !matchedTarget.has(index) && wordWeight(word) >= 1).slice(0, 5),
    extraWords: userWords.filter((word, index) => !matchedUser.has(index) && wordWeight(word) >= 1).slice(0, 5)
  };
}

function analyzeTranscript(transcript, targetTexts) {
  let best = { score: 0, matchedText: null, missingWords: [], extraWords: [] };

  targetTexts.forEach((targetText) => {
    if (!targetText) return;
    const result = scoreSpeakingTarget(targetText, transcript);
    if (result.score > best.score) {
      best = { ...result, matchedText: targetText };
    }
  });

  let feedback;
  if (best.score >= 85) feedback = 'Rất tốt! Bạn nói khá sát câu mẫu.';
  else if (best.score >= 65) feedback = 'Khá ổn, nhưng còn vài từ chưa rõ hoặc chưa đúng thứ tự.';
  else feedback = 'Chưa chính xác lắm, hãy nghe mẫu và thử nói chậm, rõ từng cụm.';

  if (best.missingWords.length > 0 && best.score < 90) {
    feedback += ` Cần chú ý: ${best.missingWords.join(', ')}.`;
  }

  return { ...best, feedback };
}

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
          missingWords: result.missingWords || [],
          extraWords: result.extraWords || [],
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

  /**
   * Generate a temporary personalized speaking lesson with NVIDIA AI.
   * Generated questions are stored in process memory only, not in database.
   */
  async createPersonalizedLesson(req, res, next) {
    try {
      const canUseAi = req.user.role === 'admin'
        || req.user.role === 'superadmin'
        || await billingService.isPlusUser(req.user.id);

      if (!canUseAi) {
        return res.status(403).json({
          success: false,
          message: 'Vui lòng nâng cấp Plus để sử dụng tính năng này.'
        });
      }

      const data = await speakingService.createPersonalizedLesson(req.user.id, req.body);
      return success(res, data, 'Personalized speaking lesson generated');
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message
        });
      }
      next(err);
    }
  },

  /**
   * Read a temporary personalized speaking lesson from memory.
   */
  async getPersonalizedLesson(req, res, next) {
    try {
      const data = speakingService.getPersonalizedLesson(req.user.id, req.params.sessionId);
      return success(res, data);
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message
        });
      }
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

      const result = analyzeTranscript(transcript, targetTexts);

      return success(res, {
        transcript,
        score: result.score,
        feedback: result.feedback,
        matchedText: result.matchedText,
        missingWords: result.missingWords,
        extraWords: result.extraWords
      });

    } catch (err) {
      next(err);
    }
  }
};

module.exports = speakingController;
