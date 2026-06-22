const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');
const onboardingController = require('./onboarding.controller');

router.use(authMiddleware, learnerOnly());

router.get('/status', onboardingController.getStatus);
router.post('/survey', onboardingController.submitSurvey);
router.post('/test-attempts', onboardingController.startPlacementTest);
router.post('/test-attempts/check', onboardingController.checkPlacementAnswer);
router.post('/test-attempts/submit', onboardingController.submitPlacementTest);

module.exports = router;
