// ============================================
// Speaking Module — Routes
// ============================================
const express = require('express');
const router = express.Router();
const speakingController = require('./speaking.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
router.use(authMiddleware);

// New Fluentez-like endpoints
router.get('/lessons', speakingController.getLessons);
router.get('/lessons/:id', speakingController.getLessonDetails);
router.post('/progress', speakingController.saveProgress);
router.post('/analyze', speakingController.analyzeText);

module.exports = router;
