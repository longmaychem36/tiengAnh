// ============================================
// Writing Module — Controller
// ============================================
const axios = require('axios');
const { success, badRequest } = require('../../utils/responseHelper');
const { sql, getPool } = require('../../config/database');
const gamificationService = require('../gamification/gamification.service');
const dailyService = require('../daily/daily.service');
const { EXP_REWARDS } = require('../../utils/constants');

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = process.env.WRITING_NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct';
const WRITING_AI_ENABLED = process.env.WRITING_AI_ENABLED !== 'false';
const WRITING_AI_TIMEOUT_MS = Number.parseInt(process.env.WRITING_AI_TIMEOUT_MS, 10) || 6000;
const WRITING_AI_MAX_TOKENS = Number.parseInt(process.env.WRITING_AI_MAX_TOKENS, 10) || 280;
const WRITING_FAST_PASS_SCORE = Number.parseInt(process.env.WRITING_FAST_PASS_SCORE, 10) || 92;
const WRITING_FAST_FAIL_SCORE = Number.parseInt(process.env.WRITING_FAST_FAIL_SCORE, 10) || 45;
const WRITING_CHECK_CACHE_TTL_MS = Number.parseInt(process.env.WRITING_CHECK_CACHE_TTL_MS, 10) || 10 * 60 * 1000;
const WRITING_CHECK_CACHE_MAX = Number.parseInt(process.env.WRITING_CHECK_CACHE_MAX, 10) || 500;
const writingCheckCache = new Map();

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

