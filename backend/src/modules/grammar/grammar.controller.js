// ============================================
// Grammar Module — Controller
// ============================================
const grammarService = require('./grammar.service');
const { success, notFound, badRequest } = require('../../utils/responseHelper');

const grammarController = {
  async getCategories(req, res, next) {
    try {
      const categories = await grammarService.getCategories();
      return success(res, categories);
    } catch (err) { next(err); }
  },

  async getTopicsByCategory(req, res, next) {
    try {
      const topics = await grammarService.getTopicsByCategory(req.params.categoryId);
      return success(res, topics);
    } catch (err) { next(err); }
  },

  async getTopicDetail(req, res, next) {
    try {
      const topic = await grammarService.getTopicDetail(req.params.topicId);
      if (!topic) return notFound(res, 'Grammar topic not found');
      return success(res, topic);
    } catch (err) { next(err); }
  },

  async submitQuizAttempt(req, res, next) {
    try {
      const { topicId, answers } = req.body;
      if (!topicId || !Array.isArray(answers)) return badRequest(res, 'topicId and answers are required');

      const result = await grammarService.submitQuizAttempt(req.user.id, topicId, answers);
      return success(res, result, 'Grammar attempt submitted');
    } catch (err) { next(err); }
  }
};

module.exports = grammarController;
