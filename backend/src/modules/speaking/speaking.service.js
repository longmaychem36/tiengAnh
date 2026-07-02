// ============================================
// Speaking Module - Service
// Stateless AI conversation flow for users with an active Plus plan
// ============================================
const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/jwt');

const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.SPEAKING_OPENAI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';
const SPEAKING_AI_TIMEOUT_MS = Number.parseInt(process.env.SPEAKING_AI_TIMEOUT_MS, 10) || 60000;
const CONVERSATION_TOKEN_TTL = '24h';
const CONVERSATION_TTL_MS = 24 * 60 * 60 * 1000;
const SHORT_CONVERSATION_TURNS = 5;
const LONG_CONVERSATION_TURNS = 10;
const MIN_CONVERSATION_TURNS = SHORT_CONVERSATION_TURNS;
const MAX_CONVERSATION_TURNS = LONG_CONVERSATION_TURNS;
const MAX_HISTORY_MESSAGES = (MAX_CONVERSATION_TURNS * 2) + 1;
const DEFAULT_COMPLETION_SUMMARY = 'Bạn đã hoàn thành cuộc hội thoại.';

function serviceError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toSafeString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function getValueAtPath(source, path) {
  return path.split('.').reduce((current, segment) => {
    if (!current || typeof current !== 'object') return undefined;
    return current[segment];
  }, source);
}

