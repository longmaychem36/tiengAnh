// ============================================
// Speaking Module - Service
// ============================================
const axios = require('axios');
const crypto = require('crypto');

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = process.env.SPEAKING_NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct';
const SPEAKING_AI_TIMEOUT_MS = Number.parseInt(process.env.SPEAKING_AI_TIMEOUT_MS, 10) || 25000;
const SESSION_TTL_MS = 60 * 60 * 1000;
const MAX_SESSIONS_PER_USER = 5;
const LESSON_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_LESSON_CACHE_ITEMS = 80;
const AI_SPEAKING_DAILY_EXP_CAP = 30;
const AI_SPEAKING_LESSON_EXP_CAP = 16;

const personalizedSessions = new Map();
const generatedLessonCache = new Map();
const aiSpeakingExpUsage = new Map();

function cleanupExpiredSessions() {
  const current = Date.now();
  for (const [sessionId, session] of personalizedSessions.entries()) {
    if (session.expiresAt <= current) {
      personalizedSessions.delete(sessionId);
    }
  }
}

function getDailyExpKey(userId, date = new Date()) {
  return `${userId}:${date.toISOString().slice(0, 10)}`;
}

function cleanupDailyExpUsage() {
  const today = new Date().toISOString().slice(0, 10);
  for (const key of aiSpeakingExpUsage.keys()) {
    if (!key.endsWith(`:${today}`)) aiSpeakingExpUsage.delete(key);
  }
}

function limitUserSessions(userId) {
  const sessions = [...personalizedSessions.entries()]
    .filter(([, session]) => session.userId === userId)
    .sort((a, b) => b[1].createdAt - a[1].createdAt);

  sessions.slice(MAX_SESSIONS_PER_USER).forEach(([sessionId]) => {
    personalizedSessions.delete(sessionId);
  });
}

function getLessonCacheKey({ topic, level, questionCount, goal }) {
  return JSON.stringify({
    topic: topic.toLowerCase(),
    level,
    questionCount,
    goal: goal.toLowerCase()
  });
}

function cleanupLessonCache() {
  const current = Date.now();
  for (const [key, item] of generatedLessonCache.entries()) {
    if (item.expiresAt <= current) generatedLessonCache.delete(key);
  }

  if (generatedLessonCache.size <= MAX_LESSON_CACHE_ITEMS) return;

  const entries = [...generatedLessonCache.entries()].sort((a, b) => a[1].createdAt - b[1].createdAt);
  entries.slice(0, generatedLessonCache.size - MAX_LESSON_CACHE_ITEMS).forEach(([key]) => {
    generatedLessonCache.delete(key);
  });
}

function cloneLesson(lesson) {
  return JSON.parse(JSON.stringify(lesson));
}

function stripCodeFence(text) {
  return text
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
}

function parseJsonContent(content) {
  const clean = stripCodeFence(content || '');
  try {
    return JSON.parse(clean);
  } catch (err) {
    const firstJsonObject = extractFirstJsonObject(clean);
    if (firstJsonObject) {
      return JSON.parse(firstJsonObject);
    }
    throw err;
  }
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

    if (depth === 0) {
      return text.slice(start, i + 1);
    }
  }

  return null;
}

function toSafeString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function hasVietnameseMarks(value) {
  const text = toSafeString(value);
  return /[\u0300-\u036f]/.test(text.normalize('NFD')) || /[\u0110\u0111]/.test(text);
}

function isEnglishPracticeText(value) {
  const text = toSafeString(value);
  return text && !hasVietnameseMarks(text);
}

function normalizeCount(value) {
  const count = Number.parseInt(value, 10);
  if (Number.isNaN(count)) return 5;
  return Math.min(Math.max(count, 3), 8);
}

function normalizeLevel(value) {
  const level = toSafeString(value, 'beginner').toLowerCase();
  if (['beginner', 'intermediate', 'advanced'].includes(level)) return level;
  return 'beginner';
}

