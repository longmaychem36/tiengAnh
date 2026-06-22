const crypto = require('crypto');
const { getPool } = require('../../config/database');
const { ensureOnboardingSchema } = require('./onboarding.schema');

const DIRECT_PLACEMENT = new Set(['new', 'basic']);
const PASS_SCORE = 70;
const DEFAULT_QUESTION_WEIGHT = 1;
const FOUNDATION_QUESTION_WEIGHT = 1;
const MAIN_ROUTE_QUESTION_WEIGHT = 1.35;
const SPEAKING_PASS_SCORE = 60;
const WRITING_PASS_SCORE = 80;
const SKILL_ORDER = ['listening', 'speaking', 'reading', 'writing'];
const SOURCE_TYPES = ['foundation', 'main'];
const PLACEMENT_TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000;

const RECEPTIVE_CONFIG = {
  listening: {
    lessonTable: 'ListeningLessons',
    contentTable: 'ListeningSegments',
    questionTable: 'ListeningQuestions'
  },
  reading: {
    lessonTable: 'ReadingLessons',
    contentTable: 'ReadingParagraphs',
    questionTable: 'ReadingQuestions'
  }
};

const SKILL_TABLES = {
  listening: { lessonTable: 'ListeningLessons', itemTable: 'ListeningQuestions' },
  speaking: { lessonTable: 'SpeakingLessons', itemTable: 'SpeakingQuestions' },
  reading: { lessonTable: 'ReadingLessons', itemTable: 'ReadingQuestions' },
  writing: { lessonTable: 'WritingLessons', itemTable: 'WritingExercises' }
};

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitAcceptedAnswers(value) {
  return String(value || '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseQuestionPayload(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return {};
  }
}

function mapUserPlacement(row = {}) {
  return {
    onboardingCompleted: Boolean(row.onboardingcompleted),
    placementLevel: row.placementlevel || null,
    placementSource: row.placementsource || null,
    placementCompletedAt: row.placementcompletedat || null
  };
}

function parseOptions(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : parsed;
  } catch (err) {
    return [];
  }
}

function mapQuestion(row = {}, includeAnswer = false) {
  const options = Array.isArray(row.options || row.Options)
    ? (row.options || row.Options)
    : [row.optiona || row.optionA, row.optionb || row.optionB, row.optionc || row.optionC, row.optiond || row.optionD].filter(Boolean);

  const question = {
    id: row.id,
    testId: row.testid || row.testId,
    questionType: row.questiontype || row.questionType || 'multiple_choice',
    skill: row.skill || 'minigame',
    difficulty: row.difficulty || 'easy',
    weight: Number(row.weight || row.pointratio || row.pointRatio || DEFAULT_QUESTION_WEIGHT),
    pointRatio: Number(row.pointratio || row.pointRatio || row.weight || DEFAULT_QUESTION_WEIGHT),
    contextText: row.contexttext || row.contextText || row.contenten || row.contentEN || row.ContentEN || '',
    prompt: row.prompt || '',
    contentEN: row.contenten || row.contentEN || row.ContentEN || '',
    contentVI: row.contentvi || row.contentVI || row.ContentVI || '',
    audioUrl: row.audiourl || row.audioUrl || row.AudioUrl || '',
    imageUrl: row.imageurl || row.imageUrl || row.ImageUrl || '',
    options,
    optionA: row.optiona || row.optionA || options[0] || '',
    optionB: row.optionb || row.optionB || options[1] || '',
    optionC: row.optionc || row.optionC || options[2] || '',
    optionD: row.optiond || row.optionD || options[3] || '',
    explanation: row.explanation || '',
    sourceSkill: row.sourceskill || row.sourceSkill || 'minigame-placement',
    sourceQuestionId: row.sourcequestionid || row.sourceQuestionId || row.id || '',
    sourceLessonId: row.sourcelessonid || row.sourceLessonId || 'placement-minigame',
    sourceLessonTitle: row.sourcelessontitle || row.sourceLessonTitle || 'Bài test đầu vào',
    sourceLessonType: row.sourcelessontype || row.sourceLessonType || 'placement-minigame',
    payload: parseQuestionPayload(row.questionpayload || row.questionPayload || row.payload),
    orderIndex: Number(row.orderindex || row.orderIndex || 0)
  };

  if (includeAnswer) {
    question.correctAnswer = row.correctanswer || row.correctAnswer || '';
    question.acceptedAnswers = row.acceptedanswers || row.acceptedAnswers || '';
  }

  return question;
}

