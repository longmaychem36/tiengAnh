// ============================================
// Speaking Module — Routes
// ============================================
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const speakingController = require('./speaking.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');
const { requirePlus } = require('../../middlewares/plusMiddleware');

// Multer config for audio uploads
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads', 'audio');
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `speaking_${Date.now()}_${Math.round(Math.random() * 1E6)}${path.extname(file.originalname) || '.webm'}`;
    cb(null, uniqueName);
  }
});

const audioUpload = multer({
  storage: audioStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.wav', '.webm', '.ogg', '.mp3', '.m4a', '.flac', '.mp4'];
    const ext = path.extname(file.originalname).toLowerCase();
    // Accept if extension matches or mimetype starts with audio/
    if (allowed.includes(ext) || file.mimetype.startsWith('audio/') || file.mimetype === 'video/webm') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported audio format'), false);
    }
  }
});

router.use(authMiddleware, learnerOnly());

// Whisper transcription endpoint
router.post('/transcribe', audioUpload.single('audio'), speakingController.transcribeAudio);

// Combined transcribe + analyze (faster: 1 round-trip instead of 2)
router.post('/transcribe-analyze', audioUpload.single('audio'), speakingController.transcribeAndAnalyze);

// Stateless AI conversation. The browser owns the transcript; signed tokens
// protect the active turn and allow the flow to survive backend restarts.
router.post('/personalized', requirePlus('Speaking AI'), speakingController.createPersonalizedLesson);
router.post(
  '/personalized/:sessionId/analyze-turn',
  requirePlus('Speaking AI'),
  audioUpload.single('audio'),
  speakingController.analyzePersonalizedTurn
);
router.post(
  '/personalized/:sessionId/next-turn',
  requirePlus('Speaking AI'),
  speakingController.generateNextPersonalizedTurn
);

// Existing endpoints
router.get('/lessons', requirePlus('Speaking'), speakingController.getLessons);
router.get('/lessons/:id', requirePlus('Speaking'), speakingController.getLessonDetails);
router.post('/progress', requirePlus('Speaking'), speakingController.saveProgress);
router.post('/analyze', speakingController.analyzeText);

module.exports = router;
