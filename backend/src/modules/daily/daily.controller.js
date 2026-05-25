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
      const task = await dailyService.completeTask(req.user.id, req.params.id);
      if (!task) return notFound(res, 'Daily task not found');
      return success(res, { task }, 'Daily task completed');
    } catch (err) {
      next(err);
    }
  },

  async getWeaknesses(req, res, next) {
    try {
      const weaknesses = await dailyService.getWeaknesses(req.user.id, Number(req.query.limit || 10));
      return success(res, { weaknesses });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dailyController;
