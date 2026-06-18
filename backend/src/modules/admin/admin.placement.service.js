const { getPool } = require('../../config/database');
const { ensureOnboardingSchema } = require('../onboarding/onboarding.schema');

function mapTest(row = {}) {
  return {
    Id: row.id,
    Title: row.title,
    Description: row.description,
    IsActive: row.isactive,
    OrderIndex: row.orderindex,
    QuestionCount: Number(row.questioncount || 0),
    CreatedAt: row.createdat,
    UpdatedAt: row.updatedat
  };
}

function mapQuestion(row = {}) {
  return {
    Id: row.id,
    TestId: row.testid,
    QuestionType: row.questiontype,
    Skill: row.skill,
    Difficulty: row.difficulty || 'easy',
    Weight: Number(row.weight || 1),
    ContextText: row.contexttext || '',
    Prompt: row.prompt,
    OptionA: row.optiona,
    OptionB: row.optionb,
    OptionC: row.optionc,
    OptionD: row.optiond,
    CorrectAnswer: row.correctanswer,
    AcceptedAnswers: row.acceptedanswers,
    Explanation: row.explanation,
    SourceSkill: row.sourceskill,
    SourceQuestionId: row.sourcequestionid,
    SourceLessonId: row.sourcelessonid,
    SourceLessonTitle: row.sourcelessontitle,
    SourceLessonType: row.sourcelessontype,
    OrderIndex: row.orderindex,
    CreatedAt: row.createdat,
    UpdatedAt: row.updatedat
  };
}

const adminPlacementService = {
  async getTests() {
    await ensureOnboardingSchema();
    const pool = getPool();
    const result = await pool.query(`
      SELECT t.*, COUNT(q.Id)::int AS QuestionCount
      FROM PlacementTests t
      LEFT JOIN PlacementTestQuestions q ON q.TestId = t.Id
      GROUP BY t.Id
      ORDER BY t.OrderIndex ASC, t.CreatedAt ASC
    `);
    return result.rows.map(mapTest);
  },

  async createTest(data = {}) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const result = await pool.query(`
      INSERT INTO PlacementTests (Title, Description, IsActive, OrderIndex, UpdatedAt)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `, [
      data.Title || data.title,
      data.Description || data.description || '',
      data.IsActive === undefined ? true : Boolean(data.IsActive),
      Number(data.OrderIndex || data.orderIndex || 0)
    ]);
    return mapTest(result.rows[0]);
  },

  async updateTest(id, data = {}) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const result = await pool.query(`
      UPDATE PlacementTests
      SET Title = $1,
          Description = $2,
          IsActive = $3,
          OrderIndex = $4,
          UpdatedAt = NOW()
      WHERE Id = $5
      RETURNING *
    `, [
      data.Title || data.title,
      data.Description || data.description || '',
      data.IsActive === undefined ? true : Boolean(data.IsActive),
      Number(data.OrderIndex || data.orderIndex || 0),
      id
    ]);
    return result.rows[0] ? mapTest(result.rows[0]) : null;
  },

  async deleteTest(id) {
    await ensureOnboardingSchema();
    const pool = getPool();
    await pool.query(`DELETE FROM PlacementTests WHERE Id = $1`, [id]);
  },

  async getQuestions(testId) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const result = await pool.query(`
      SELECT *
      FROM PlacementTestQuestions
      WHERE TestId = $1
      ORDER BY OrderIndex ASC, CreatedAt ASC
    `, [testId]);
    return result.rows.map(mapQuestion);
  },

  async createQuestion(data = {}) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const result = await pool.query(`
      INSERT INTO PlacementTestQuestions
        (TestId, QuestionType, Skill, Difficulty, Weight, ContextText, Prompt, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, AcceptedAnswers, Explanation, SourceSkill, SourceQuestionId, OrderIndex, UpdatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
      RETURNING *
    `, [
      data.TestId || data.testId,
      data.QuestionType || data.questionType || 'multiple_choice',
      data.Skill || data.skill || 'general',
      data.Difficulty || data.difficulty || 'easy',
      Number(data.Weight || data.weight || 1),
      data.ContextText || data.contextText || '',
      data.Prompt || data.prompt || '',
      data.OptionA || data.optionA || '',
      data.OptionB || data.optionB || '',
      data.OptionC || data.optionC || '',
      data.OptionD || data.optionD || '',
      data.CorrectAnswer || data.correctAnswer || '',
      data.AcceptedAnswers || data.acceptedAnswers || '',
      data.Explanation || data.explanation || '',
      data.SourceSkill || data.sourceSkill || '',
      data.SourceQuestionId || data.sourceQuestionId || '',
      Number(data.OrderIndex || data.orderIndex || 0)
    ]);
    return mapQuestion(result.rows[0]);
  },

  async updateQuestion(id, data = {}) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const result = await pool.query(`
      UPDATE PlacementTestQuestions
      SET QuestionType = $1,
          Skill = $2,
          Difficulty = $3,
          Weight = $4,
          ContextText = $5,
          Prompt = $6,
          OptionA = $7,
          OptionB = $8,
          OptionC = $9,
          OptionD = $10,
          CorrectAnswer = $11,
          AcceptedAnswers = $12,
          Explanation = $13,
          SourceSkill = $14,
          SourceQuestionId = $15,
          OrderIndex = $16,
          UpdatedAt = NOW()
      WHERE Id = $17
      RETURNING *
    `, [
      data.QuestionType || data.questionType || 'multiple_choice',
      data.Skill || data.skill || 'general',
      data.Difficulty || data.difficulty || 'easy',
      Number(data.Weight || data.weight || 1),
      data.ContextText || data.contextText || '',
      data.Prompt || data.prompt || '',
      data.OptionA || data.optionA || '',
      data.OptionB || data.optionB || '',
      data.OptionC || data.optionC || '',
      data.OptionD || data.optionD || '',
      data.CorrectAnswer || data.correctAnswer || '',
      data.AcceptedAnswers || data.acceptedAnswers || '',
      data.Explanation || data.explanation || '',
      data.SourceSkill || data.sourceSkill || '',
      data.SourceQuestionId || data.sourceQuestionId || '',
      Number(data.OrderIndex || data.orderIndex || 0),
      id
    ]);
    return result.rows[0] ? mapQuestion(result.rows[0]) : null;
  },

  async deleteQuestion(id) {
    await ensureOnboardingSchema();
    const pool = getPool();
    await pool.query(`DELETE FROM PlacementTestQuestions WHERE Id = $1`, [id]);
  }
};

module.exports = adminPlacementService;
