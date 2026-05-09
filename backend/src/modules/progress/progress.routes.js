// ============================================
// Progress Module — Routes
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const progressController = require('./progress.controller');

router.use(authMiddleware);

router.get('/', progressController.getOverall);
router.post('/lesson', progressController.updateLesson);
router.get('/course/:courseId', progressController.getByCourse);

module.exports = router;
