// ============================================
// Gamification Module — Routes
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');
const gamificationController = require('./gamification.controller');

router.use(authMiddleware, learnerOnly());

router.get('/stats', gamificationController.getStats);
router.post('/exp', gamificationController.addExp);
router.get('/achievements', gamificationController.getAllAchievements);
router.get('/achievements/my', gamificationController.getMyAchievements);

module.exports = router;
