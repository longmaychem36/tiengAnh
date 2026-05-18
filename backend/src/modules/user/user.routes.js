// ============================================
// User Module — Routes
// ============================================
const router = require('express').Router();
const multer = require('multer');
const authMiddleware = require('../../middlewares/authMiddleware');
const { authorize } = require('../../middlewares/roleMiddleware');
const userController = require('./user.controller');

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype)) {
      cb(null, true);
      return;
    }
    const err = new Error('Avatar must be a PNG, JPG, WEBP, or GIF image');
    err.statusCode = 400;
    cb(err);
  }
});

// All routes require authentication
router.use(authMiddleware);

router.get('/', authorize('admin'), userController.getAll);
router.put('/:id/avatar', avatarUpload.single('avatar'), userController.updateAvatar);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.get('/:id/stats', userController.getStats);

module.exports = router;
