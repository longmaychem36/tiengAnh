const studyTimeService = require('./study-time.service');
const { success, badRequest } = require('../../utils/responseHelper');

const studyTimeController = {
  async heartbeat(req, res, next) {
    try {
      const { activeSeconds } = req.body || {};
      if (!Number.isFinite(Number(activeSeconds))) {
        return badRequest(res, 'activeSeconds is required');
      }

      const result = await studyTimeService.recordHeartbeat(req.user.id, activeSeconds);
      return success(res, result);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = studyTimeController;
