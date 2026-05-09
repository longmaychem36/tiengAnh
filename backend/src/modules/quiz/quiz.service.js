// ============================================
// Quiz Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');
const { EXP_REWARDS } = require('../../utils/constants');

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
    if (score >= 70) {
      await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .input('exp', sql.Int, EXP_REWARDS.QUIZ_COMPLETE)
        .query(`
          UPDATE UserStats
          SET Exp = Exp + @exp,
              Level = CASE
                WHEN Exp + @exp >= 10000 THEN 10
                WHEN Exp + @exp >= 7500 THEN 9
                WHEN Exp + @exp >= 5500 THEN 8
                WHEN Exp + @exp >= 4000 THEN 7
                WHEN Exp + @exp >= 2800 THEN 6
                WHEN Exp + @exp >= 1800 THEN 5
                WHEN Exp + @exp >= 1000 THEN 4
                WHEN Exp + @exp >= 500 THEN 3
                WHEN Exp + @exp >= 250 THEN 2
                WHEN Exp + @exp >= 100 THEN 1
                ELSE Level
              END
          WHERE UserId = @userId
        `);
    }

    return { correct, total, score, expEarned: score >= 70 ? EXP_REWARDS.QUIZ_COMPLETE : 0, results };
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
        OUTPUT INSERTED.*
        VALUES (@lessonId, @question, @type, @correctAnswer)
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
