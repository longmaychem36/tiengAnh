const collectionService = require('./collection.service');
const { success, created, errorResponse } = require('../../utils/responseHelper');

const collectionController = {
  async getMyCollections(req, res, next) {
    try {
      const collections = await collectionService.getByUserId(req.user.id);
      return success(res, collections);
    } catch (err) {
      next(err);
    }
  },

  async createCollection(req, res, next) {
    try {
      const result = await collectionService.create(req.user.id, req.body);
      return created(res, result, 'Collection created successfully');
    } catch (err) {
      next(err);
    }
  },

  async deleteCollection(req, res, next) {
    try {
      await collectionService.delete(req.params.id, req.user.id);
      return success(res, null, 'Collection deleted');
    } catch (err) {
      next(err);
    }
  },

  async getWords(req, res, next) {
    try {
      const words = await collectionService.getWords(req.params.id, req.user.id);
      return success(res, words);
    } catch (err) {
      next(err);
    }
  },

  async addWord(req, res, next) {
    try {
      const result = await collectionService.addWord(req.user.id, req.params.id, req.body);
      return created(res, result, 'Word added to collection');
    } catch (err) {
      next(err);
    }
  },

  async removeWord(req, res, next) {
    try {
      await collectionService.removeWord(req.user.id, req.params.id, req.params.wordId);
      return success(res, null, 'Word removed from collection');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = collectionController;
