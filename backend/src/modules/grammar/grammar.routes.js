// ============================================
// Grammar Module — Routes
// ============================================
const router = require('express').Router();
const grammarController = require('./grammar.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');

router.use(authMiddleware, learnerOnly());
router.get('/categories', grammarController.getCategories);
router.get('/categories/:categoryId/topics', grammarController.getTopicsByCategory);
router.get('/topics/:topicId', grammarController.getTopicDetail);
router.post('/attempt', grammarController.submitQuizAttempt);

module.exports = router;
