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
const gamificationService = require('../gamification/gamification.service');
const dailyService = require('../daily/daily.service');
const { EXP_REWARDS } = require('../../utils/constants');
const { ensureOnboardingSchema, getUserPlacementLevel } = require('../onboarding/onboarding.schema');

const WHISPER_SERVER_URL = process.env.WHISPER_SERVER_URL || 'http://127.0.0.1:5001';
const WHISPER_TIMEOUT_MS = Number.parseInt(process.env.WHISPER_TIMEOUT_MS, 10) || 45000;

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
const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const ordinalWords = {
  1: 'first',
  2: 'second',
  3: 'third',
  4: 'fourth',
  5: 'fifth',
  6: 'sixth',
  7: 'seventh',
  8: 'eighth',
  9: 'ninth',
  10: 'tenth',
  11: 'eleventh',
  12: 'twelfth',
  13: 'thirteenth',
  14: 'fourteenth',
  15: 'fifteenth',
  16: 'sixteenth',
  17: 'seventeenth',
  18: 'eighteenth',
  19: 'nineteenth',
  20: 'twentieth',
  30: 'thirtieth',
  40: 'fortieth',
  50: 'fiftieth',
  60: 'sixtieth',
  70: 'seventieth',
  80: 'eightieth',
  90: 'ninetieth'
};

function integerToWords(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 999999) return String(value);
  if (number < 10) return ones[number];
  if (number < 20) return teens[number - 10];
  if (number < 100) {
    const ten = Math.floor(number / 10);
    const rest = number % 10;
    return rest ? `${tens[ten]} ${ones[rest]}` : tens[ten];
  }
  if (number < 1000) {
    const hundred = Math.floor(number / 100);
    const rest = number % 100;
    return rest ? `${ones[hundred]} hundred ${integerToWords(rest)}` : `${ones[hundred]} hundred`;
  }
  const thousand = Math.floor(number / 1000);
  const rest = number % 1000;
  return rest ? `${integerToWords(thousand)} thousand ${integerToWords(rest)}` : `${integerToWords(thousand)} thousand`;
}

function ordinalToWords(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0 || number > 999999) return String(value);
  if (ordinalWords[number]) return ordinalWords[number];
  if (number < 100) {
    const ten = Math.floor(number / 10) * 10;
    const rest = number % 10;
    return `${tens[Math.floor(ten / 10)]} ${ordinalWords[rest]}`;
  }
  const cardinal = integerToWords(number);
  const parts = cardinal.split(' ');
  const last = parts.pop();
  const wordToOrdinal = {
    ...Object.fromEntries(ones.map((word, index) => [word, ordinalWords[index]])),
    ...Object.fromEntries(teens.map((word, index) => [word, ordinalWords[index + 10]])),
    twenty: 'twentieth',
    thirty: 'thirtieth',
    forty: 'fortieth',
    fifty: 'fiftieth',
    sixty: 'sixtieth',
    seventy: 'seventieth',
    eighty: 'eightieth',
    ninety: 'ninetieth'
  };
  parts.push(wordToOrdinal[last] || `${last}th`);
  return parts.join(' ');
}

function isGroupedThousands(value) {
  return /^\d{1,3}(,\d{3})+$/.test(String(value));
}

function numberTokenToWords(value) {
  const token = String(value);
  if (token.includes(',') && !isGroupedThousands(token.split('.')[0])) {
    return token.split(',').map(part => decimalToWords(part)).join(' ');
  }
  return decimalToWords(token);
}

function decimalToWords(value) {
  const [whole, decimal = ''] = String(value).replace(/,/g, '').split('.');
  if (!decimal) return integerToWords(Number(whole));
  return `${integerToWords(Number(whole))} point ${decimal.split('').map((digit) => ones[Number(digit)] || digit).join(' ')}`;
}

