const onboardingService = require('./onboarding.service');
const { success, error } = require('../../utils/responseHelper');

function handleKnownError(res, err) {
  if (err.statusCode) return error(res, err.message, err.statusCode);
  return null;
}

const onboardingController = {
  async getStatus(req, res, next) {
    try {
      const data = await onboardingService.getStatus(req.user.id);
      return success(res, data);
    } catch (err) {
      next(err);
    }
  },

  async submitSurvey(req, res, next) {
    try {
      const data = await onboardingService.submitSurvey(req.user.id, req.body.answer);
      return success(res, data, 'Survey submitted');
    } catch (err) {
      const known = handleKnownError(res, err);
      if (known) return known;
      next(err);
    }
  },

  async startPlacementTest(req, res, next) {
    try {
      const data = await onboardingService.startPlacementTest(req.user.id);
      return success(res, data, 'Placement test started', 201);
    } catch (err) {
      const known = handleKnownError(res, err);
      if (known) return known;
      next(err);
    }
  },

  async checkPlacementAnswer(req, res, next) {
    try {
      const data = await onboardingService.checkPlacementAnswer(
        req.user.id,
        req.body.attemptToken,
        req.body.questionId,
        req.body.answer
      );
      return success(res, data, 'Placement answer checked');
    } catch (err) {
      const known = handleKnownError(res, err);
      if (known) return known;
      next(err);
    }
  },

  async submitPlacementTest(req, res, next) {
    try {
      const data = await onboardingService.submitPlacementTest(
        req.user.id,
        req.body.attemptToken,
        req.body.answers
      );
      return success(res, data, 'Placement test submitted');
    } catch (err) {
      const known = handleKnownError(res, err);
      if (known) return known;
      next(err);
    }
  }
};

module.exports = onboardingController;
