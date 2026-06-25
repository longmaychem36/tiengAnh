const BaseRepository = require('./BaseRepository');
const { getPool, sql } = require('../config/database');

class CollectionRepository extends BaseRepository {
  constructor() {
    super('UserCollections', 'Id');
  }

  async getByUserId(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT c.*,
               u.Username as CreatorName,
               (SELECT COUNT(*) FROM UserCollectionWords WHERE CollectionId = c.Id) as WordCount
        FROM UserCollections c
        LEFT JOIN Users u ON u.Id = c.UserId
        WHERE c.UserId = @userId
          AND COALESCE(c.IsPublic, false) = false
        ORDER BY c.UpdatedAt DESC, c.CreatedAt DESC
      `);
    return result.recordset;
  }

  async getPublicSubmissionsByUser(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT c.*,
               u.Username as CreatorName,
               reviewer.Username as ReviewerName,
               (SELECT COUNT(*) FROM UserCollectionWords WHERE CollectionId = c.Id) as WordCount
        FROM UserCollections c
        LEFT JOIN Users u ON u.Id = c.UserId
        LEFT JOIN Users reviewer ON reviewer.Id = c.ReviewedBy
        WHERE c.UserId = @userId
          AND c.IsPublic = true
        ORDER BY
          CASE c.ReviewStatus
            WHEN 'draft' THEN 0
            WHEN 'pending' THEN 0
            WHEN 'rejected' THEN 1
            ELSE 2
          END,
          c.UpdatedAt DESC,
          c.CreatedAt DESC
      `);
    return result.recordset;
  }

  async getPublicApproved() {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT c.*,
             u.Username as CreatorName,
             (SELECT COUNT(*) FROM UserCollectionWords WHERE CollectionId = c.Id) as WordCount
      FROM UserCollections c
      LEFT JOIN Users u ON u.Id = c.UserId
      WHERE c.IsPublic = true AND c.ReviewStatus = 'approved'
      ORDER BY c.UpdatedAt DESC, c.CreatedAt DESC
    `);
    return result.recordset;
  }

  async create(collection) {
    const pool = getPool();
    const reviewStatus = collection.reviewStatus || 'approved';
    const submittedAt = collection.isPublic && reviewStatus !== 'draft' ? new Date() : null;
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, collection.userId)
      .input('name', sql.NVarChar, collection.name)
      .input('description', sql.NVarChar, collection.description || null)
      .input('isPublic', sql.Bit, Boolean(collection.isPublic))
      .input('reviewStatus', sql.NVarChar, reviewStatus)
      .input('submittedAt', sql.DateTime, submittedAt)
      .query(`
        INSERT INTO UserCollections (UserId, Name, Description, IsPublic, ReviewStatus, SubmittedAt, UpdatedAt)
        VALUES (
          @userId,
          @name,
          @description,
          @isPublic,
          @reviewStatus,
          @submittedAt,
          NOW()
        ) RETURNING *
      `);
    return result.recordset[0];
  }

  async update(collectionId, data) {
    const pool = getPool();
    const reviewStatus = data.reviewStatus || 'approved';
    const isPublic = Boolean(data.isPublic);
    const submittedAt = isPublic && reviewStatus === 'pending' ? new Date() : null;
    const clearReview = isPublic && reviewStatus === 'draft';
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, collectionId)
      .input('name', sql.NVarChar, data.name)
      .input('description', sql.NVarChar, data.description || null)
      .input('isPublic', sql.Bit, isPublic)
      .input('reviewStatus', sql.NVarChar, reviewStatus)
      .input('submittedAt', sql.DateTime, submittedAt)
      .input('clearReview', sql.Bit, clearReview)
      .query(`
        UPDATE UserCollections
        SET Name = @name,
            Description = @description,
            IsPublic = @isPublic,
            ReviewStatus = @reviewStatus,
            SubmittedAt = @submittedAt,
            ReviewedAt = CASE WHEN @clearReview = true THEN NULL ELSE ReviewedAt END,
            ReviewedBy = CASE WHEN @clearReview = true THEN NULL ELSE ReviewedBy END,
            UpdatedAt = NOW()
        WHERE Id = @id
        RETURNING *
      `);
    return result.recordset[0];
  }

  async getWords(collectionId) {
    const pool = getPool();
    const result = await pool.request()
      .input('collectionId', sql.UniqueIdentifier, collectionId)
      .query(`
        SELECT w.*
        FROM UserCollectionWords w
        WHERE w.CollectionId = @collectionId
        ORDER BY w.AddedAt ASC
      `);
    return result.recordset;
  }

  async addWord(wordData) {
    const pool = getPool();
    const result = await pool.request()
      .input('collectionId', sql.UniqueIdentifier, wordData.collectionId)
      .input('customWord', sql.NVarChar, wordData.customWord || null)
      .input('customMeaning', sql.NVarChar, wordData.customMeaning || null)
      .input('customExample', sql.NVarChar, wordData.customExample || null)
      .query(`
        INSERT INTO UserCollectionWords (CollectionId, CustomWord, CustomMeaning, CustomExample)
        VALUES (@collectionId, @customWord, @customMeaning, @customExample) RETURNING *
      `);
    return result.recordset[0];
  }

  async updateWord(wordId, wordData) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, wordId)
      .input('customWord', sql.NVarChar, wordData.customWord || null)
      .input('customMeaning', sql.NVarChar, wordData.customMeaning || null)
      .input('customExample', sql.NVarChar, wordData.customExample || null)
      .query(`
        UPDATE UserCollectionWords
        SET CustomWord = @customWord,
            CustomMeaning = @customMeaning,
            CustomExample = @customExample,
            UpdatedAt = NOW()
        WHERE Id = @id
        RETURNING *
      `);
    return result.recordset[0];
  }

  async getWordById(wordId) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, wordId)
      .query(`SELECT * FROM UserCollectionWords WHERE Id = @id`);
    return result.recordset[0] || null;
  }

  async markPending(collectionId) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, collectionId)
      .query(`
        UPDATE UserCollections
        SET ReviewStatus = 'pending',
            SubmittedAt = NOW(),
            ReviewedAt = NULL,
            ReviewedBy = NULL,
            UpdatedAt = NOW()
        WHERE Id = @id AND IsPublic = true
        RETURNING *
      `);
    return result.recordset[0] || null;
  }

  async markDraft(collectionId) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, collectionId)
      .query(`
        UPDATE UserCollections
        SET ReviewStatus = 'draft',
            SubmittedAt = NULL,
            ReviewedAt = NULL,
            ReviewedBy = NULL,
            UpdatedAt = NOW()
        WHERE Id = @id AND IsPublic = true
        RETURNING *
      `);
    return result.recordset[0] || null;
  }

  async setReviewStatus(collectionId, status, reviewerId) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, collectionId)
      .input('status', sql.NVarChar, status)
      .input('reviewerId', sql.UniqueIdentifier, reviewerId)
      .query(`
        UPDATE UserCollections
        SET ReviewStatus = @status,
            ReviewedBy = @reviewerId,
            ReviewedAt = NOW(),
            UpdatedAt = NOW()
        WHERE Id = @id
        RETURNING *
      `);
    return result.recordset[0];
  }

  async removeWord(wordId) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, wordId)
      .query(`DELETE FROM UserCollectionWords WHERE Id = @id`);
    return result.rowsAffected[0] > 0;
  }

  async delete(collectionId) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, collectionId)
      .query(`DELETE FROM UserCollectionWords WHERE CollectionId = @id`);

    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, collectionId)
      .query(`DELETE FROM UserCollections WHERE Id = @id`);

    return result.rowsAffected[0] > 0;
  }
}

module.exports = new CollectionRepository();
