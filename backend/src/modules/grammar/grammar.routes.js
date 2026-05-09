// ============================================
// Grammar Module — Routes
// ============================================
const router = require('express').Router();
const grammarController = require('./grammar.controller');

router.get('/categories', grammarController.getCategories);
router.get('/categories/:categoryId/topics', grammarController.getTopicsByCategory);
router.get('/topics/:topicId', grammarController.getTopicDetail);

module.exports = router;
