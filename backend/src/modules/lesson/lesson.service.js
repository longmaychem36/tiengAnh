// ============================================
// Lesson Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');

const lessonService = {
  async getByCourse(courseId) {
    const pool = getPool();
    const result = await pool.request()
      .input('courseId', sql.UniqueIdentifier, courseId)
      .query(`
        SELECT l.Id, l.CourseId, l.Title, l.Content, l.Type, l.OrderIndex,
               ll.Code as LevelCode, ll.Name as LevelName,
               (SELECT COUNT(*) FROM LessonVocabulary WHERE LessonId = l.Id) as VocabCount,
               (SELECT COUNT(*) FROM Quiz WHERE LessonId = l.Id) as QuizCount
        FROM Lessons l
        LEFT JOIN LearningLevels ll ON l.LevelId = ll.Id
        WHERE l.CourseId = @courseId
        ORDER BY l.OrderIndex ASC
      `);
    return result.recordset;
  },

  async getById(lessonId) {
    const pool = getPool();

    // Get lesson
    const lessonResult = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .query(`
        SELECT l.Id, l.CourseId, l.Title, l.Content, l.Type, l.OrderIndex, l.LevelId,
               ll.Code as LevelCode, ll.Name as LevelName,
               c.Title as CourseTitle
        FROM Lessons l
        LEFT JOIN LearningLevels ll ON l.LevelId = ll.Id
        LEFT JOIN Courses c ON l.CourseId = c.Id
        WHERE l.Id = @lessonId
      `);

    if (lessonResult.recordset.length === 0) return null;
    const lesson = lessonResult.recordset[0];

    // Get media
    const mediaResult = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .query('SELECT Id, MediaType, MediaUrl, Description FROM LessonMedia WHERE LessonId = @lessonId');
    lesson.media = mediaResult.recordset;

    // Get vocabulary
    const vocabResult = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .query(`
        SELECT v.Id, v.Word, v.Meaning, v.Example, v.AudioUrl, v.ImageUrl
        FROM Vocabulary v
        INNER JOIN LessonVocabulary lv ON v.Id = lv.VocabId
        WHERE lv.LessonId = @lessonId
      `);
    lesson.vocabulary = vocabResult.recordset;

    // Get quizzes
    const quizResult = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .query(`
        SELECT q.Id, q.Question, q.Type, q.CorrectAnswer
        FROM Quiz q
        WHERE q.LessonId = @lessonId
      `);
    lesson.quizzes = quizResult.recordset;

    return lesson;
  },

  async create(data) {
    const pool = getPool();
    const result = await pool.request()
      .input('courseId', sql.UniqueIdentifier, data.courseId)
      .input('title', sql.NVarChar, data.title)
      .input('content', sql.NVarChar, data.content || '')
      .input('type', sql.NVarChar, data.type || 'reading')
      .input('levelId', sql.Int, data.levelId || null)
      .input('orderIndex', sql.Int, data.orderIndex || 0)
      .query(`
        INSERT INTO Lessons (CourseId, Title, Content, Type, LevelId, OrderIndex)
        OUTPUT INSERTED.*
        VALUES (@courseId, @title, @content, @type, @levelId, @orderIndex)
      `);
    return result.recordset[0];
  },

  async update(lessonId, data) {
    const pool = getPool();
    const result = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .input('title', sql.NVarChar, data.title || null)
      .input('content', sql.NVarChar, data.content || null)
      .input('type', sql.NVarChar, data.type || null)
      .input('levelId', sql.Int, data.levelId || null)
      .input('orderIndex', sql.Int, data.orderIndex != null ? data.orderIndex : null)
      .query(`
        UPDATE Lessons
        SET Title = COALESCE(@title, Title),
            Content = COALESCE(@content, Content),
            Type = COALESCE(@type, Type),
            LevelId = COALESCE(@levelId, LevelId),
            OrderIndex = COALESCE(@orderIndex, OrderIndex)
        OUTPUT INSERTED.*
        WHERE Id = @lessonId
      `);
    return result.recordset[0] || null;
  },

  async remove(lessonId) {
    const pool = getPool();
    const result = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .query('DELETE FROM Lessons WHERE Id = @lessonId');
    return result.rowsAffected[0] > 0;
  },

  async getAll({ page = 1, limit = 10, levelId }) {
    const pool = getPool();
    const { offset } = require('../../utils/pagination').parsePagination({ page, limit });
    
    let whereClause = '';
    const request = pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit));

    if (levelId) {
      whereClause = 'WHERE l.LevelId = @levelId';
      request.input('levelId', sql.Int, parseInt(levelId));
    }

    const countResult = await pool.request()
      .input('levelId', sql.Int, levelId ? parseInt(levelId) : null)
      .query(`SELECT COUNT(*) as total FROM Lessons l ${whereClause}`);

    const result = await request.query(`
      SELECT l.Id, l.CourseId, l.Title, l.Type, l.OrderIndex,
             ll.Code as LevelCode, ll.Name as LevelName,
             c.Title as CourseTitle
      FROM Lessons l
      LEFT JOIN LearningLevels ll ON l.LevelId = ll.Id
      LEFT JOIN Courses c ON l.CourseId = c.Id
      ${whereClause}
      ORDER BY l.OrderIndex ASC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);
    
    return { lessons: result.recordset, total: countResult.recordset[0].total };
  },

  async addMedia(lessonId, data) {
    const pool = getPool();
    const result = await pool.request()
      .input('lessonId', sql.UniqueIdentifier, lessonId)
      .input('mediaType', sql.NVarChar, data.mediaType) // 'image', 'audio', 'video'
      .input('mediaUrl', sql.NVarChar, data.mediaUrl)
      .input('description', sql.NVarChar, data.description || null)
      .query(`
        INSERT INTO LessonMedia (LessonId, MediaType, MediaUrl, Description)
        OUTPUT INSERTED.*
        VALUES (@lessonId, @mediaType, @mediaUrl, @description)
      `);
    return result.recordset[0];
  },

  async removeMedia(mediaId) {
    const pool = getPool();
    const result = await pool.request()
      .input('mediaId', sql.UniqueIdentifier, mediaId)
      .query('DELETE FROM LessonMedia WHERE Id = @mediaId');
    return result.rowsAffected[0] > 0;
  }
};

module.exports = lessonService;
