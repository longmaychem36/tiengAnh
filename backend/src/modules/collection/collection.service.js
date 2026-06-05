const collectionRepo = require('../../repositories/CollectionRepository');
const billingService = require('../billing/billing.service');

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function isApprovedPublic(collection) {
  return Boolean(collection?.IsPublic || collection?.ispublic) && (collection?.ReviewStatus || collection?.reviewstatus) === 'approved';
}

function isPublicCollection(collection) {
  return Boolean(collection?.IsPublic || collection?.ispublic);
}

const collectionService = {
  async getByUserId(userId) {
    return await collectionRepo.getByUserId(userId);
  },

  async getPublicCollections() {
    return await collectionRepo.getPublicApproved();
  },

  async create(userId, data) {
    if (!data.name) throw new Error('Collection name is required');
    const isPublic = Boolean(data.isPublic);
    if (isPublic) {
      const isPlus = await billingService.isPlusUser(userId);
      if (!isPlus) throw createHttpError('Tạo học phần public là tính năng Plus.', 403);
    }

    return await collectionRepo.create({
      userId,
      name: data.name,
      description: data.description,
      isPublic,
      reviewStatus: isPublic ? 'pending' : 'approved'
    });
  },

  async update(userId, collectionId, data) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (collection.UserId !== userId) throw createHttpError('Unauthorized to modify this collection', 403);

    const isPublic = Boolean(data.isPublic ?? collection.IsPublic);
    if (isPublic) {
      const isPlus = await billingService.isPlusUser(userId);
      if (!isPlus) throw createHttpError('Tạo học phần public là tính năng Plus.', 403);
    }

    return await collectionRepo.update(collectionId, {
      name: data.name || collection.Name,
      description: data.description ?? collection.Description,
      isPublic,
      reviewStatus: isPublic ? 'pending' : 'approved'
    });
  },

  async delete(collectionId, userId) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (collection.UserId !== userId) throw createHttpError('Unauthorized to delete this collection', 403);

    // Due to ON DELETE CASCADE on UserCollectionWords, words will be automatically deleted
    return await collectionRepo.delete(collectionId);
  },

  async getWords(collectionId, userId) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (collection.UserId !== userId && !isApprovedPublic(collection)) {
      throw createHttpError('Unauthorized to view this collection', 403);
    }

    return await collectionRepo.getWords(collectionId);
  },

  async addWord(userId, collectionId, data) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (collection.UserId !== userId) throw createHttpError('Unauthorized to modify this collection', 403);

    if (!data.customWord) {
      throw new Error('Custom word is required');
    }

    const word = await collectionRepo.addWord({
      collectionId,
      dictionaryEntryId: null,
      customWord: data.customWord,
      customMeaning: data.customMeaning,
      customExample: data.customExample
    });
    if (isPublicCollection(collection)) await collectionRepo.markPending(collectionId);
    return word;
  },

  async updateWord(userId, collectionId, wordId, data) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (collection.UserId !== userId) throw createHttpError('Unauthorized to modify this collection', 403);

    const word = await collectionRepo.getWordById(wordId);
    if (!word || word.CollectionId !== collectionId) throw createHttpError('Word not found', 404);
    if (!data.customWord) throw new Error('Custom word is required');

    const updated = await collectionRepo.updateWord(wordId, {
      customWord: data.customWord,
      customMeaning: data.customMeaning,
      customExample: data.customExample
    });
    if (isPublicCollection(collection)) await collectionRepo.markPending(collectionId);
    return updated;
  },

  async removeWord(userId, collectionId, wordId) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (collection.UserId !== userId) throw createHttpError('Unauthorized to modify this collection', 403);

    const word = await collectionRepo.getWordById(wordId);
    if (!word || word.CollectionId !== collectionId) throw createHttpError('Word not found', 404);
    
    const removed = await collectionRepo.removeWord(wordId);
    if (removed && isPublicCollection(collection)) await collectionRepo.markPending(collectionId);
    return removed;
  }
};

module.exports = collectionService;