function correctAnswersFor(question) {
  const answers = [
    question.correctanswer || question.correctAnswer,
    ...splitAcceptedAnswers(question.acceptedanswers || question.acceptedAnswers)
  ].filter(Boolean);

  const key = normalizeText(question.correctanswer || question.correctAnswer);
  const optionByKey = {
    a: question.optiona || question.optionA,
    b: question.optionb || question.optionB,
    c: question.optionc || question.optionC,
    d: question.optiond || question.optionD
  };

  if (optionByKey[key]) answers.push(optionByKey[key]);
  return [...new Set(answers.map(normalizeText).filter(Boolean))];
}

function normalizeSentence(value) {
  return normalizeText(value).replace(/[.,!?]/g, '');
}

function getNumericScoreAnswer(answer) {
  if (answer && typeof answer === 'object') {
    const value = Number(answer.score ?? answer.Score ?? answer.averageScore ?? answer.AverageScore);
    return Number.isFinite(value) ? value : null;
  }

  const text = String(answer ?? '').trim();
  if (!text) return null;

  try {
    return getNumericScoreAnswer(JSON.parse(text));
  } catch (err) {
    const value = Number(text);
    return Number.isFinite(value) ? value : null;
  }
}

function getPassScore(question) {
  const payload = parseQuestionPayload(question.questionpayload || question.questionPayload || question.payload);
  const configured = Number(payload.passScore);
  if (Number.isFinite(configured)) return configured;
  const questionType = question.questiontype || question.questionType;
  if (questionType === 'writing_check') return WRITING_PASS_SCORE;
  if (questionType === 'speaking_record') return SPEAKING_PASS_SCORE;
  if (questionType === 'speakrepeat') return 70;
  return PASS_SCORE;
}

function isAnswerCorrect(question, answer) {
  const questionType = question.questiontype || question.questionType;
  if (questionType === 'speaking_record' || questionType === 'writing_check' || questionType === 'speakrepeat') {
    const score = getNumericScoreAnswer(answer);
    return score !== null && score >= getPassScore(question);
  }

  const normalizedAnswer = normalizeText(answer);
  if (!normalizedAnswer) return false;

  if (questionType === 'matching') {
    return normalizedAnswer === normalizeText(question.contentvi || question.contentVI || question.ContentVI);
  }

  if (questionType === 'listenbuild') {
    return normalizeSentence(answer) === normalizeSentence(question.correctanswer || question.correctAnswer || question.contenten || question.contentEN || question.ContentEN);
  }

  if (questionType === 'listening' || questionType === 'truefalse') {
    return normalizedAnswer === normalizeText(question.correctanswer || question.correctAnswer);
  }

  return correctAnswersFor(question).includes(normalizedAnswer);
}

function getWeightForSourceType(sourceType) {
  return sourceType === 'main' ? MAIN_ROUTE_QUESTION_WEIGHT : FOUNDATION_QUESTION_WEIGHT;
}

function getDifficultyForSourceType(sourceType) {
  return sourceType === 'main' ? 'hard' : 'easy';
}

function getSourceLabel(sourceType) {
  return sourceType === 'main' ? 'lộ trình chính' : 'nền tảng';
}

function getPlacementTokenSecret() {
  return process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || process.env.SESSION_SECRET || 'placement-dev-secret';
}

function getPlacementTokenKey() {
  return crypto.createHash('sha256').update(getPlacementTokenSecret()).digest();
}

function signPlacementPayload(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getPlacementTokenKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString('base64url'),
    authTag.toString('base64url'),
    encrypted.toString('base64url')
  ].join('.');
}

