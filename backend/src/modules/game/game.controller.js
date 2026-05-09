// ============================================
// Mini Game Module — Controller
// ============================================
const gameService = require('./game.service');
const { success, notFound, badRequest } = require('../../utils/responseHelper');

const gameController = {
  // GET /games/sets — all game sets (optionally with user progress)
  async getSets(req, res, next) {
    try {
      let userId = null;
      // Extract user from token if available (optional auth)
      if (req.headers.authorization) {
        try {
          const { verifyToken } = require('../../config/jwt');
          const token = req.headers.authorization.split(' ')[1];
          const decoded = verifyToken(token);
          userId = decoded.id;
        } catch (e) { /* ignore */ }
      }
      const sets = await gameService.getSets(userId);
      return success(res, sets);
    } catch (err) { next(err); }
  },

  // GET /games/sets/:setId/levels — levels in a set (with user progress)
  async getLevels(req, res, next) {
    try {
      const userId = req.user?.id || null;
      const levels = await gameService.getLevelsBySet(req.params.setId, userId);
      return success(res, levels);
    } catch (err) { next(err); }
  },

  // GET /games/levels/:levelId/questions — questions for a level
  async getQuestions(req, res, next) {
    try {
      const data = await gameService.getQuestions(req.params.levelId);
      if (!data) return notFound(res, 'Level not found');
      return success(res, data);
    } catch (err) { next(err); }
  },

  // POST /games/submit — submit answers for a level
  async submit(req, res, next) {
    try {
      const { levelId, answers, duration } = req.body;
      if (!levelId || !answers) return badRequest(res, 'levelId and answers are required');
      const result = await gameService.submitLevel(req.user.id, levelId, answers, duration);
      return success(res, result, `Score: ${result.score}% | ${result.stars}⭐ | +${result.expEarned} EXP`);
    } catch (err) { next(err); }
  }
};

module.exports = gameController;
