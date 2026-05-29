const dailyService = require('./daily.service');
const { success, notFound } = require('../../utils/responseHelper');

const dailyController = {
  async getToday(req, res, next) {
    try {
      const data = await dailyService.getToday(req.user);
      return success(res, data);
    } catch (err) {
      next(err);
    }
  },

  async completeTask(req, res, next) {
    try {
      const result = await dailyService.completeTask(req.user.id, req.params.id);
      if (!result) return notFound(res, 'Daily task not found');
      return success(res, result, 'Daily task completed');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dailyController;
