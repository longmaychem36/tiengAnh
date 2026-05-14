// ============================================
// Writing Module — Controller
// ============================================
const axios = require('axios');
const { success, badRequest } = require('../../utils/responseHelper');
const { sql, getPool } = require('../../config/database');

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct';

function stripCodeFence(text) {
  return String(text || '')
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
}

function extractFirstJsonObject(text) {
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (start === -1) {
      if (char === '{') {
        start = i;
        depth = 1;
      }
      continue;
    }

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;

    if (depth === 0) return text.slice(start, i + 1);
  }

  return null;
}

function parseJsonContent(content) {
  const clean = stripCodeFence(content);
  try {
    return JSON.parse(clean);
  } catch (err) {
    const objectText = extractFirstJsonObject(clean);
    if (objectText) return JSON.parse(objectText);
    throw err;
  }
}

function getSimilarityScore(userText, targetText) {
  const cleanString = (str) => {
    return str.toLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ').trim();
  };

  const cleanUser = cleanString(userText);
  const cleanTarget = cleanString(targetText);

  const levenshtein = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i += 1) matrix[i] = [i];
    for (let j = 0; j <= a.length; j += 1) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i += 1) {
      for (let j = 1; j <= a.length; j += 1) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  const dist = levenshtein(cleanUser, cleanTarget);
  const maxLen = Math.max(cleanUser.length, cleanTarget.length);
  return maxLen === 0 ? 100 : Math.max(0, Math.round((1 - dist / maxLen) * 100));
}

function fallbackWritingCheck(userText, targetText) {
  const score = getSimilarityScore(userText, targetText);
  const passed = score >= 80;

  return {
    score,
    passed,
    feedback: passed ? 'Chính xác! Bạn làm rất tốt.' : 'Chưa đủ chính xác, hãy xem lại đáp án nhé.',
    source: 'similarity'
  };
}

function normalizeAiWritingFeedback(raw, fallbackScore) {
  const parsedScore = Number.parseInt(raw?.score, 10);
  const score = Math.min(Math.max(Number.isNaN(parsedScore) ? fallbackScore : parsedScore, 0), 100);
  const grammarNotes = Array.isArray(raw?.grammarNotes) ? raw.grammarNotes.slice(0, 2).filter(Boolean) : [];
  const naturalnessNotes = Array.isArray(raw?.naturalnessNotes) ? raw.naturalnessNotes.slice(0, 2).filter(Boolean) : [];
  const baseFeedback = typeof raw?.feedback === 'string' && raw.feedback.trim()
    ? raw.feedback.trim()
    : 'AI đã chấm bài viết của bạn.';
  const feedbackParts = [
    baseFeedback,
    grammarNotes.length ? `Ngữ pháp: ${grammarNotes.join(' ')}` : '',
    naturalnessNotes.length ? `Tự nhiên hơn: ${naturalnessNotes.join(' ')}` : ''
  ].filter(Boolean);

  return {
    score,
    passed: typeof raw?.passed === 'boolean' ? raw.passed : score >= 75,
    feedback: feedbackParts.join(' '),
    correctedText: typeof raw?.correctedText === 'string' ? raw.correctedText.trim() : '',
    grammarNotes,
    naturalnessNotes,
    source: 'ai'
  };
}

async function checkWritingWithAi(userText, targetText) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY is not configured');
  }

  const similarityScore = getSimilarityScore(userText, targetText);
  const systemPrompt = [
    'You are an English writing tutor for Vietnamese learners.',
    'Evaluate grammar, meaning, and naturalness. Do not require exact wording if the learner answer is correct and natural.',
    'Return valid JSON only. Do not include markdown.',
    'JSON shape: {"score":0-100,"passed":true/false,"feedback":"short Vietnamese feedback","correctedText":"best corrected English sentence","grammarNotes":["..."],"naturalnessNotes":["..."]}.',
    'Feedback must be in Vietnamese, concise, specific, and encouraging without being vague.',
    'Score should reflect meaning accuracy, grammar, word choice, punctuation, and naturalness.'
  ].join(' ');

  const userPrompt = [
    `Reference answer: ${targetText}`,
    `Learner answer: ${userText}`,
    `Similarity baseline: ${similarityScore}/100`,
    'If the learner answer has the same meaning but uses different natural wording, give a good score.',
    'If grammar is wrong, explain the most important correction in Vietnamese.'
  ].join('\n');

  let response;
  try {
    response = await axios.post(
      `${NVIDIA_BASE_URL}/chat/completions`,
      {
        model: NVIDIA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        top_p: 0.8,
        max_tokens: 700,
        response_format: { type: 'json_object' },
        stream: false
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
  } catch (err) {
    const status = err.response?.status;
    const detail = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Unknown API error';
    throw new Error(`NVIDIA writing feedback failed${status ? ` (${status})` : ''}: ${detail}`);
  }

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('NVIDIA did not return writing feedback.');
  }

  return normalizeAiWritingFeedback(parseJsonContent(content), similarityScore);
}

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

      try {
        return success(res, await checkWritingWithAi(userText, targetText));
      } catch (aiErr) {
        console.warn('AI writing feedback failed, falling back to similarity:', aiErr.message);
        return success(res, fallbackWritingCheck(userText, targetText));
      }
    } catch (err) {
      next(err);
    }
  },

  async saveProgress(req, res, next) {
    try {
      const { lessonId, completed } = req.body;
      if (!lessonId) {
        return badRequest(res, 'lessonId is required');
      }

      const pool = getPool();

      const status = completed === false ? 'in_progress' : 'completed';
      const score = status === 'completed' ? 100 : null;

      await pool.query(`
        INSERT INTO WritingProgress (UserId, LessonId, Score, Status, UpdatedAt)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (UserId, LessonId)
        DO UPDATE SET
          Score = COALESCE(EXCLUDED.Score, WritingProgress.Score),
          Status = EXCLUDED.Status,
          UpdatedAt = NOW()
      `, [req.user.id, lessonId, score, status]);
        
      return success(res, { message: 'Progress saved' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = writingController;