function readPlacementPayload(token, userId) {
  const [ivText, authTagText, encryptedText] = String(token || '').split('.');
  if (!ivText || !authTagText || !encryptedText) {
    const err = new Error('Placement attempt is invalid');
    err.statusCode = 400;
    throw err;
  }

  let payload;
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      getPlacementTokenKey(),
      Buffer.from(ivText, 'base64url')
    );
    decipher.setAuthTag(Buffer.from(authTagText, 'base64url'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'base64url')),
      decipher.final()
    ]);
    payload = JSON.parse(decrypted.toString('utf8'));
  } catch (error) {
    const err = new Error('Placement attempt is invalid');
    err.statusCode = 400;
    throw err;
  }

  if (String(payload.userId) !== String(userId)) {
    const err = new Error('Placement attempt does not belong to this user');
    err.statusCode = 403;
    throw err;
  }

  if (Date.now() - Number(payload.issuedAt || 0) > PLACEMENT_TOKEN_MAX_AGE_MS) {
    const err = new Error('Placement attempt has expired');
    err.statusCode = 400;
    throw err;
  }

  return payload;
}

function buildQuestion({
  skill,
  sourceType,
  lesson,
  row,
  questionType,
  prompt,
  contextText,
  options = [],
  correctAnswer,
  acceptedAnswers,
  explanation,
  payload = {},
  orderIndex
}) {
  const safeOptions = options.filter(Boolean).slice(0, 4);
  const safeAnswer = String(correctAnswer || '');

  return {
    questionType,
    skill,
    difficulty: getDifficultyForSourceType(sourceType),
    weight: getWeightForSourceType(sourceType),
    contextText: contextText || '',
    prompt: prompt || '',
    optionA: safeOptions[0] || '',
    optionB: safeOptions[1] || '',
    optionC: safeOptions[2] || '',
    optionD: safeOptions[3] || '',
    correctAnswer: safeAnswer,
    acceptedAnswers: acceptedAnswers || (questionType === 'fill_blank' || questionType === 'short_answer' ? safeAnswer : ''),
    explanation: explanation || '',
    sourceSkill: skill,
    sourceQuestionId: row?.id || '',
    sourceLessonId: lesson.id,
    sourceLessonTitle: lesson.title || '',
    sourceLessonType: sourceType,
    questionPayload: payload,
    orderIndex
  };
}

function getTrueFalseAnswer(row = {}) {
  if (row.correctboolean !== null && row.correctboolean !== undefined) {
    return Boolean(row.correctboolean) ? 'true' : 'false';
  }
  return normalizeText(row.correctanswer) === 'true' ? 'true' : 'false';
}

function mapReceptiveQuestion(skill, sourceType, lesson, contextText, row, index) {
  const questionType = row.questiontype || 'multiple_choice';
  const correctAnswer = questionType === 'true_false'
    ? getTrueFalseAnswer(row)
    : row.correctanswer || '';

  return buildQuestion({
    skill,
    sourceType,
    lesson,
    row,
    questionType,
    prompt: row.prompt || '',
    contextText,
    options: questionType === 'true_false'
      ? []
      : [row.optiona, row.optionb, row.optionc, row.optiond],
    correctAnswer,
    acceptedAnswers: questionType === 'fill_blank' || questionType === 'short_answer'
      ? row.acceptedanswers || correctAnswer
      : '',
    explanation: row.explanation || '',
    orderIndex: index + 1
  });
}

function mapSpeakingQuestion(sourceType, lesson, row, index) {
  const optionItems = [
    { text: row.option1, translation: row.option1vi },
    { text: row.option2, translation: row.option2vi },
    { text: row.option3, translation: row.option3vi }
  ].filter((item) => item.text);
  const options = optionItems.map((item) => item.text);
  const correctAnswer = options[0] || row.sampleanswer || '';

  return buildQuestion({
    skill: 'speaking',
    sourceType,
    lesson,
    row,
    questionType: 'speaking_record',
    prompt: row.question || '',
    contextText: row.translation || '',
    options,
    correctAnswer,
    acceptedAnswers: '',
    explanation: row.translation || '',
    payload: {
      questionTranslation: row.translation || '',
      options: optionItems,
      passScore: SPEAKING_PASS_SCORE
    },
    orderIndex: index + 1
  });
}

