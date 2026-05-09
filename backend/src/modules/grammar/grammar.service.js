// ============================================
// Grammar Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');

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
  }
};

module.exports = grammarService;