function getAiSpeakingExp({ level, questionCount, averageScore }) {
  const baseByLevel = {
    beginner: 2,
    intermediate: 3,
    advanced: 4
  };
  const base = baseByLevel[normalizeLevel(level)] || baseByLevel.beginner;
  const safeQuestionCount = Math.min(Math.max(Number.parseInt(questionCount, 10) || 0, 0), 8);
  const score = Math.max(0, Math.min(100, Number(averageScore) || 0));
  const scoreBonus = score >= 90 ? 3 : score >= 80 ? 2 : score >= 70 ? 1 : 0;
  return Math.min(AI_SPEAKING_LESSON_EXP_CAP, Math.max(0, (safeQuestionCount * base) + scoreBonus));
}

function normalizeGeneratedLesson(raw, fallbackTopic, fallbackCount) {
  const sentences = Array.isArray(raw?.sentences) ? raw.sentences : [];
  const normalizedSentences = sentences
    .map((item, index) => {
      const options = Array.isArray(item?.options) ? item.options : [];
      const normalizedOptions = options
        .map((option) => ({
          text: toSafeString(option?.text).slice(0, 260),
          translation: toSafeString(option?.translation).slice(0, 320)
        }))
        .filter((option) => option.text);

      return {
        id: `ai-q-${index + 1}`,
        question: toSafeString(item?.question).slice(0, 240),
        translation: toSafeString(item?.translation).slice(0, 320),
        options: normalizedOptions.slice(0, 3)
      };
    })
    .filter((item) => (
      isEnglishPracticeText(item.question)
      && item.options.length >= 2
      && item.options.every((option) => isEnglishPracticeText(option.text))
    ))
    .slice(0, fallbackCount);

  if (normalizedSentences.length === 0) {
    throw new Error('AI did not return valid speaking questions.');
  }

  return {
    title: toSafeString(raw?.title, `AI Speaking: ${fallbackTopic}`).slice(0, 120),
    description: toSafeString(raw?.description, 'Personalized speaking practice generated by AI.').slice(0, 240),
    sentences: normalizedSentences
  };
}

async function requestGeneratedLesson({ topic, level, questionCount, goal, strictEnglish = false }) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    const err = new Error('NVIDIA_API_KEY is not configured');
    err.statusCode = 500;
    throw err;
  }

  const systemPrompt = [
    'Create natural English speaking role-play drills for Vietnamese learners.',
    'Return JSON only, no markdown.',
    'Shape: {"title":"","description":"","sentences":[{"question":"","translation":"","options":[{"text":"","translation":""}]}]}',
    'question and options.text: English only.',
    'translation fields: Vietnamese only.',
    'Exactly 3 answer options per question.',
    'Use clear everyday vocabulary, common phrases, and short natural clauses.',
    'Use practical role-play situations and avoid unsafe content.'
  ].join(' ');

  const userPrompt = [
    `Topic: ${topic}`,
    `Level: ${level}`,
    `Number of questions: ${questionCount}`,
    goal ? `Learner goal/context: ${goal}` : '',
    'Generate a practical role-play speaking lesson with useful but learner-friendly dialogue turns.',
    'Each English question should be 6-12 words.',
    'Each English answer option should be 7-14 words and include only one common phrase when useful.',
    'Keep the language level appropriate and avoid advanced vocabulary or complex grammar.',
    'Provide a natural Vietnamese translation for every question and every answer option.',
    strictEnglish ? 'Important correction: do not put Vietnamese text in question or options.text. Those fields must be English.' : ''
  ].filter(Boolean).join('\n');

  const maxTokens = Math.min(2200, Math.max(1000, 360 + (questionCount * 220)));

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
        temperature: 0.4,
        top_p: 0.9,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
        stream: false
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: SPEAKING_AI_TIMEOUT_MS
      }
    );
  } catch (err) {
    const status = err.response?.status;
    const detail = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    const apiError = new Error(`NVIDIA generation failed${status ? ` (${status})` : ''}: ${detail}`);
    apiError.statusCode = 502;
    throw apiError;
  }

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('NVIDIA did not return lesson content.');
  }

  return parseJsonContent(content);
}

