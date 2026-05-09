const { getPool, sql } = require('../config/database');

class BaseRepository {
  constructor(tableName, primaryKey = 'Id') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  async getAll(limit = 100, offset = 0) {
    const pool = getPool();
    const result = await pool.request()
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset)
      .query(`
        SELECT * FROM ${this.tableName}
        ORDER BY ${this.primaryKey}
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);
    return result.recordset;
  }

  async getById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .query(`SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = @id`);
    return result.recordset[0];
  }

  async delete(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .query(`DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = @id`);
    return result.rowsAffected[0] > 0;
  }
}

module.exports = BaseRepository;
