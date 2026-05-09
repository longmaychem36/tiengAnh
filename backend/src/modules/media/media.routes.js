// ============================================
// Media Module — Routes
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { authorize } = require('../../middlewares/roleMiddleware');
const { uploadImage, uploadAudio } = require('../../middlewares/upload');
const mediaController = require('./media.controller');

router.post('/upload/image', authMiddleware, authorize('admin'), uploadImage, mediaController.uploadImage);
router.post('/upload/audio', authMiddleware, authorize('admin'), uploadAudio, mediaController.uploadAudio);

module.exports = router;
