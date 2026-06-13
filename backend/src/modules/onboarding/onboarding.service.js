const { getPool } = require('../../config/database');
const { ensureOnboardingSchema } = require('./onboarding.schema');

const DIRECT_PLACEMENT = new Set(['new', 'basic']);
const PASS_SCORE = 70;

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
    prompt: row.prompt || '',
    options: [row.optiona, row.optionb, row.optionc, row.optiond].filter(Boolean),
    optionA: row.optiona || '',
    optionB: row.optionb || '',
    optionC: row.optionc || '',
    optionD: row.optiond || '',
    explanation: row.explanation || '',
    sourceSkill: row.sourceskill || '',
    sourceQuestionId: row.sourcequestionid || '',
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

function isAnswerCorrect(question, answer) {
  const normalizedAnswer = normalizeText(answer);
  if (!normalizedAnswer) return false;
  return correctAnswersFor(question).includes(normalizedAnswer);
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

const onboardingService = {
  async getStatus(userId) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const [placement, activeTests] = await Promise.all([
      getUserPlacement(pool, userId),
      pool.query(`SELECT COUNT(*)::int AS count FROM PlacementTests WHERE IsActive = true`)
    ]);

    return {
      ...placement,
      hasActiveTests: Number(activeTests.rows[0]?.count || 0) > 0
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

    const testResult = await pool.query(`
      SELECT t.*, COUNT(q.Id)::int AS QuestionCount
      FROM PlacementTests t
      INNER JOIN PlacementTestQuestions q ON q.TestId = t.Id
      WHERE t.IsActive = true
      GROUP BY t.Id
      HAVING COUNT(q.Id) > 0
      ORDER BY random()
      LIMIT 1
    `);

    const test = testResult.rows[0];
    if (!test) {
      const err = new Error('No active placement test is available');
      err.statusCode = 404;
      throw err;
    }

    const attemptResult = await pool.query(`
      INSERT INTO PlacementAttempts (UserId, TestId, Status, StartedAt)
      VALUES ($1, $2, 'in_progress', NOW())
      RETURNING *
    `, [userId, test.id]);

    const questionResult = await pool.query(`
      SELECT *
      FROM PlacementTestQuestions
      WHERE TestId = $1
      ORDER BY OrderIndex ASC, CreatedAt ASC
    `, [test.id]);

    return {
      attemptId: attemptResult.rows[0].id,
      test: mapTest(test),
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
      ORDER BY OrderIndex ASC, CreatedAt ASC
    `, [attempt.testid]);
    const questions = questionResult.rows;
    const answerMap = new Map((Array.isArray(answers) ? answers : []).map((item) => [
      String(item.questionId || item.QuestionId || ''),
      String(item.answer ?? item.Answer ?? '')
    ]));

    let correctCount = 0;
    const answerRows = questions.map((question) => {
      const answer = answerMap.get(String(question.id)) || '';
      const correct = isAnswerCorrect(question, answer);
      if (correct) correctCount += 1;
      return { questionId: question.id, answer, correct };
    });

    const totalQuestions = questions.length || 1;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const resultLevel = score >= PASS_SCORE ? 'basic' : 'new';

    await pool.query(`DELETE FROM PlacementAttemptAnswers WHERE AttemptId = $1`, [attemptId]);
    for (const row of answerRows) {
      await pool.query(`
        INSERT INTO PlacementAttemptAnswers (AttemptId, QuestionId, Answer, IsCorrect)
        VALUES ($1, $2, $3, $4)
      `, [attemptId, row.questionId, row.answer, row.correct]);
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
      resultLevel,
      placement
    };
  }
};

module.exports = onboardingService;
