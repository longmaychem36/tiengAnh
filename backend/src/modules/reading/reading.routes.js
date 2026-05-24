const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { createReceptiveController } = require('../receptive/receptive.controller');

const readingController = createReceptiveController('reading');

router.use(authMiddleware);

router.get('/lessons', readingController.getLessons);
router.get('/lessons/:id', readingController.getLessonDetails);
router.post('/progress', readingController.saveProgress);

module.exports = router;
