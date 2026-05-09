// ============================================
// Vocabulary Module — Controller
// ============================================
const vocabularyService = require('./vocabulary.service');
const { success, badRequest } = require('../../utils/responseHelper');

const vocabularyController = {
  async getByLesson(req, res, next) {
    try {
      const vocab = await vocabularyService.getByLesson(req.params.lessonId);
      return success(res, vocab);
    } catch (err) {
      next(err);
    }
  },

  async markLearned(req, res, next) {
    try {
      const { vocabId, status } = req.body;
      if (!vocabId) return badRequest(res, 'Vocab ID is required');
      const result = await vocabularyService.markLearned(req.user.id, vocabId, status || 'learning');
      return success(res, result, 'Vocabulary status updated');
    } catch (err) {
      next(err);
    }
  },

  async getMyVocab(req, res, next) {
    try {
      const { status } = req.query;
      const vocab = await vocabularyService.getUserVocab(req.user.id, status);
      return success(res, vocab);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = vocabularyController;