function pickFirstString(source, paths = []) {
  for (const path of paths) {
    const value = getValueAtPath(source, path);
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function pickFirstArray(source, paths = []) {
  for (const path of paths) {
    const value = getValueAtPath(source, path);
    if (Array.isArray(value)) return value;
  }
  return [];
}

function hasVietnameseMarks(value) {
  const text = toSafeString(value);
  return /[\u0300-\u036f]/.test(text.normalize('NFD')) || /[\u0110\u0111]/.test(text);
}

function isEnglishPracticeText(value) {
  const text = toSafeString(value);
  return Boolean(text) && !hasVietnameseMarks(text);
}

function isPlaceholderEnglish(value) {
  const normalized = toSafeString(value).toLowerCase();
  return [
    'english ai reply',
    'ai reply',
    'assistant reply',
    'english learner reply',
    'learner reply',
    'reply option 1',
    'reply option 2',
    'reply option 3'
  ].includes(normalized);
}

function normalizeLevel(value) {
  const level = toSafeString(value, 'beginner').toLowerCase();
  if (level === 'advanced') return 'intermediate';
  return ['beginner', 'intermediate'].includes(level) ? level : 'beginner';
}

function normalizeTargetTurns(value) {
  const raw = toSafeString(value).toLowerCase();
  if (raw === 'long' || raw === '10') return LONG_CONVERSATION_TURNS;
  if (raw === 'short' || raw === '5') return SHORT_CONVERSATION_TURNS;

  const numeric = Number.parseInt(value, 10);
  if (numeric === LONG_CONVERSATION_TURNS) return LONG_CONVERSATION_TURNS;
  return SHORT_CONVERSATION_TURNS;
}

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

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (start === -1) {
      if (char === '{') {
        start = index;
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
    if (depth === 0) return text.slice(start, index + 1);
  }
  return null;
}

function parseJsonContent(content) {
  const clean = stripCodeFence(content);
  try {
    return JSON.parse(clean);
  } catch (error) {
    const firstObject = extractFirstJsonObject(clean);
    if (firstObject) return JSON.parse(firstObject);
    throw error;
  }
}

function parseHistory(value) {
  let source = value;
  if (typeof source === 'string') {
    try {
      source = JSON.parse(source);
    } catch {
      throw serviceError('Conversation history is invalid');
    }
  }
  if (!Array.isArray(source) || source.length === 0 || source.length > MAX_HISTORY_MESSAGES) {
    throw serviceError('Conversation history is invalid');
  }
  return source.map(normalizeHistoryMessage);
}

function normalizeHistoryMessage(message = {}) {
  const role = message.role === 'learner' ? 'learner' : message.role === 'assistant' ? 'assistant' : '';
  const text = toSafeString(message.text).slice(0, 500);
  if (!role || !text) throw serviceError('Conversation message is invalid');

  const normalized = {
    id: toSafeString(message.id).slice(0, 80),
    role,
    text,
    translation: toSafeString(message.translation).slice(0, 600)
  };

  if (role === 'learner') {
    normalized.transcript = toSafeString(message.transcript).slice(0, 600);
    normalized.score = Math.max(0, Math.min(100, Math.round(Number(message.score) || 0)));
    normalized.feedback = toSafeString(message.feedback).slice(0, 600);
    normalized.missingWords = Array.isArray(message.missingWords)
      ? message.missingWords.map((item) => toSafeString(item).slice(0, 60)).filter(Boolean).slice(0, 5)
      : [];
    normalized.extraWords = Array.isArray(message.extraWords)
      ? message.extraWords.map((item) => toSafeString(item).slice(0, 60)).filter(Boolean).slice(0, 5)
      : [];
  }

  return normalized;
}

function canonicalHistory(history) {
  return JSON.stringify(history.map(normalizeHistoryMessage));
}

function hashHistory(history) {
  return crypto.createHash('sha256').update(canonicalHistory(history)).digest('base64url');
}

function normalizeOption(option = {}, index = 0, statusCode = 400) {
  const normalized = {
    id: toSafeString(option.id, `option-${index + 1}`).slice(0, 80),
    text: pickFirstString(option, [
      'text',
      'message',
      'reply',
      'option',
      'content',
      'line'
    ]).slice(0, 280),
    translation: pickFirstString(option, [
      'translation',
      'vi',
      'vietnamese',
      'meaning',
      'gloss'
    ]).slice(0, 360)
  };
  if (!isEnglishPracticeText(normalized.text) || isPlaceholderEnglish(normalized.text)) {
    throw serviceError('Reply must contain valid English text', statusCode);
  }
  return normalized;
}

function hashOption(option) {
  const normalized = normalizeOption(option);
  return crypto.createHash('sha256')
    .update(JSON.stringify(normalized))
    .digest('base64url');
}

function normalizeAiTurn(raw, { canComplete = false, forceComplete = false } = {}) {
  const message = pickFirstString(raw, [
    'message',
    'text',
    'reply',
    'response',
    'assistant',
    'assistantMessage',
    'ai',
    'content',
    'line'
  ]).slice(0, 500);
  const translation = pickFirstString(raw, [
    'translation',
    'messageTranslation',
    'responseTranslation',
    'assistantTranslation',
    'vi',
    'vietnamese',
    'meaning',
    'assistant.translation',
    'ai.translation',
    'messageMeta.translation'
  ]).slice(0, 600);
  if (!isEnglishPracticeText(message) || isPlaceholderEnglish(message)) {
    throw serviceError('AI did not return a valid English message', 502);
  }

  const isComplete = Boolean(forceComplete || (canComplete && raw?.isComplete === true));
  const options = isComplete
    ? []
    : pickFirstArray(raw, ['options', 'replies', 'choices', 'answers', 'suggestions'])
      .map((option, index) => normalizeOption({
        ...(typeof option === 'string' ? { text: option } : option),
        ...option,
        id: `option-${index + 1}`
      }, index, 502))
      .slice(0, 3);

  if (!isComplete && options.length !== 3) {
    throw serviceError('AI must return exactly three reply options', 502);
  }

  return {
    message,
    translation: translation && hasVietnameseMarks(translation) ? translation : '',
    options,
    isComplete,
    summary: isComplete && hasVietnameseMarks(toSafeString(raw?.summary))
      ? toSafeString(raw.summary).slice(0, 700)
      : isComplete ? 'Bạn đã hoàn thành cuộc hội thoại.' : ''
  };
}

function signConversationToken(payload, expiresIn = CONVERSATION_TOKEN_TTL) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verifyConversationToken(token, expectedType, userId, sessionId) {
  if (!token) throw serviceError('Conversation token is required', 400);
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw serviceError(error.name === 'TokenExpiredError'
      ? 'Conversation has expired'
      : 'Conversation token is invalid', 410);
  }

  if (decoded.tokenType !== expectedType
    || String(decoded.userId) !== String(userId)
    || String(decoded.sessionId) !== String(sessionId)) {
    throw serviceError('Conversation token does not match this session', 403);
  }
  return decoded;
}

function assertHistory(historyValue, expectedHash) {
  const history = parseHistory(historyValue);
  if (hashHistory(history) !== expectedHash) {
    throw serviceError('Conversation history was changed or is out of date', 409);
  }
  return history;
}

function buildLevelGuidance(level) {
  if (level === 'beginner') {
    return [
      'Treat the learner as an absolute beginner.',
      'Use only very easy everyday English.',
      'Prefer short sentences of about 3 to 7 words.',
      'Use simple patterns like I want, I need, I like, Can I, Where is, It is.',
      'Avoid idioms, slang, phrasal verbs, long clauses, and advanced verb tenses.',
      'Make each reply easy to hear, repeat, and pronounce for a new learner.'
    ].join(' ');
  }
  if (level === 'intermediate') {
    return [
      'Use easy everyday English that is only slightly harder than beginner.',
      'Prefer short sentences of about 5 to 9 words.',
      'Use simple present, simple past, can, want, like, because, and very common adjectives.',
      'Avoid idioms, slang, long clauses, advanced tenses, and uncommon vocabulary.',
      'The learner should still be able to repeat each sentence after hearing it once.'
    ].join(' ');
  }
  return buildLevelGuidance('beginner');
}

function buildSystemPrompt({ topic, level, canComplete, forceComplete, targetTurns = SHORT_CONVERSATION_TURNS }) {
  const normalizedTargetTurns = normalizeTargetTurns(targetTurns);
  const endingRule = forceComplete
    ? `This is the final turn because the learner has completed ${normalizedTargetTurns} replies. Close the situation naturally. Set isComplete to true and return no options.`
    : canComplete
      ? 'You may close the conversation only if the situation has reached a natural conclusion. Otherwise continue with exactly 3 options.'
      : 'The conversation must continue. Set isComplete to false and return exactly 3 options.';

  return [
    'You are Lingo Coach, the other participant in a natural English role-play with a Vietnamese learner.',
    `Role-play topic: ${topic}.`,
    `Target length: ${normalizedTargetTurns} learner replies before the final closing message.`,
    'Continue one coherent conversation. Remember facts, requests, and choices from earlier turns; never reset the scene or produce unrelated drills.',
    'Your next message must directly answer the learner\'s most recent reply in the chat history and stay in the same situation unless the history clearly changes it.',
    `Learner level: ${level}. Keep vocabulary, grammar, and sentence length appropriate for that level.`,
    buildLevelGuidance(level),
    endingRule,
    'Return JSON only with shape:',
    '{"message":"Would you like to pay by cash or card?","options":[{"text":"I can pay by card."},{"text":"I only have cash with me."},{"text":"How much is it altogether?"}],"isComplete":false,"summary":"Tóm tắt bằng tiếng Việt chỉ khi hoàn thành"}.',
    'message and options.text must be English.',
    'Do not include Vietnamese translations for message or options.',
    'Never output placeholders or labels such as "English AI reply" or "English learner reply".',
    'For a continuing turn return exactly 3 distinct, natural learner replies that lead to meaningfully different next directions.',
    'For a completed turn return options as an empty array.',
    'Keep each reply concise and conversational. Avoid unsafe, sexual, hateful, illegal, or self-harm content.'
  ].join(' ');
}

function historyForModel(history) {
  return history.map((message) => ({
    role: message.role === 'assistant' ? 'assistant' : 'user',
    content: message.text
  }));
}

async function requestAiTurn({ topic, level, targetTurns = SHORT_CONVERSATION_TURNS, history = [], canComplete = false, forceComplete = false, strict = false }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw serviceError('OPENAI_API_KEY is not configured', 500);

  const modelMessages = [
    { role: 'system', content: buildSystemPrompt({ topic, level, canComplete, forceComplete, targetTurns }) }
  ];

  if (history.length === 0) {
    modelMessages.push({
      role: 'user',
      content: [
        `Start a role-play about: ${topic}.`,
        `Plan this as a ${targetTurns}-reply learner conversation.`,
        'Infer useful roles for you and the learner, then speak first.',
        'Do not finish in the opening turn. Return exactly 3 learner reply options.',
        strict ? 'Correction: follow the JSON shape exactly and keep all English fields free of Vietnamese text.' : ''
      ].filter(Boolean).join(' ')
    });
  } else {
    modelMessages.push(...historyForModel(history));
    const lastLearnerText = [...history].reverse().find((message) => message.role === 'learner')?.text;
    if (lastLearnerText) {
      modelMessages.push({
        role: 'system',
        content: `Answer this learner reply directly and keep the same context: "${lastLearnerText}".`
      });
    }
    if (strict) {
      modelMessages.push({
        role: 'system',
        content: 'Correction: answer the learner now, follow the JSON shape and completion rule exactly, do not repeat the previous message, and do not use placeholders.'
      });
    }
  }

  let response;
  try {
    response = await axios.post(
      `${OPENAI_BASE_URL}/chat/completions`,
      {
        model: OPENAI_MODEL,
        messages: modelMessages,
        temperature: level === 'beginner' ? 0.45 : 0.65,
        top_p: 0.9,
        max_tokens: 900,
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
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data?.error?.message || error.response?.data?.message || error.message;
    throw serviceError(`OpenAI generation failed${status ? ` (${status})` : ''}: ${detail}`, 502);
  }

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) throw serviceError('OpenAI did not return conversation content', 502);
  return parseJsonContent(content);
}

async function generateValidatedTurn(parameters) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const raw = await requestAiTurn({ ...parameters, strict: attempt > 0 });
      return normalizeAiTurn(raw, parameters);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || serviceError('AI did not return a valid conversation turn', 502);
}

function buildAssistantMessage(turn) {
  return normalizeHistoryMessage({
    id: `ai-${crypto.randomUUID()}`,
    role: 'assistant',
    text: turn.message,
    translation: turn.translation
  });
}

function tokenOptions(options) {
  return options.map((option) => ({
    id: option.id,
    hash: hashOption(option)
  }));
}

const speakingService = {
  async createPersonalizedLesson(userId, payload = {}) {
    const topic = toSafeString(payload.topic).slice(0, 100);
    const level = normalizeLevel(payload.level);
    const targetTurns = normalizeTargetTurns(payload.targetTurns || payload.length || payload.conversationLength);
    if (!topic) throw serviceError('Topic is required');

    const turn = await generateValidatedTurn({
      topic,
      level,
      targetTurns,
      history: [],
      canComplete: false,
      forceComplete: false
    });
    const sessionId = crypto.randomUUID();
    const assistantMessage = buildAssistantMessage(turn);
    const history = [assistantMessage];
    const expiresAt = new Date(Date.now() + CONVERSATION_TTL_MS).toISOString();
    const stateToken = signConversationToken({
      tokenType: 'state',
      userId,
      sessionId,
      topic,
      level,
      targetTurns,
      turnCount: 0,
      scoreTotal: 0,
      historyHash: hashHistory(history),
      currentTurnId: assistantMessage.id,
      optionHashes: tokenOptions(turn.options),
      status: 'ready'
    });

    return {
      sessionId,
      topic,
      level,
      targetTurns,
      phase: 'ready',
      messages: history,
      currentTurn: {
        id: assistantMessage.id,
        options: turn.options
      },
danh      expiresAt
    };
  },

  analyzeConversationTurn(userId, sessionId, payload = {}, analysis = {}) {
    const state = verifyConversationToken(payload.stateToken, 'state', userId, sessionId);
    if (state.status !== 'ready') throw serviceError('Conversation is not ready for recording', 409);
    const history = assertHistory(payload.history, state.historyHash);

    let selectedOption = payload.option;
    if (typeof selectedOption === 'string') {
      try {
        selectedOption = JSON.parse(selectedOption);
      } catch {
        throw serviceError('Selected reply is invalid');
      }
    }
    const normalizedOption = normalizeOption(selectedOption);
    const expectedOption = (state.optionHashes || []).find((item) => item.id === normalizedOption.id);
    if (!expectedOption || expectedOption.hash !== hashOption(normalizedOption)) {
      throw serviceError('Selected reply does not belong to the current turn', 409);
    }

    const score = Math.max(0, Math.min(100, Math.round(Number(analysis.score) || 0)));
    const passThreshold = Math.max(50, Math.min(100, Number.parseInt(payload.passThreshold, 10) || 60));
    const result = {
      score,
      passed: score >= passThreshold,
      transcript: toSafeString(analysis.transcript).slice(0, 600),
      feedback: toSafeString(analysis.feedback).slice(0, 600),
      matchedText: normalizedOption.text,
      missingWords: Array.isArray(analysis.missingWords) ? analysis.missingWords.slice(0, 5) : [],
      extraWords: Array.isArray(analysis.extraWords) ? analysis.extraWords.slice(0, 5) : []
    };

    if (!result.passed) return { ...result, stateToken: payload.stateToken };

    const learnerMessage = normalizeHistoryMessage({
      id: `learner-${crypto.randomUUID()}`,
      role: 'learner',
      text: normalizedOption.text,
      translation: normalizedOption.translation,
      transcript: result.transcript,
      score: result.score,
      feedback: result.feedback,
      missingWords: result.missingWords,
      extraWords: result.extraWords
    });
    const nextHistory = [...history, learnerMessage];
    const turnCount = Number(state.turnCount || 0) + 1;
    const scoreTotal = Number(state.scoreTotal || 0) + result.score;
    const targetTurns = normalizeTargetTurns(state.targetTurns);

    if (turnCount >= targetTurns) {
      const stateToken = signConversationToken({
        tokenType: 'state',
        userId,
        sessionId,
        topic: state.topic,
        level: state.level,
        targetTurns,
        turnCount,
        scoreTotal,
        historyHash: hashHistory(nextHistory),
        currentTurnId: '',
        optionHashes: [],
        status: 'completed'
      });

      return {
        ...result,
        learnerMessage,
        stateToken,
        completed: true,
        summary: DEFAULT_COMPLETION_SUMMARY,
        turnCount,
        targetTurns,
        averageScore: Math.round(scoreTotal / turnCount)
      };
    }

    const advanceToken = signConversationToken({
      tokenType: 'advance',
      userId,
      sessionId,
      topic: state.topic,
      level: state.level,
      targetTurns,
      turnCount,
      scoreTotal,
      historyHash: hashHistory(nextHistory),
      status: 'awaiting_ai'
    });

    return { ...result, learnerMessage, advanceToken, completed: false, turnCount, targetTurns };
  },

  async generateNextConversationTurn(userId, sessionId, payload = {}) {
    const advance = verifyConversationToken(payload.advanceToken, 'advance', userId, sessionId);
    const history = assertHistory(payload.history, advance.historyHash);
    if (history[history.length - 1]?.role !== 'learner') {
      throw serviceError('Conversation must end with the learner reply before AI can continue', 409);
    }

    const turnCount = Number(advance.turnCount || 0);
    const targetTurns = normalizeTargetTurns(advance.targetTurns);
    const forceComplete = turnCount >= targetTurns;
    const canComplete = turnCount >= targetTurns;

    if (forceComplete) {
      const stateToken = signConversationToken({
        tokenType: 'state',
        userId,
        sessionId,
        topic: advance.topic,
        level: advance.level,
        targetTurns,
        turnCount,
        scoreTotal: Number(advance.scoreTotal || 0),
        historyHash: hashHistory(history),
        currentTurnId: '',
        optionHashes: [],
        status: 'completed'
      });

      return {
        assistantMessage: null,
        currentTurn: null,
        stateToken,
        completed: true,
        summary: DEFAULT_COMPLETION_SUMMARY,
        turnCount,
        targetTurns,
        averageScore: turnCount > 0
          ? Math.round(Number(advance.scoreTotal || 0) / turnCount)
          : 0
      };
    }

    const turn = await generateValidatedTurn({
      topic: advance.topic,
      level: normalizeLevel(advance.level),
      targetTurns,
      history,
      canComplete,
      forceComplete
    });
    const assistantMessage = buildAssistantMessage(turn);
    const nextHistory = [...history, assistantMessage];
    const completed = turn.isComplete || forceComplete;
    const stateToken = signConversationToken({
      tokenType: 'state',
      userId,
      sessionId,
      topic: advance.topic,
      level: advance.level,
      targetTurns,
      turnCount,
      scoreTotal: Number(advance.scoreTotal || 0),
      historyHash: hashHistory(nextHistory),
      currentTurnId: assistantMessage.id,
      optionHashes: completed ? [] : tokenOptions(turn.options),
      status: completed ? 'completed' : 'ready'
    });

    return {
      assistantMessage,
      currentTurn: completed ? null : { id: assistantMessage.id, options: turn.options },
      stateToken,
      completed,
      summary: completed && /[ÃÂÄ]/.test(turn.summary || '')
        ? DEFAULT_COMPLETION_SUMMARY
        : turn.summary,
      turnCount,
      targetTurns,
      averageScore: turnCount > 0
        ? Math.round(Number(advance.scoreTotal || 0) / turnCount)
        : 0
    };
  }
};

module.exports = speakingService;
module.exports._internals = {
  MIN_CONVERSATION_TURNS,
  MAX_CONVERSATION_TURNS,
  SHORT_CONVERSATION_TURNS,
  LONG_CONVERSATION_TURNS,
  normalizeTargetTurns,
  normalizeAiTurn,
  buildSystemPrompt,
  normalizeHistoryMessage,
  normalizeOption,
  hashHistory,
  hashOption,
  signConversationToken,
  verifyConversationToken
};
