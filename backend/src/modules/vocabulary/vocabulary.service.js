// ============================================
// Vocabulary Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');

const vocabularyService = {
  async getByLesson(lessonId) {
    const pool = getPool();
    const result = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .query(`
        SELECT v.Id, v.Word, v.Meaning, v.Example, v.AudioUrl, v.ImageUrl
        FROM Vocabulary v
        INNER JOIN LessonVocabulary lv ON v.Id = lv.VocabId
        WHERE lv.LessonId = @lessonId
      `);
    return result.recordset;
  },

  async markLearned(userId, vocabId, status) {
    const pool = getPool();
    // Upsert using MERGE
    await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('vocabId', sql.UniqueIdentifier, vocabId)
      .input('status', sql.NVarChar, status)
      .query(`
        MERGE UserVocabulary AS target
        USING (SELECT @userId as UserId, @vocabId as VocabId) AS source
        ON target.UserId = source.UserId AND target.VocabId = source.VocabId
        WHEN MATCHED THEN UPDATE SET Status = @status
        WHEN NOT MATCHED THEN INSERT (UserId, VocabId, Status) VALUES (@userId, @vocabId, @status);
      `);
    return { userId, vocabId, status };
  },

  async getUserVocab(userId, status) {
    const pool = getPool();
    let query = `
      SELECT v.Id, v.Word, v.Meaning, v.Example, v.AudioUrl, v.ImageUrl, uv.Status
      FROM UserVocabulary uv
      INNER JOIN Vocabulary v ON uv.VocabId = v.Id
      WHERE uv.UserId = @userId
    `;

    const request = pool.request()
      .input('userId', sql.UniqueIdentifier, userId);

    if (status) {
      query += ' AND uv.Status = @status';
      request.input('status', sql.NVarChar, status);
    }

    query += ' ORDER BY v.Word ASC';
    const result = await request.query(query);
    return result.recordset;
  }
};

module.exports = vocabularyService;
