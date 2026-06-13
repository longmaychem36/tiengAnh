const dashboardService = require('./dashboard.service');
const { success } = require('../../utils/responseHelper');

const dashboardController = {
  async getOverview(req, res, next) {
    try {
      const overview = await dashboardService.getOverview(req.user.id);
      return success(res, overview);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dashboardController;
