// ============================================
// Lesson Module — Routes
// ============================================
const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../../middlewares/validator');
const authMiddleware = require('../../middlewares/authMiddleware');
const { authorize } = require('../../middlewares/roleMiddleware');
const lessonController = require('./lesson.controller');

// Public routes
router.get('/', lessonController.getAll);
router.get('/course/:courseId', lessonController.getByCourse);
router.get('/:id', lessonController.getById);

// Protected routes (admin only)
router.post('/', authMiddleware, authorize('admin'), [
  body('courseId').notEmpty().withMessage('Course ID is required'),
  body('title').notEmpty().withMessage('Title is required'),
  validate
], lessonController.create);

router.post('/:id/media', authMiddleware, authorize('admin'), [
  body('mediaType').isIn(['image', 'audio', 'video']).withMessage('Invalid media type'),
  body('mediaUrl').notEmpty().withMessage('Media URL is required'),
  validate
], lessonController.addMedia);

router.delete('/media/:mediaId', authMiddleware, authorize('admin'), lessonController.removeMedia);

router.put('/:id', authMiddleware, authorize('admin'), lessonController.update);
router.delete('/:id', authMiddleware, authorize('admin'), lessonController.remove);

module.exports = router;