function moneyToWords(rawValue, unit) {
  const clean = String(rawValue).replace(/,/g, '');
  if (String(rawValue).includes(',') && !isGroupedThousands(String(rawValue).split('.')[0])) {
    return `${String(rawValue).split(',').map(part => decimalToWords(part)).join(' ')} ${unit.plural}`;
  }
  const [wholeText, centsText] = clean.split('.');
  const whole = Number(wholeText || 0);
  const cents = centsText ? Number(centsText.padEnd(2, '0').slice(0, 2)) : 0;
  const major = whole > 0 ? `${integerToWords(whole)} ${whole === 1 ? unit.singular : unit.plural}` : '';
  const minor = cents > 0 ? `${integerToWords(cents)} ${cents === 1 ? 'cent' : 'cents'}` : '';
  return [major, minor].filter(Boolean).join(' ') || `zero ${unit.plural}`;
}

function normalizeNumbersAndSymbols(text) {
  const moneyUnits = {
    '$': { singular: 'dollar', plural: 'dollars' },
    '€': { singular: 'euro', plural: 'euros' },
    '£': { singular: 'pound', plural: 'pounds' },
    '¥': { singular: 'yen', plural: 'yen' }
  };
  let normalized = text;
  Object.entries(moneyUnits).forEach(([symbol, unit]) => {
    const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    normalized = normalized.replace(new RegExp(`${escaped}\\s*(\\d[\\d,]*(?:\\.\\d+)?)`, 'g'), (_, amount) => moneyToWords(amount, unit));
    normalized = normalized.replace(new RegExp(`(\\d[\\d,]*(?:\\.\\d+)?)\\s*${escaped}`, 'g'), (_, amount) => moneyToWords(amount, unit));
  });
  normalized = normalized
    .replace(/\bbucks?\b/g, 'dollars')
    .replace(/\b(\d[\d,]*)(st|nd|rd|th)\b/g, (_, number) => ordinalToWords(Number(number.replace(/,/g, ''))))
    .replace(/\b(\d[\d,]*(?:\.\d+)?)\s*%/g, (_, number) => `${numberTokenToWords(number)} percent`)
    .replace(/\b(\d[\d,]*\.\d+)\b/g, (_, number) => numberTokenToWords(number))
    .replace(/\b\d[\d,]*\b/g, (number) => numberTokenToWords(number));
  return normalized;
}

