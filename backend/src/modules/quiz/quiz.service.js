// ============================================
// Quiz Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');
const { EXP_REWARDS } = require('../../utils/constants');
const gamificationService = require('../gamification/gamification.service');

const quizService = {
  async getByLesson(lessonId) {
    const pool = getPool();
    const quizResult = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .query('SELECT Id, Question, Type FROM Quiz WHERE LessonId = @lessonId');

    // Get options for each quiz
    for (const quiz of quizResult.recordset) {
      const optionsResult = await pool.request()
        .input('quizId', sql.UniqueIdentifier, quiz.Id)
        .query('SELECT Id, OptionText FROM QuizOptions WHERE QuizId = @quizId');
      quiz.options = optionsResult.recordset;
    }

    return quizResult.recordset;
  },

  async checkAnswers(userId, answers) {
    const pool = getPool();
    let correct = 0;
    let total = answers.length;
    const results = [];

    for (const ans of answers) {
      const quizResult = await pool.request()
        .input('quizId', sql.UniqueIdentifier, ans.quizId)
        .query('SELECT CorrectAnswer FROM Quiz WHERE Id = @quizId');

      if (quizResult.recordset.length > 0) {
        const isCorrect = quizResult.recordset[0].CorrectAnswer.toLowerCase().trim() ===
                          ans.answer.toLowerCase().trim();
        if (isCorrect) correct++;
        results.push({
          quizId: ans.quizId,
          correct: isCorrect,
          correctAnswer: quizResult.recordset[0].CorrectAnswer
        });
      }
    }

    const score = Math.round((correct / total) * 100);

    // Award EXP if score >= 70%
    const expEarned = score >= 70 ? EXP_REWARDS.QUIZ_COMPLETE : 0;
    const expReward = expEarned > 0
      ? await gamificationService.addExp(userId, expEarned, 'quiz_complete')
      : null;

    return { correct, total, score, expEarned, expReward, results };
  },

  async create(data) {
    const pool = getPool();
    const result = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, data.lessonId)
      .input('question', sql.NVarChar, data.question)
      .input('type', sql.NVarChar, data.type || 'multiple_choice')
      .input('correctAnswer', sql.NVarChar, data.correctAnswer)
      .query(`
        INSERT INTO Quiz (LessonId, Question, Type, CorrectAnswer)
        VALUES (@lessonId, @question, @type, @correctAnswer) RETURNING *
      `);

    const quiz = result.recordset[0];

    // Add options
    if (data.options && data.options.length > 0) {
      for (const option of data.options) {
        await pool.request()
          .input('quizId', sql.UniqueIdentifier, quiz.Id)
          .input('optionText', sql.NVarChar, option)
          .query('INSERT INTO QuizOptions (QuizId, OptionText) VALUES (@quizId, @optionText)');
      }
    }

    return quiz;
  }
};

module.exports = quizService;
