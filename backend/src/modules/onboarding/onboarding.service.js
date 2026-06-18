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

function mapTest(row = {}) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    isActive: Boolean(row.isactive),
    orderIndex: Number(row.orderindex || 0),
    questionCount: Number(row.questioncount || 0),
    createdAt: row.createdat,
    updatedAt: row.updatedat
  };
}

function mapQuestion(row = {}, includeAnswer = false) {
  const question = {
    id: row.id,
    testId: row.testid,
    questionType: row.questiontype || 'multiple_choice',
    skill: row.skill || 'general',
    difficulty: row.difficulty || 'easy',
    weight: Number(row.weight || DEFAULT_QUESTION_WEIGHT),
    contextText: row.contexttext || '',
    prompt: row.prompt || '',
    options: [row.optiona, row.optionb, row.optionc, row.optiond].filter(Boolean),
    optionA: row.optiona || '',
    optionB: row.optionb || '',
    optionC: row.optionc || '',
    optionD: row.optiond || '',
    explanation: row.explanation || '',
    sourceSkill: row.sourceskill || '',
    sourceQuestionId: row.sourcequestionid || '',
    sourceLessonId: row.sourcelessonid || '',
    sourceLessonTitle: row.sourcelessontitle || '',
    sourceLessonType: row.sourcelessontype || '',
    payload: parseQuestionPayload(row.questionpayload),
    orderIndex: Number(row.orderindex || 0)
  };

  if (includeAnswer) {
    question.correctAnswer = row.correctanswer || '';
    question.acceptedAnswers = row.acceptedanswers || '';
  }

  return question;
}

function correctAnswersFor(question) {
  const answers = [
    question.correctanswer,
    ...splitAcceptedAnswers(question.acceptedanswers)
  ].filter(Boolean);

  const key = normalizeText(question.correctanswer);
  const optionByKey = {
    a: question.optiona,
    b: question.optionb,
    c: question.optionc,
    d: question.optiond
  };

  if (optionByKey[key]) answers.push(optionByKey[key]);
  return [...new Set(answers.map(normalizeText).filter(Boolean))];
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
  const payload = parseQuestionPayload(question.questionpayload);
  const configured = Number(payload.passScore);
  if (Number.isFinite(configured)) return configured;
  if (question.questiontype === 'writing_check') return WRITING_PASS_SCORE;
  if (question.questiontype === 'speaking_record') return SPEAKING_PASS_SCORE;
  return PASS_SCORE;
}

function isAnswerCorrect(question, answer) {
  if (question.questiontype === 'speaking_record' || question.questiontype === 'writing_check') {
    const score = getNumericScoreAnswer(answer);
    return score !== null && score >= getPassScore(question);
  }

  const normalizedAnswer = normalizeText(answer);
  if (!normalizedAnswer) return false;
  return correctAnswersFor(question).includes(normalizedAnswer);
}

function serializeAnswer(answer) {
  if (answer && typeof answer === 'object') return JSON.stringify(answer);
  return String(answer ?? '');
}

function getWeightForSourceType(sourceType) {
  return sourceType === 'main' ? MAIN_ROUTE_QUESTION_WEIGHT : FOUNDATION_QUESTION_WEIGHT;
}

function getDifficultyForSourceType(sourceType) {
  return sourceType === 'main' ? 'hard' : 'easy';
}

function getSourceLabel(sourceType) {
  return sourceType === 'main' ? 'lo trinh chinh' : 'nen tang';
}

