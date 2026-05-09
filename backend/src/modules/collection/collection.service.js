const collectionRepo = require('../../repositories/CollectionRepository');

const collectionService = {
  async getByUserId(userId) {
    return await collectionRepo.getByUserId(userId);
  },

  async create(userId, data) {
    if (!data.name) throw new Error('Collection name is required');
    return await collectionRepo.create({
      userId,
      name: data.name,
      description: data.description
    });
  },

  async delete(collectionId, userId) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw new Error('Collection not found');
    if (collection.UserId !== userId) throw new Error('Unauthorized to delete this collection');

    // Due to ON DELETE CASCADE on UserCollectionWords, words will be automatically deleted
    return await collectionRepo.delete(collectionId);
  },

  async getWords(collectionId, userId) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw new Error('Collection not found');
    if (collection.UserId !== userId) throw new Error('Unauthorized to view this collection');

    return await collectionRepo.getWords(collectionId);
  },

  async addWord(userId, collectionId, data) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw new Error('Collection not found');
    if (collection.UserId !== userId) throw new Error('Unauthorized to modify this collection');

    if (!data.dictionaryEntryId && !data.customWord) {
      throw new Error('Must provide either a dictionary entry ID or a custom word');
    }

    return await collectionRepo.addWord({
      collectionId,
      dictionaryEntryId: data.dictionaryEntryId,
      customWord: data.customWord,
      customMeaning: data.customMeaning,
      customExample: data.customExample
    });
  },

  async removeWord(userId, collectionId, wordId) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw new Error('Collection not found');
    if (collection.UserId !== userId) throw new Error('Unauthorized to modify this collection');
    
    return await collectionRepo.removeWord(wordId);
  }
};

module.exports = collectionService;