function normalizeSpeakingText(text = '') {
  let normalized = String(text).toLowerCase().trim();
  Object.entries(contractions).forEach(([short, expanded]) => {
    normalized = normalized.replace(new RegExp(`\\b${short.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'), expanded);
  });
  normalized = normalizeNumbersAndSymbols(normalized);
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
  return ratio >= 0.68 ? ratio : 0;
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
  const score = Math.round(Math.max(0, Math.min(1, (0.76 * recall) + (0.18 * f1) + (0.06 * lengthRatio))) * 100);

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

function buildWhisperInitialPrompt(targetTexts = [], prompt = '') {
  const samples = targetTexts
    .filter(Boolean)
    .map((text) => String(text).trim())
    .filter(Boolean)
    .slice(0, 4);
  const question = String(prompt || '').trim();
  const promptParts = [
    question ? `Question: ${question}` : '',
    samples.length ? `Expected English learner answers: ${samples.join(' | ')}` : ''
  ].filter(Boolean);
  return promptParts.join('\n').slice(0, 900);
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
          timeout: WHISPER_TIMEOUT_MS,
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
        const initialPrompt = buildWhisperInitialPrompt(textsArray, req.body.prompt);
        if (initialPrompt) formData.append('initialPrompt', initialPrompt);

        const response = await axios.post(`${WHISPER_SERVER_URL}/transcribe-and-analyze`, formData, {
          headers: { ...formData.getHeaders() },
          timeout: WHISPER_TIMEOUT_MS,
          maxContentLength: 50 * 1024 * 1024
        });

        const result = response.data;

        if (result.error) {
          console.error('Whisper Server Error:', result.error);
          return res.status(500).json({ success: false, message: result.error });
        }

        const transcript = result.transcript || result.text || '';
        const localAnalysis = analyzeTranscript(transcript, textsArray);
        return success(res, {
          transcript,
          score: localAnalysis.score,
          feedback: localAnalysis.feedback,
          matchedText: localAnalysis.matchedText,
          missingWords: localAnalysis.missingWords || [],
          extraWords: localAnalysis.extraWords || [],
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
      const canUseAi = await billingService.isPlusUser(req.user.id);

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

  /**
   * Complete an AI speaking lesson and award a small anti-spam capped EXP reward.
   */
  async completePersonalizedLesson(req, res, next) {
    try {
      const completion = speakingService.completePersonalizedLesson(req.user.id, req.params.sessionId, req.body);
      const expReward = completion.expAmount > 0
        ? await gamificationService.addExp(
          req.user.id,
          completion.expAmount,
          'ai_speaking_lesson_complete'
        )
        : null;

      return success(res, {
        message: completion.alreadyRewarded ? 'AI speaking lesson already rewarded' : 'AI speaking lesson completed',
        alreadyRewarded: completion.alreadyRewarded,
        expAmount: completion.expAmount,
        dailyRemaining: completion.dailyRemaining,
        expReward
      });
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
      await ensureOnboardingSchema();
      const placementLevel = await getUserPlacementLevel(req.user.id);
      const query = `
        SELECT l.Id, l.Title as Name, l.Description, l.OrderIndex, l.IsFoundation, COUNT(q.Id) as QuestionCount
        FROM SpeakingLessons l
        LEFT JOIN SpeakingQuestions q ON q.LessonId = l.Id
        GROUP BY l.Id, l.Title, l.Description, l.OrderIndex, l.IsFoundation
        ORDER BY l.OrderIndex ASC
      `;
      const pool = getPool();
      const result = await pool.request().query(query);
      
      const progressQuery = `SELECT LessonId FROM SpeakingProgress WHERE UserId = @userId AND Status = 'completed'`;
      const progressResult = await pool.request().input('userId', sql.UniqueIdentifier, req.user.id).query(progressQuery);
      const completedLevels = progressResult.recordset.map(r => r.LessonId);
      const visibleLessons = placementLevel === 'basic'
        ? result.recordset.filter((row) => !row.IsFoundation)
        : result.recordset;

      const lessons = visibleLessons.map((row, index) => {
        const isCompleted = completedLevels.includes(row.Id);
        const isLocked = index > 0 && !completedLevels.includes(visibleLessons[index - 1].Id);
        
        return {
          id: row.Id,
          title: row.Name,
          description: row.Description || '',
          isFoundation: Boolean(row.IsFoundation),
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
      await ensureOnboardingSchema();
      
      const pool = getPool();
      const levelResult = await pool.request().input('id', sql.UniqueIdentifier, id).query(`SELECT Id, Title as Name, IsFoundation FROM SpeakingLessons WHERE Id = @id`);
      if (levelResult.recordset.length === 0) return badRequest(res, 'Lesson not found');
      if (levelResult.recordset[0].IsFoundation && await getUserPlacementLevel(req.user.id) === 'basic') {
        return badRequest(res, 'Lesson not found');
      }

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
        lesson: { id: levelResult.recordset[0].Id, title: levelResult.recordset[0].Name, isFoundation: Boolean(levelResult.recordset[0].IsFoundation) },
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
      const existingResult = await pool.query(`
        SELECT Status
        FROM SpeakingProgress
        WHERE UserId = $1 AND LessonId = $2
      `, [req.user.id, lessonId]);
      const wasCompleted = existingResult.rows[0]?.status === 'completed';

      // PostgreSQL UPSERT — insert or update on conflict
      await pool.query(`
        INSERT INTO SpeakingProgress (UserId, LessonId, Score, Status, UpdatedAt)
        VALUES ($1, $2, 100, 'completed', NOW())
        ON CONFLICT (UserId, LessonId)
        DO UPDATE SET Status = 'completed', UpdatedAt = NOW()
      `, [req.user.id, lessonId]);
        
      const expReward = !wasCompleted
        ? await gamificationService.addExp(
          req.user.id,
          EXP_REWARDS.SPEAKING_LESSON_COMPLETE,
          'speaking_lesson_complete'
        )
        : null;

      dailyService.completeMatchingTasks(req.user.id, 'speaking_lesson', lessonId).catch((err) => {
        console.error('[daily] failed to complete speaking task:', err.message);
      });

      return success(res, { message: 'Progress saved', alreadyCompleted: wasCompleted, expReward });
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

