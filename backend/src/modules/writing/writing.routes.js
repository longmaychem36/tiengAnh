const express = require('express');
const router = express.Router();
const writingController = require('./writing.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');

router.use(authMiddleware, learnerOnly());

router.get('/lessons', writingController.getLessons);
router.get('/lessons/:id', writingController.getLessonDetails);
router.post('/check', writingController.checkWriting);
router.post('/progress', writingController.saveProgress);

module.exports = router;
