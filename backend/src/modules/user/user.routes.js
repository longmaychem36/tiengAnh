// ============================================
// User Module — Routes
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { authorize } = require('../../middlewares/roleMiddleware');
const userController = require('./user.controller');

// All routes require authentication
router.use(authMiddleware);

router.get('/', authorize('admin'), userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.get('/:id/stats', userController.getStats);

module.exports = router;
