// ============================================
// Auth Module - Controller
// ============================================
const authService = require('./auth.service');
const { success, error, badRequest } = require('../../utils/responseHelper');

const authController = {
  /**
   * POST /api/v1/auth/register
   */
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const result = await authService.register({ username, email, password });

      if (result.error) {
        return badRequest(res, result.error);
      }

      return success(res, result, 'Registration successful', 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      if (result.error) {
        return error(res, result.error, result.statusCode || 401);
      }

      return success(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  },


  /**
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const result = await authService.requestPasswordReset({ email: req.body.email });

      if (result.error) {
        return badRequest(res, result.error);
      }

      return success(res, result, 'Reset code sent');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { email, code, password } = req.body;
      const result = await authService.resetPassword({ email, code, password });

      if (result.error) {
        return badRequest(res, result.error);
      }

      return success(res, result, 'Password reset successful');
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/auth/me
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);
      if (!user) {
        return error(res, 'User not found', 404);
      }
      return success(res, user);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
