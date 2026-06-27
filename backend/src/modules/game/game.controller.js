// ============================================
// Mini Game Module - Controller
// ============================================
const gameService = require('./game.service');
const { success, notFound, badRequest } = require('../../utils/responseHelper');

const gameController = {
  // GET /games/levels - all levels in the single mini-game track
  async getLevels(req, res, next) {
    try {
      const userId = req.user?.id || null;
      const levels = await gameService.getLevels(userId);
      const hasPaging = req.query.page !== undefined || req.query.limit !== undefined;

      if (hasPaging) {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(30, Math.max(1, Number(req.query.limit) || 8));
        const offset = (page - 1) * limit;
        const pagedLevels = levels.slice(offset, offset + limit);
        return success(res, {
          levels: pagedLevels,
          total: levels.length,
          page,
          limit,
          hasMore: offset + pagedLevels.length < levels.length
        });
      }

      return success(res, levels);
    } catch (err) { next(err); }
  },

  // GET /games/levels/:levelId/questions - questions for a level
  async getQuestions(req, res, next) {
    try {
      const data = await gameService.getQuestions(req.params.levelId);
      if (!data) return notFound(res, 'Level not found');
      return success(res, data);
    } catch (err) { next(err); }
  },

  // POST /games/submit - submit answers for a level
  async submit(req, res, next) {
    try {
      const { levelId, answers, questionIds, duration } = req.body;
      if (!levelId || !answers) return badRequest(res, 'levelId and answers are required');
      const result = await gameService.submitLevel(req.user.id, levelId, answers, duration, questionIds);
      return success(res, result, `Score: ${result.score}% | ${result.stars} stars | +${result.expEarned} EXP`);
    } catch (err) { next(err); }
  }
};

module.exports = gameController;
