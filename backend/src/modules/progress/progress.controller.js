// ============================================
// Progress Module — Controller
// ============================================
const progressService = require('./progress.service');
const { success, badRequest } = require('../../utils/responseHelper');

const progressController = {
  async getOverall(req, res, next) {
    try {
      const progress = await progressService.getOverall(req.user.id);
      return success(res, progress);
    } catch (err) {
      next(err);
    }
  },

  async updateLesson(req, res, next) {
    try {
      const { lessonId, status, score } = req.body;
      if (!lessonId) return badRequest(res, 'Lesson ID is required');
      const result = await progressService.updateLesson(req.user.id, lessonId, status, score);
      return success(res, result, 'Progress updated');
    } catch (err) {
      next(err);
    }
  },

  async getByCourse(req, res, next) {
    try {
      const progress = await progressService.getByCourse(req.user.id, req.params.courseId);
      return success(res, progress);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = progressController;
