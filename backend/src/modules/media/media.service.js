// ============================================
// Media Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');

const mediaService = {
  async saveMedia(lessonId, mediaType, mediaUrl, description) {
    if (!lessonId) return { mediaType, mediaUrl, description };

    const pool = getPool();
    const result = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .input('mediaType', sql.NVarChar, mediaType)
      .input('mediaUrl', sql.NVarChar, mediaUrl)
      .input('description', sql.NVarChar, description || null)
      .query(`
        INSERT INTO LessonMedia (LessonId, MediaType, MediaUrl, Description)
        OUTPUT INSERTED.*
        VALUES (@lessonId, @mediaType, @mediaUrl, @description)
      `);
    return result.recordset[0];
  }
};

module.exports = mediaService;