function mapWritingQuestion(sourceType, lesson, row, index) {
  const lessonContext = [lesson.passagevi, lesson.passageen].filter(Boolean).join('\n\n');

  return buildQuestion({
    skill: 'writing',
    sourceType,
    lesson,
    row,
    questionType: 'writing_check',
    prompt: row.contentvi || 'Write the sentence in English.',
    contextText: lessonContext,
    correctAnswer: row.correctansweren || '',
    acceptedAnswers: row.correctansweren || '',
    explanation: row.correctansweren || '',
    payload: {
      contentVI: row.contentvi || '',
      targetText: row.correctansweren || '',
      passageEN: lesson.passageen || '',
      passageVI: lesson.passagevi || '',
      passScore: WRITING_PASS_SCORE
    },
    orderIndex: index + 1
  });
}

async function getUserPlacement(pool, userId) {
  const result = await pool.query(`
    SELECT OnboardingCompleted, PlacementLevel, PlacementSource, PlacementCompletedAt
    FROM Users
    WHERE Id = $1
  `, [userId]);
  return mapUserPlacement(result.rows[0]);
}

async function updatePlacement(pool, userId, placementLevel, placementSource) {
  const result = await pool.query(`
    UPDATE Users
    SET OnboardingCompleted = true,
        PlacementLevel = $1,
        PlacementSource = $2,
        PlacementCompletedAt = NOW()
    WHERE Id = $3
    RETURNING OnboardingCompleted, PlacementLevel, PlacementSource, PlacementCompletedAt
  `, [placementLevel, placementSource, userId]);
  return mapUserPlacement(result.rows[0]);
}

async function hasLessonsForSource(pool, skill, sourceType) {
  const config = SKILL_TABLES[skill];
  const isFoundation = sourceType === 'foundation';
  const result = await pool.query(`
    SELECT 1
    FROM ${config.lessonTable} l
    WHERE COALESCE(l.IsFoundation, false) = $1
      AND EXISTS (
        SELECT 1
        FROM ${config.itemTable} item
        WHERE item.LessonId = l.Id
      )
    LIMIT 1
  `, [isFoundation]);
  return result.rowCount > 0;
}

async function getPlacementTestSummary(pool) {
  const result = await pool.query(`
    SELECT COUNT(*)::int AS ActiveQuestionCount
    FROM PlacementMiniGameQuestions
    WHERE COALESCE(IsActive, true) = true
  `);
  const activeQuestionCount = Number(result.rows[0]?.activequestioncount || 0);
  return {
    hasActiveTests: activeQuestionCount > 0,
    activeQuestionCount
  };
}

async function pickSourceLesson(pool, skill, sourceType) {
  const config = SKILL_TABLES[skill];
  const isFoundation = sourceType === 'foundation';
  const result = await pool.query(`
    SELECT l.*
    FROM ${config.lessonTable} l
    WHERE COALESCE(l.IsFoundation, false) = $1
      AND EXISTS (
        SELECT 1
        FROM ${config.itemTable} item
        WHERE item.LessonId = l.Id
      )
    ORDER BY random()
    LIMIT 1
  `, [isFoundation]);

  const lesson = result.rows[0];
  if (!lesson) {
    const err = new Error(`Không đủ dữ liệu để chọn một bài ${getSourceLabel(sourceType)} cho kỹ năng ${skill}.`);
    err.statusCode = 404;
    throw err;
  }

  return lesson;
}

async function buildReceptivePlacementPart(pool, skill, sourceType) {
  const config = RECEPTIVE_CONFIG[skill];
  const lesson = await pickSourceLesson(pool, skill, sourceType);
  const contentQuery = skill === 'listening'
    ? `
      SELECT Speaker, Text, OrderIndex
      FROM ${config.contentTable}
      WHERE LessonId = $1
      ORDER BY OrderIndex ASC
    `
    : `
      SELECT Content, OrderIndex
      FROM ${config.contentTable}
      WHERE LessonId = $1
      ORDER BY OrderIndex ASC
    `;

  const [contentResult, questionResult] = await Promise.all([
    pool.query(contentQuery, [lesson.id]),
    pool.query(`
      SELECT *
      FROM ${config.questionTable}
      WHERE LessonId = $1
      ORDER BY OrderIndex ASC
    `, [lesson.id])
  ]);

  const contextText = skill === 'listening'
    ? contentResult.rows
      .map((row) => [row.speaker, row.text].filter(Boolean).join(': '))
      .filter(Boolean)
      .join('\n')
    : contentResult.rows
      .map((row) => row.content || '')
      .filter(Boolean)
      .join('\n\n');

  return questionResult.rows.map((row, index) => (
    mapReceptiveQuestion(skill, sourceType, lesson, contextText, row, index)
  ));
}

