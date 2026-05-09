// ============================================
// Speaking Module — Routes
// ============================================
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const speakingController = require('./speaking.controller');
const authMiddleware = require('../../middlewares/authMiddleware');

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

router.use(authMiddleware);

// Whisper transcription endpoint
router.post('/transcribe', audioUpload.single('audio'), speakingController.transcribeAudio);

// Existing endpoints
router.get('/lessons', speakingController.getLessons);
router.get('/lessons/:id', speakingController.getLessonDetails);
router.post('/progress', speakingController.saveProgress);
router.post('/analyze', speakingController.analyzeText);

module.exports = router;