function normalizeText(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSimilarityScore(userText, targetText) {
  const cleanUser = normalizeText(userText);
  const cleanTarget = normalizeText(targetText);

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

function getWritingCacheKey(userText, targetText) {
  return `${normalizeText(targetText)}::${normalizeText(userText)}`;
}

function getCachedWritingCheck(cacheKey) {
  const cached = writingCheckCache.get(cacheKey);
  if (!cached) return null;

  if (Date.now() - cached.createdAt > WRITING_CHECK_CACHE_TTL_MS) {
    writingCheckCache.delete(cacheKey);
    return null;
  }

  return cached.value;
}

function setCachedWritingCheck(cacheKey, value) {
  if (writingCheckCache.size >= WRITING_CHECK_CACHE_MAX) {
    const oldestKey = writingCheckCache.keys().next().value;
    if (oldestKey) writingCheckCache.delete(oldestKey);
  }

  writingCheckCache.set(cacheKey, { value, createdAt: Date.now() });
}

function fallbackWritingCheck(userText, targetText, score = getSimilarityScore(userText, targetText)) {
  const passed = score >= 80;

  return {
    score,
    passed,
    feedback: passed ? 'Chính xác! Bạn làm rất tốt.' : 'Chưa đủ chính xác, hãy xem lại đáp án nhé.',
    correctedText: targetText,
    grammarNotes: [],
    naturalnessNotes: [],
    source: 'similarity'
  };
}

function buildFallbackPassage(exercises, field) {
  return exercises
    .map(item => item[field])
    .filter(Boolean)
    .join(' ');
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

async function recordWritingWeakness(req, result) {
  const score = Number(result?.score || 0);
  const grammarNotes = Array.isArray(result?.grammarNotes) ? result.grammarNotes.filter(Boolean) : [];
  const naturalnessNotes = Array.isArray(result?.naturalnessNotes) ? result.naturalnessNotes.filter(Boolean) : [];

  if (score >= 80 && grammarNotes.length === 0 && naturalnessNotes.length === 0) return;

  const { lessonId, exerciseId, prompt, userText, targetText } = req.body;
  const primaryNote = grammarNotes[0] || naturalnessNotes[0] || 'Câu viết chưa đạt độ chính xác';
  await dailyService.safeRecordErrorEvent(req.user.id, {
    skill: 'writing',
    activityType: 'writing_check',
    referenceType: exerciseId ? 'writing_exercise' : 'writing_lesson',
    referenceId: exerciseId || lessonId || null,
    errorType: grammarNotes.length > 0 ? 'grammar' : 'writing_accuracy',
    errorKey: primaryNote,
    label: grammarNotes.length > 0 ? `Ngữ pháp: ${primaryNote}` : 'Độ chính xác bài viết',
    severity: score < 50 ? 5 : score < 70 ? 4 : 3,
    prompt,
    userAnswer: userText,
    expectedAnswer: targetText,
    feedback: result.feedback,
    metadata: {
      lessonId,
      exerciseId,
      score,
      correctedText: result.correctedText || '',
      grammarNotes,
      naturalnessNotes,
      source: result.source || ''
    }
  });
}

async function checkWritingWithAi(userText, targetText) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY is not configured');
  }

  const similarityScore = getSimilarityScore(userText, targetText);
  const systemPrompt = [
    'You are an English writing tutor for Vietnamese learners.',
    'Evaluate one short sentence for grammar, meaning, and naturalness.',
    'Do not require exact wording if the learner answer is correct and natural.',
    'Return valid JSON only. Do not include markdown.',
    'JSON shape: {"score":0-100,"passed":true/false,"feedback":"Vietnamese feedback under 18 words","correctedText":"best corrected English sentence","grammarNotes":["one short note"],"naturalnessNotes":[]}.',
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
        max_tokens: WRITING_AI_MAX_TOKENS,
        response_format: { type: 'json_object' },
        stream: false
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: WRITING_AI_TIMEOUT_MS
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
      
      const lessonResult = await pool.query(`
        SELECT Id, Title, Description, PassageEN, PassageVI
        FROM WritingLessons
        WHERE Id = $1
      `, [id]);
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

      const lesson = lessonResult.rows[0];

      return success(res, { 
        lesson: {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          passageEN: lesson.passageen || buildFallbackPassage(exercises, 'correctAnswerEN'),
          passageVI: lesson.passagevi || buildFallbackPassage(exercises, 'contentVI')
        },
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

      const cacheKey = getWritingCacheKey(userText, targetText);
      const cached = getCachedWritingCheck(cacheKey);
      if (cached) {
        await recordWritingWeakness(req, cached);
        return success(res, { ...cached, source: `${cached.source}:cache` });
      }

      const similarityScore = getSimilarityScore(userText, targetText);
      if (
        !WRITING_AI_ENABLED ||
        similarityScore >= WRITING_FAST_PASS_SCORE ||
        similarityScore <= WRITING_FAST_FAIL_SCORE
      ) {
        const fastResult = fallbackWritingCheck(userText, targetText, similarityScore);
        setCachedWritingCheck(cacheKey, fastResult);
        await recordWritingWeakness(req, fastResult);
        return success(res, fastResult);
      }

      try {
        const aiResult = await checkWritingWithAi(userText, targetText);
        setCachedWritingCheck(cacheKey, aiResult);
        await recordWritingWeakness(req, aiResult);
        return success(res, aiResult);
      } catch (aiErr) {
        console.warn('AI writing feedback failed, falling back to similarity:', aiErr.message);
        const fallbackResult = fallbackWritingCheck(userText, targetText, similarityScore);
        setCachedWritingCheck(cacheKey, fallbackResult);
        await recordWritingWeakness(req, fallbackResult);
        return success(res, fallbackResult);
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
      const existingResult = await pool.query(`
        SELECT Status
        FROM WritingProgress
        WHERE UserId = $1 AND LessonId = $2
      `, [req.user.id, lessonId]);
      const wasCompleted = existingResult.rows[0]?.status === 'completed';

      await pool.query(`
        INSERT INTO WritingProgress (UserId, LessonId, Score, Status, UpdatedAt)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (UserId, LessonId)
        DO UPDATE SET
          Score = COALESCE(EXCLUDED.Score, WritingProgress.Score),
          Status = EXCLUDED.Status,
          UpdatedAt = NOW()
      `, [req.user.id, lessonId, score, status]);

      const expReward = status === 'completed' && !wasCompleted
        ? await gamificationService.addExp(
          req.user.id,
          EXP_REWARDS.WRITING_LESSON_COMPLETE,
          'writing_lesson_complete'
        )
        : null;

      if (status === 'completed') {
        dailyService.completeMatchingTasks(req.user.id, 'writing_lesson', lessonId).catch((err) => {
          console.error('[daily] failed to complete writing task:', err.message);
        });
      }
        
      return success(res, { message: 'Progress saved', alreadyCompleted: wasCompleted, expReward });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = writingController;
