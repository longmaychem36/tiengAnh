const express = require('express');
const router = express.Router();
const collectionController = require('./collection.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');

// All collection routes are protected
router.use(authMiddleware, learnerOnly());

// Collections
router.get('/', collectionController.getMyCollections);
router.get('/public', collectionController.getPublicCollections);
router.post('/', collectionController.createCollection);
router.put('/:id', collectionController.updateCollection);
router.delete('/:id', collectionController.deleteCollection);

// Collection Words
router.get('/:id/words', collectionController.getWords);
router.post('/:id/words', collectionController.addWord);
router.put('/:id/words/:wordId', collectionController.updateWord);
router.delete('/:id/words/:wordId', collectionController.removeWord);

module.exports = router;
