// ============================================
// Gamification Module — Controller
// ============================================
const gamificationService = require('./gamification.service');
const { success, badRequest } = require('../../utils/responseHelper');

const gamificationController = {
  async getStats(req, res, next) {
    try {
      const stats = await gamificationService.getStats(req.user.id);
      return success(res, stats);
    } catch (err) {
      next(err);
    }
  },

  async addExp(req, res, next) {
    try {
      const { amount, reason } = req.body;
      if (!amount || amount <= 0) return badRequest(res, 'Valid EXP amount is required');
      const result = await gamificationService.addExp(req.user.id, amount);
      return success(res, result, `+${amount} EXP earned!`);
    } catch (err) {
      next(err);
    }
  },

  async getAllAchievements(req, res, next) {
    try {
      const achievements = await gamificationService.getAllAchievements();
      return success(res, achievements);
    } catch (err) {
      next(err);
    }
  },

  async getMyAchievements(req, res, next) {
    try {
      const achievements = await gamificationService.getUserAchievements(req.user.id);
      return success(res, achievements);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = gamificationController;