async function buildSpeakingPlacementPart(pool, sourceType) {
  const lesson = await pickSourceLesson(pool, 'speaking', sourceType);
  const questionResult = await pool.query(`
    SELECT *
    FROM SpeakingQuestions
    WHERE LessonId = $1
    ORDER BY OrderIndex ASC
  `, [lesson.id]);

  return questionResult.rows.map((row, index) => mapSpeakingQuestion(sourceType, lesson, row, index));
}

async function buildWritingPlacementPart(pool, sourceType) {
  const lesson = await pickSourceLesson(pool, 'writing', sourceType);
  const questionResult = await pool.query(`
    SELECT *
    FROM WritingExercises
    WHERE LessonId = $1
    ORDER BY OrderIndex ASC
  `, [lesson.id]);

  return questionResult.rows.map((row, index) => mapWritingQuestion(sourceType, lesson, row, index));
}

function getPromptForMiniGame(row) {
  const type = row.questiontype || row.QuestionType;
  if (type === 'matching') return `Chọn nghĩa tiếng Việt đúng cho: ${row.contenten || row.contentEN || row.ContentEN || ''}`;
  if (type === 'listening') return 'Nghe và chọn đáp án đúng';
  if (type === 'listenbuild') return 'Nghe và xếp các từ thành câu hoàn chỉnh';
  if (type === 'truefalse') return 'Bản dịch này có chính xác không?';
  if (type === 'speakrepeat') return 'Đọc câu này';
  return 'Chọn đáp án đúng';
}
function getSkillForMiniGameType(questionType) {
  if (questionType === 'listening' || questionType === 'listenbuild') return 'listening';
  if (questionType === 'speakrepeat') return 'speaking';
  return 'minigame';
}

async function buildPlacementQuestions(pool) {
  const result = await pool.query(`
    SELECT Id, QuestionType, ContentEN, ContentVI, AudioUrl, ImageUrl, CorrectAnswer, Options,
           Difficulty, PointRatio, OrderIndex
    FROM PlacementMiniGameQuestions
    WHERE COALESCE(IsActive, true) = true
    ORDER BY QuestionType ASC, Difficulty ASC, OrderIndex ASC, CreatedAt ASC
  `);

  return result.rows.map((row, index) => {
    const options = parseOptions(row.options);
    const questionType = row.questiontype || 'matching';
    const targetText = row.correctanswer || row.contenten || '';
    return {
      id: row.id,
      questionType,
      skill: getSkillForMiniGameType(questionType),
      difficulty: row.difficulty || 'easy',
      weight: Number(row.pointratio || DEFAULT_QUESTION_WEIGHT),
      pointRatio: Number(row.pointratio || DEFAULT_QUESTION_WEIGHT),
      contextText: row.contenten || '',
      prompt: getPromptForMiniGame(row),
      contentEN: row.contenten || '',
      contentVI: row.contentvi || '',
      audioUrl: row.audiourl || '',
      imageUrl: row.imageurl || '',
      options,
      correctAnswer: row.correctanswer || '',
      acceptedAnswers: row.correctanswer || '',
      explanation: '',
      sourceSkill: 'minigame-placement',
      sourceQuestionId: row.id,
      sourceLessonId: 'placement-minigame',
      sourceLessonTitle: 'Bài test đầu vào',
      sourceLessonType: 'placement-minigame',
      questionPayload: {
        targetText,
        passScore: questionType === 'speakrepeat' ? 70 : PASS_SCORE,
        miniGameType: questionType
      },
      orderIndex: index + 1
    };
  });
}

