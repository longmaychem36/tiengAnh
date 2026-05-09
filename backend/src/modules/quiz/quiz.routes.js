// ============================================
// Quiz Module — Routes
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { authorize } = require('../../middlewares/roleMiddleware');
const quizController = require('./quiz.controller');

router.get('/lesson/:lessonId', quizController.getByLesson);
router.post('/submit', authMiddleware, quizController.submit);
router.post('/', authMiddleware, authorize('admin'), quizController.create);

module.exports = router;
