const collectionRepo = require('../../repositories/CollectionRepository');

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function pickValue(row, ...keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null) return row[key];
  }
  return undefined;
}

function getIdValue(row, ...keys) {
  const value = pickValue(row, ...keys);
  return value == null ? '' : String(value);
}

function isApprovedPublic(collection) {
  return Boolean(collection?.IsPublic || collection?.ispublic) && (collection?.ReviewStatus || collection?.reviewstatus) === 'approved';
}

function isPublicCollection(collection) {
  return Boolean(collection?.IsPublic || collection?.ispublic);
}

function hasText(value) {
  return String(value || '').trim().length > 0;
}

const collectionService = {
  async getByUserId(userId) {
    return await collectionRepo.getByUserId(userId);
  },

  async getPublicSubmissionsByUser(userId) {
    return await collectionRepo.getPublicSubmissionsByUser(userId);
  },

  async getPublicCollections() {
    return await collectionRepo.getPublicApproved();
  },

  async create(userId, data) {
    if (!data.name) throw new Error('Collection name is required');

    return await collectionRepo.create({
      userId,
      name: data.name,
      description: data.description,
      isPublic: false,
      reviewStatus: 'approved'
    });
  },

  async createPublicSubmission(userId, data) {
    if (!data.name) throw new Error('Collection name is required');

    return await collectionRepo.create({
      userId,
      name: data.name,
      description: data.description,
      isPublic: true,
      reviewStatus: 'draft'
    });
  },

  async update(userId, collectionId, data) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (getIdValue(collection, 'UserId', 'userid') !== String(userId)) throw createHttpError('Unauthorized to modify this collection', 403);
    if (isPublicCollection(collection)) throw createHttpError('Use public submission endpoint to modify this collection', 400);

    return await collectionRepo.update(collectionId, {
      name: data.name || pickValue(collection, 'Name', 'name'),
      description: data.description ?? pickValue(collection, 'Description', 'description'),
      isPublic: false,
      reviewStatus: 'approved'
    });
  },

  async updatePublicSubmission(userId, collectionId, data) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (getIdValue(collection, 'UserId', 'userid') !== String(userId)) throw createHttpError('Unauthorized to modify this collection', 403);
    if (!isPublicCollection(collection)) throw createHttpError('Public submission not found', 404);

    return await collectionRepo.update(collectionId, {
      name: data.name || pickValue(collection, 'Name', 'name'),
      description: data.description ?? pickValue(collection, 'Description', 'description'),
      isPublic: true,
      reviewStatus: 'draft'
    });
  },

  async submitPublicSubmission(userId, collectionId) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (getIdValue(collection, 'UserId', 'userid') !== String(userId)) throw createHttpError('Unauthorized to modify this collection', 403);
    if (!isPublicCollection(collection)) throw createHttpError('Public submission not found', 404);

    const words = await collectionRepo.getWords(collectionId);
    if (!words.length) throw createHttpError('Thêm ít nhất một từ vựng trước khi gửi duyệt.', 400);
    const hasInvalidWord = words.some((word) => !hasText(pickValue(word, 'CustomWord', 'customword')) || !hasText(pickValue(word, 'CustomMeaning', 'custommeaning')));
    if (hasInvalidWord) throw createHttpError('Mỗi từ vựng cần có đầy đủ từ và nghĩa trước khi gửi duyệt.', 400);

    return await collectionRepo.markPending(collectionId);
  },

  async delete(collectionId, userId) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (getIdValue(collection, 'UserId', 'userid') !== String(userId)) throw createHttpError('Unauthorized to delete this collection', 403);

    // Due to ON DELETE CASCADE on UserCollectionWords, words will be automatically deleted
    return await collectionRepo.delete(collectionId);
  },

  async getWords(collectionId, userId) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (getIdValue(collection, 'UserId', 'userid') !== String(userId) && !isApprovedPublic(collection)) {
      throw createHttpError('Unauthorized to view this collection', 403);
    }

    return await collectionRepo.getWords(collectionId);
  },

  async addWord(userId, collectionId, data) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (getIdValue(collection, 'UserId', 'userid') !== String(userId)) throw createHttpError('Unauthorized to modify this collection', 403);

    if (!data.customWord) {
      throw new Error('Custom word is required');
    }

    const word = await collectionRepo.addWord({
      collectionId,
      customWord: data.customWord,
      customMeaning: data.customMeaning,
      customExample: data.customExample
    });
    if (isPublicCollection(collection)) await collectionRepo.markDraft(collectionId);
    return word;
  },

  async updateWord(userId, collectionId, wordId, data) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (getIdValue(collection, 'UserId', 'userid') !== String(userId)) throw createHttpError('Unauthorized to modify this collection', 403);

    const word = await collectionRepo.getWordById(wordId);
    if (!word || getIdValue(word, 'CollectionId', 'collectionid') !== String(collectionId)) throw createHttpError('Word not found', 404);
    if (!data.customWord) throw new Error('Custom word is required');

    const updated = await collectionRepo.updateWord(wordId, {
      customWord: data.customWord,
      customMeaning: data.customMeaning,
      customExample: data.customExample
    });
    if (isPublicCollection(collection)) await collectionRepo.markDraft(collectionId);
    return updated;
  },

  async removeWord(userId, collectionId, wordId) {
    const collection = await collectionRepo.getById(collectionId);
    if (!collection) throw createHttpError('Collection not found', 404);
    if (getIdValue(collection, 'UserId', 'userid') !== String(userId)) throw createHttpError('Unauthorized to modify this collection', 403);

    const word = await collectionRepo.getWordById(wordId);
    if (!word || getIdValue(word, 'CollectionId', 'collectionid') !== String(collectionId)) throw createHttpError('Word not found', 404);
    
    const removed = await collectionRepo.removeWord(wordId);
    if (removed && isPublicCollection(collection)) await collectionRepo.markDraft(collectionId);
    return removed;
  }
};

module.exports = collectionService;
