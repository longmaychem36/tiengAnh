const express = require('express');
const router = express.Router();
const collectionController = require('./collection.controller');
const authMiddleware = require('../../middlewares/authMiddleware');

// All collection routes are protected
router.use(authMiddleware);

// Collections
router.get('/', collectionController.getMyCollections);
router.post('/', collectionController.createCollection);
router.delete('/:id', collectionController.deleteCollection);

// Collection Words
router.get('/:id/words', collectionController.getWords);
router.post('/:id/words', collectionController.addWord);
router.delete('/:id/words/:wordId', collectionController.removeWord);

module.exports = router;
