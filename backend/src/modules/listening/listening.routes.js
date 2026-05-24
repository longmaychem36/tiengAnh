const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { createReceptiveController } = require('../receptive/receptive.controller');

const listeningController = createReceptiveController('listening');

router.use(authMiddleware);

router.get('/lessons', listeningController.getLessons);
router.get('/lessons/:id', listeningController.getLessonDetails);
router.post('/progress', listeningController.saveProgress);

module.exports = router;
