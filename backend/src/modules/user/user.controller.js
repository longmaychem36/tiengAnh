// ============================================
// User Module — Controller
// ============================================
const userService = require('./user.service');
const { success, notFound, badRequest, paginated } = require('../../utils/responseHelper');

const userController = {
  /**
   * GET /api/v1/users — Admin only
   */
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await userService.getAll(page, limit);
      return paginated(res, result.users, result.total, page, limit);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/users/:id
   */
  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      if (!user) return notFound(res, 'User not found');
      return success(res, user);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/v1/users/:id
   */
  async update(req, res, next) {
    try {
      // Users can only update their own profile (unless admin)
      if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return badRequest(res, 'You can only update your own profile');
      }
      const result = await userService.update(req.params.id, req.body);
      if (result.error) return badRequest(res, result.error);
      return success(res, result, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/users/:id/stats
   */
  async getStats(req, res, next) {
    try {
      const stats = await userService.getStats(req.params.id);
      if (!stats) return notFound(res, 'User stats not found');
      return success(res, stats);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = userController;