const onboardingService = {
  async getStatus(userId) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const [placement, testSummary] = await Promise.all([
      getUserPlacement(pool, userId),
      getPlacementTestSummary(pool)
    ]);

    return {
      ...placement,
      ...testSummary
    };
  },

  async submitSurvey(userId, answer) {
    await ensureOnboardingSchema();
    const normalized = String(answer || '').toLowerCase();

    if (normalized === 'unsure') {
      return { requiresTest: true };
    }

    if (!DIRECT_PLACEMENT.has(normalized)) {
      const err = new Error('Invalid survey answer');
      err.statusCode = 400;
      throw err;
    }

    const pool = getPool();
    const placement = await updatePlacement(pool, userId, normalized, 'survey');
    return {
      requiresTest: false,
      ...placement
    };
  },

  async startPlacementTest(userId) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const generatedQuestions = (await buildPlacementQuestions(pool)).map((question) => ({
      ...question,
      id: crypto.randomUUID()
    }));

    if (generatedQuestions.length === 0) {
      const err = new Error('No placement source questions are available');
      err.statusCode = 404;
      throw err;
    }

    const attemptId = crypto.randomUUID();
    const attemptToken = signPlacementPayload({
      attemptId,
      userId,
      issuedAt: Date.now(),
      questions: generatedQuestions
    });

    return {
      attemptId,
      attemptToken,
      test: {
        id: attemptId,
        title: 'Bài test đầu vào',
        description: 'Bài test sử dụng bộ câu hỏi riêng theo các dạng mini game.',
        questionMode: 'minigame',
        isActive: true,
        orderIndex: 0,
        questionCount: generatedQuestions.length
      },
      questions: generatedQuestions.map((question) => mapQuestion(question, false))
    };
  },

  async checkPlacementAnswer(userId, attemptToken, questionId, answer) {
    await ensureOnboardingSchema();
    const attempt = readPlacementPayload(attemptToken, userId);
    const question = (Array.isArray(attempt.questions) ? attempt.questions : [])
      .find((item) => String(item.id) === String(questionId || ''));

    if (!question) {
      const err = new Error('Không tìm thấy câu hỏi trong lượt làm bài này');
      err.statusCode = 404;
      throw err;
    }

    return {
      questionId: String(question.id),
      correct: isAnswerCorrect(question, answer)
    };
  },

  async submitPlacementTest(userId, attemptToken, answers = []) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const attempt = readPlacementPayload(attemptToken, userId);
    const questions = Array.isArray(attempt.questions) ? attempt.questions : [];
    const answerMap = new Map((Array.isArray(answers) ? answers : []).map((item) => [
      String(item.questionId || item.QuestionId || ''),
      item.answer ?? item.Answer ?? ''
    ]));

    let correctCount = 0;
    let totalWeight = 0;
    let earnedWeight = 0;
    const skillStats = {};

    questions.forEach((question) => {
      const questionId = String(question.id);
      const answer = answerMap.has(questionId) ? answerMap.get(questionId) : '';
      const correct = isAnswerCorrect(question, answer);
      const weight = Number(question.weight || DEFAULT_QUESTION_WEIGHT);
      const earned = correct ? weight : 0;
      const skill = question.skill || 'general';

      if (correct) correctCount += 1;
      totalWeight += weight;
      earnedWeight += earned;

      if (!skillStats[skill]) {
        skillStats[skill] = {
          skill,
          correctCount: 0,
          totalQuestions: 0,
          earnedWeight: 0,
          totalWeight: 0
        };
      }

      skillStats[skill].totalQuestions += 1;
      skillStats[skill].totalWeight += weight;
      skillStats[skill].earnedWeight += earned;
      if (correct) skillStats[skill].correctCount += 1;
    });

    const score = Math.round((earnedWeight / Math.max(totalWeight, 1)) * 100);
    const resultLevel = score >= PASS_SCORE ? 'basic' : 'new';

    const placement = await updatePlacement(pool, userId, resultLevel, 'test');

    return {
      score,
      correctCount,
      totalQuestions: questions.length,
      earnedWeight: Number(earnedWeight.toFixed(2)),
      totalWeight: Number(totalWeight.toFixed(2)),
      skillScores: Object.values(skillStats).map((item) => ({
        ...item,
        earnedWeight: Number(item.earnedWeight.toFixed(2)),
        totalWeight: Number(item.totalWeight.toFixed(2)),
        score: Math.round((item.earnedWeight / Math.max(item.totalWeight, 1)) * 100)
      })),
      resultLevel,
      placement
    };
  }
};

module.exports = onboardingService;
