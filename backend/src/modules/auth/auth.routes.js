// ============================================
// Auth Module - Routes
// ============================================
const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../../middlewares/validator');
const authMiddleware = require('../../middlewares/authMiddleware');
const authController = require('./auth.controller');

// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  validate
];

const resetPasswordValidation = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('code').trim().isLength({ min: 6, max: 6 }).withMessage('Reset code must be 6 digits').isNumeric().withMessage('Reset code must be numeric'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
