// ============================================
// Grammar Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');
const dailyService = require('../daily/daily.service');

const grammarService = {
  async getCategories() {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT gc.Id, gc.Name, gc.NameVI, gc.Icon, gc.OrderIndex,
             (SELECT COUNT(*) FROM GrammarTopics WHERE CategoryId = gc.Id) as TopicCount
      FROM GrammarCategories gc
      ORDER BY gc.OrderIndex ASC
    `);
    return result.recordset;
  },

  async getTopicsByCategory(categoryId) {
    const pool = getPool();
    const result = await pool.request()
      .input('categoryId', sql.Int, parseInt(categoryId))
      .query(`
        SELECT gt.Id, gt.Title, gt.TitleVI, gt.OrderIndex, gc.Name as CategoryName, gc.NameVI as CategoryNameVI,
               (SELECT COUNT(*) FROM GrammarQuiz WHERE TopicId = gt.Id) as QuizCount
        FROM GrammarTopics gt
        LEFT JOIN GrammarCategories gc ON gt.CategoryId = gc.Id
        WHERE gt.CategoryId = @categoryId
        ORDER BY gt.OrderIndex ASC
      `);
    return result.recordset;
  },

  async getTopicDetail(topicId) {
    const pool = getPool();
    
    const topicResult = await pool.request()
      .input('topicId', sql.UniqueIdentifier, topicId)
      .query(`
        SELECT gt.Id, gt.Title, gt.TitleVI, gt.Content, gt.CategoryId,
               gc.Name as CategoryName, gc.NameVI as CategoryNameVI
        FROM GrammarTopics gt
        LEFT JOIN GrammarCategories gc ON gt.CategoryId = gc.Id
        WHERE gt.Id = @topicId
      `);

    if (topicResult.recordset.length === 0) return null;
    const topic = topicResult.recordset[0];

    const quizResult = await pool.request()
      .input('topicId', sql.UniqueIdentifier, topicId)
      .query(`
        SELECT Id, Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Explanation
        FROM GrammarQuiz WHERE TopicId = @topicId
      `);
    topic.quizzes = quizResult.recordset;

    return topic;
  },

  async submitQuizAttempt(userId, topicId, answers = []) {
    const pool = getPool();
    const quizResult = await pool.query(`
      SELECT q.Id, q.Question, q.CorrectAnswer, q.Explanation,
             gt.Title, gt.TitleVI, gt.CategoryId
      FROM GrammarQuiz q
      INNER JOIN GrammarTopics gt ON gt.Id = q.TopicId
      WHERE q.TopicId = $1
    `, [topicId]);

    const quizMap = new Map(quizResult.rows.map((row) => [String(row.id), row]));
    let correctCount = 0;
    const results = [];

    for (const answer of answers) {
      const quiz = quizMap.get(String(answer.quizId));
      if (!quiz) continue;

      const selectedAnswer = String(answer.answer || '').trim();
      const correctAnswer = String(quiz.correctanswer || '').trim();
      const correct = selectedAnswer === correctAnswer;
      if (correct) correctCount += 1;

      results.push({
        quizId: quiz.id,
        correct,
        selectedAnswer,
        correctAnswer,
        explanation: quiz.explanation
      });

      if (!correct) {
        await dailyService.safeRecordErrorEvent(userId, {
          skill: 'grammar',
          activityType: 'grammar_quiz',
          referenceType: 'grammar_quiz',
          referenceId: quiz.id,
          errorType: 'grammar_topic',
          errorKey: quiz.titlevi || quiz.title || topicId,
          label: quiz.titlevi || quiz.title || 'Ngữ pháp',
          severity: 4,
          prompt: quiz.question,
          userAnswer: selectedAnswer,
          expectedAnswer: correctAnswer,
          feedback: quiz.explanation,
          metadata: {
            topicId,
            categoryId: quiz.categoryid,
            topicTitle: quiz.title,
            topicTitleVI: quiz.titlevi
          }
        });
      }
    }

    const total = answers.length || quizResult.rows.length;
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    await dailyService.completeMatchingTasks(userId, 'grammar_topic', topicId);

    return {
      topicId,
      score,
      correctCount,
      total,
      results
    };
  }
};

module.exports = grammarService;
