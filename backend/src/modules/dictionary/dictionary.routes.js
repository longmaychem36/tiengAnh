// ============================================
// Dictionary Module — Routes
// ============================================
const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../../middlewares/validator');
const authMiddleware = require('../../middlewares/authMiddleware');
const { authorize } = require('../../middlewares/roleMiddleware');
const dictionaryController = require('./dictionary.controller');

// Public routes
router.get('/search', dictionaryController.search);
router.get('/autocomplete', dictionaryController.autocomplete);
router.post('/translate', dictionaryController.translateSentence);
router.get('/:id', dictionaryController.getById);

// Protected routes
router.get('/history/me', authMiddleware, dictionaryController.getHistory);
router.post('/', authMiddleware, authorize('admin'), [
  body('word').notEmpty().withMessage('Word is required'),
  body('meaningVI').notEmpty().withMessage('Vietnamese meaning is required'),
  validate
], dictionaryController.create);

module.exports = router;
