// ============================================
// Course Module — Routes
// ============================================
const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../../middlewares/validator');
const authMiddleware = require('../../middlewares/authMiddleware');
const { authorize } = require('../../middlewares/roleMiddleware');
const courseController = require('./course.controller');

// Public routes
router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);

// Protected routes (admin only)
router.post('/', authMiddleware, authorize('admin'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  validate
], courseController.create);

router.put('/:id', authMiddleware, authorize('admin'), courseController.update);
router.delete('/:id', authMiddleware, authorize('admin'), courseController.remove);

module.exports = router;
