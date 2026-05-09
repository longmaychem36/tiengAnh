// ============================================
// Vocabulary Module — Routes
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const vocabularyController = require('./vocabulary.controller');

router.get('/lesson/:lessonId', vocabularyController.getByLesson);
router.post('/learn', authMiddleware, vocabularyController.markLearned);
router.get('/my', authMiddleware, vocabularyController.getMyVocab);

module.exports = router;