const speakingService = {
  async createPersonalizedLesson(userId, payload = {}) {
    cleanupExpiredSessions();
    cleanupLessonCache();

    const topic = toSafeString(payload.topic).slice(0, 80);
    const goal = toSafeString(payload.goal).slice(0, 180);
    const level = normalizeLevel(payload.level);
    const questionCount = normalizeCount(payload.questionCount);

    if (!topic) {
      const err = new Error('Topic is required');
      err.statusCode = 400;
      throw err;
    }

    const cacheKey = getLessonCacheKey({ topic, level, questionCount, goal });
    let lesson = generatedLessonCache.has(cacheKey)
      ? cloneLesson(generatedLessonCache.get(cacheKey).lesson)
      : null;
    let lastError;

    if (!lesson) {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const rawLesson = await requestGeneratedLesson({
            topic,
            level,
            questionCount,
            goal,
            strictEnglish: attempt > 0
          });
          lesson = normalizeGeneratedLesson(rawLesson, topic, questionCount);
          generatedLessonCache.set(cacheKey, {
            lesson: cloneLesson(lesson),
            createdAt: Date.now(),
            expiresAt: Date.now() + LESSON_CACHE_TTL_MS
          });
          break;
        } catch (err) {
          lastError = err;
        }
      }
    }

    if (!lesson) {
      throw lastError || new Error('AI did not return a valid lesson.');
    }

    const sessionId = crypto.randomUUID();
    const createdAt = Date.now();

    const session = {
      sessionId,
      userId,
      lesson: {
        id: sessionId,
        type: 'personalized',
        topic,
        level,
        title: lesson.title,
        description: lesson.description
      },
      sentences: lesson.sentences,
      createdAt,
      expiresAt: createdAt + SESSION_TTL_MS
    };

    personalizedSessions.set(sessionId, session);
    limitUserSessions(userId);

    return {
      sessionId,
      lesson: session.lesson,
      sentences: session.sentences,
      expiresAt: new Date(session.expiresAt).toISOString()
    };
  },

  getPersonalizedLesson(userId, sessionId) {
    cleanupExpiredSessions();

    const session = personalizedSessions.get(sessionId);
    if (!session || session.userId !== userId) {
      const err = new Error('Personalized lesson not found or expired');
      err.statusCode = 404;
      throw err;
    }

    return {
      sessionId,
      lesson: session.lesson,
      sentences: session.sentences,
      expiresAt: new Date(session.expiresAt).toISOString()
    };
  },

  completePersonalizedLesson(userId, sessionId, payload = {}) {
    cleanupExpiredSessions();
    cleanupDailyExpUsage();

    const session = personalizedSessions.get(sessionId);
    if (!session || session.userId !== userId) {
      const err = new Error('Personalized lesson not found or expired');
      err.statusCode = 404;
      throw err;
    }

    if (session.expAwarded) {
      return {
        lesson: session.lesson,
        alreadyRewarded: true,
        expAmount: 0,
        dailyRemaining: Math.max(0, AI_SPEAKING_DAILY_EXP_CAP - (aiSpeakingExpUsage.get(getDailyExpKey(userId)) || 0))
      };
    }

    const averageScore = Number(payload.averageScore || 0);
    const questionCount = Number(payload.questionCount || session.sentences.length || 0);
    const requestedExp = getAiSpeakingExp({
      level: session.lesson.level,
      questionCount,
      averageScore
    });
    const dailyKey = getDailyExpKey(userId);
    const usedToday = aiSpeakingExpUsage.get(dailyKey) || 0;
    const availableToday = Math.max(0, AI_SPEAKING_DAILY_EXP_CAP - usedToday);
    const expAmount = Math.min(requestedExp, availableToday);

    session.expAwarded = true;
    session.expAwardedAt = Date.now();
    session.expAmount = expAmount;
    aiSpeakingExpUsage.set(dailyKey, usedToday + expAmount);

    return {
      lesson: session.lesson,
      alreadyRewarded: false,
      expAmount,
      dailyRemaining: Math.max(0, availableToday - expAmount)
    };
  }
};

module.exports = speakingService;
