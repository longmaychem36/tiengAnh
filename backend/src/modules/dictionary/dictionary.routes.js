// ============================================
// Dictionary Module — Routes
// ============================================
const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../../middlewares/validator');
const authMiddleware = require('../../middlewares/authMiddleware');
const { authorize, learnerOnly } = require('../../middlewares/roleMiddleware');
const dictionaryController = require('./dictionary.controller');

// Learner dictionary routes
router.get('/search', authMiddleware, learnerOnly(), dictionaryController.search);
router.get('/autocomplete', authMiddleware, learnerOnly(), dictionaryController.autocomplete);
router.post('/translate', authMiddleware, learnerOnly(), dictionaryController.translateSentence);

// Protected routes
router.get('/history/me', authMiddleware, learnerOnly(), dictionaryController.getHistory);
router.post('/', authMiddleware, authorize('admin'), [
  body('word').notEmpty().withMessage('Word is required'),
  body('meaningVI').notEmpty().withMessage('Vietnamese meaning is required'),
  validate
], dictionaryController.create);

router.get('/:id', authMiddleware, learnerOnly(), dictionaryController.getById);

module.exports = router;
