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
               (SELECT COUNT(*) FROM UserCollectionWords WHERE CollectionId = c.Id) as WordCount
        FROM UserCollections c
        WHERE c.UserId = @userId
        ORDER BY c.CreatedAt DESC
      `);
    return result.recordset;
  }

  async create(collection) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, collection.userId)
      .input('name', sql.NVarChar(255), collection.name)
      .input('description', sql.NVarChar(sql.MAX), collection.description || null)
      .query(`
        INSERT INTO UserCollections (UserId, Name, Description)
        OUTPUT inserted.*
        VALUES (@userId, @name, @description)
      `);
    return result.recordset[0];
  }

  async getWords(collectionId) {
    const pool = getPool();
    const result = await pool.request()
      .input('collectionId', sql.UniqueIdentifier, collectionId)
      .query(`
        SELECT w.*, 
               d.Word as DictWord, d.Phonetic, d.PartOfSpeech, d.MeaningVI as DictMeaningVI, d.MeaningEN as DictMeaningEN, d.AudioUrl
        FROM UserCollectionWords w
        LEFT JOIN DictionaryEntries d ON w.DictionaryEntryId = d.Id
        WHERE w.CollectionId = @collectionId
        ORDER BY w.AddedAt DESC
      `);
    return result.recordset;
  }

  async addWord(wordData) {
    const pool = getPool();
    const result = await pool.request()
      .input('collectionId', sql.UniqueIdentifier, wordData.collectionId)
      .input('dictionaryEntryId', sql.UniqueIdentifier, wordData.dictionaryEntryId || null)
      .input('customWord', sql.NVarChar(255), wordData.customWord || null)
      .input('customMeaning', sql.NVarChar(sql.MAX), wordData.customMeaning || null)
      .input('customExample', sql.NVarChar(sql.MAX), wordData.customExample || null)
      .query(`
        INSERT INTO UserCollectionWords (CollectionId, DictionaryEntryId, CustomWord, CustomMeaning, CustomExample)
        OUTPUT inserted.*
        VALUES (@collectionId, @dictionaryEntryId, @customWord, @customMeaning, @customExample)
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
}

module.exports = new CollectionRepository();