function buildPlacementOrderSql() {
  return `
    CASE Skill
      WHEN 'listening' THEN 1
      WHEN 'speaking' THEN 2
      WHEN 'reading' THEN 3
      WHEN 'writing' THEN 4
      ELSE 5
    END,
    CASE SourceLessonType
      WHEN 'foundation' THEN 1
      WHEN 'main' THEN 2
      ELSE 3
    END,
    OrderIndex ASC,
    CreatedAt ASC
  `;
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

async function hasPlacementSourceLessons(pool) {
  const checks = [];
  for (const skill of SKILL_ORDER) {
    for (const sourceType of SOURCE_TYPES) {
      checks.push(hasLessonsForSource(pool, skill, sourceType));
    }
  }
  const results = await Promise.all(checks);
  return results.every(Boolean);
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
    const err = new Error(`Khong du du lieu de boc 1 bai ${getSourceLabel(sourceType)} cho ky nang ${skill}.`);
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

async function buildPlacementQuestions(pool) {
  const questions = [];
  let orderIndex = 1;

  for (const skill of SKILL_ORDER) {
    for (const sourceType of SOURCE_TYPES) {
      let partQuestions = [];
      if (skill === 'listening' || skill === 'reading') {
        partQuestions = await buildReceptivePlacementPart(pool, skill, sourceType);
      } else if (skill === 'speaking') {
        partQuestions = await buildSpeakingPlacementPart(pool, sourceType);
      } else if (skill === 'writing') {
        partQuestions = await buildWritingPlacementPart(pool, sourceType);
      }

      for (const question of partQuestions) {
        questions.push({ ...question, orderIndex });
        orderIndex += 1;
      }
    }
  }

  return questions;
}

async function insertPlacementQuestion(pool, testId, question) {
  await pool.query(`
    INSERT INTO PlacementTestQuestions
      (TestId, QuestionType, Skill, Difficulty, Weight, ContextText, Prompt, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, AcceptedAnswers, Explanation, SourceSkill, SourceQuestionId, SourceLessonId, SourceLessonTitle, SourceLessonType, QuestionPayload, OrderIndex, UpdatedAt)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20::jsonb, $21, NOW())
  `, [
    testId,
    question.questionType,
    question.skill,
    question.difficulty,
    question.weight,
    question.contextText,
    question.prompt,
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD,
    question.correctAnswer,
    question.acceptedAnswers,
    question.explanation,
    question.sourceSkill,
    question.sourceQuestionId,
    question.sourceLessonId,
    question.sourceLessonTitle,
    question.sourceLessonType,
    JSON.stringify(question.questionPayload || {}),
    question.orderIndex
  ]);
}

const onboardingService = {
  async getStatus(userId) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const [placement, sourceAvailable] = await Promise.all([
      getUserPlacement(pool, userId),
      hasPlacementSourceLessons(pool)
    ]);

    return {
      ...placement,
      hasActiveTests: sourceAvailable
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
    const generatedQuestions = await buildPlacementQuestions(pool);

    if (generatedQuestions.length === 0) {
      const err = new Error('No placement source questions are available');
      err.statusCode = 404;
      throw err;
    }

    const testResult = await pool.query(`
      INSERT INTO PlacementTests (Title, Description, IsActive, OrderIndex, UpdatedAt)
      VALUES ($1, $2, false, 0, NOW())
      RETURNING *
    `, [
      'Danh gia dau vao 4 ky nang',
      'Bai danh gia duoc boc ngau nhien tu 1 bai nen tang va 1 bai lo trinh chinh cua moi ky nang.'
    ]);
    const test = testResult.rows[0];

    const attemptResult = await pool.query(`
      INSERT INTO PlacementAttempts (UserId, TestId, Status, StartedAt)
      VALUES ($1, $2, 'in_progress', NOW())
      RETURNING *
    `, [userId, test.id]);

    for (const question of generatedQuestions) {
      await insertPlacementQuestion(pool, test.id, question);
    }

    const questionResult = await pool.query(`
      SELECT *
      FROM PlacementTestQuestions
      WHERE TestId = $1
      ORDER BY ${buildPlacementOrderSql()}
    `, [test.id]);

    return {
      attemptId: attemptResult.rows[0].id,
      test: mapTest({ ...test, questioncount: questionResult.rows.length }),
      questions: questionResult.rows.map((row) => mapQuestion(row, false))
    };
  },

  async submitPlacementTest(userId, attemptId, answers = []) {
    await ensureOnboardingSchema();
    const pool = getPool();

    const attemptResult = await pool.query(`
      SELECT *
      FROM PlacementAttempts
      WHERE Id = $1 AND UserId = $2
      LIMIT 1
    `, [attemptId, userId]);

    const attempt = attemptResult.rows[0];
    if (!attempt) {
      const err = new Error('Placement attempt not found');
      err.statusCode = 404;
      throw err;
    }

    if (attempt.status === 'completed') {
      const err = new Error('Placement attempt has already been submitted');
      err.statusCode = 400;
      throw err;
    }

    const questionResult = await pool.query(`
      SELECT *
      FROM PlacementTestQuestions
      WHERE TestId = $1
      ORDER BY ${buildPlacementOrderSql()}
    `, [attempt.testid]);
    const questions = questionResult.rows;
    const answerMap = new Map((Array.isArray(answers) ? answers : []).map((item) => [
      String(item.questionId || item.QuestionId || ''),
      item.answer ?? item.Answer ?? ''
    ]));

    let correctCount = 0;
    let totalWeight = 0;
    let earnedWeight = 0;
    const skillStats = {};

    const answerRows = questions.map((question) => {
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

      return { questionId: question.id, answer: serializeAnswer(answer), correct, weight, earnedWeight: earned };
    });

    const score = Math.round((earnedWeight / Math.max(totalWeight, 1)) * 100);
    const resultLevel = score >= PASS_SCORE ? 'basic' : 'new';

    await pool.query(`DELETE FROM PlacementAttemptAnswers WHERE AttemptId = $1`, [attemptId]);
    for (const row of answerRows) {
      await pool.query(`
        INSERT INTO PlacementAttemptAnswers (AttemptId, QuestionId, Answer, IsCorrect, Weight, EarnedWeight)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [attemptId, row.questionId, row.answer, row.correct, row.weight, row.earnedWeight]);
    }

    await pool.query(`
      UPDATE PlacementAttempts
      SET Status = 'completed',
          Score = $1,
          ResultLevel = $2,
          SubmittedAt = NOW()
      WHERE Id = $3
    `, [score, resultLevel, attemptId]);

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
