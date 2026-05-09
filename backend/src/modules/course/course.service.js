// ============================================
// Course Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');
const { parsePagination } = require('../../utils/pagination');

const courseService = {
  async getAll({ page, limit, levelId }) {
    const pool = getPool();
    const { offset } = parsePagination({ page, limit });

    let whereClause = '';
    const request = pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit));

    if (levelId) {
      whereClause = 'WHERE c.LevelId = @levelId';
      request.input('levelId', sql.Int, parseInt(levelId));
    }

    const countResult = await pool.request()
      .input('levelId', sql.Int, levelId ? parseInt(levelId) : null)
      .query(`SELECT COUNT(*) as total FROM Courses c ${whereClause}`);

    const result = await request.query(`
      SELECT c.Id, c.Title, c.Description, c.LevelId, c.CreatedBy, c.CreatedAt,
             ll.Code as LevelCode, ll.Name as LevelName,
             u.Username as CreatorName,
             (SELECT COUNT(*) FROM Lessons WHERE CourseId = c.Id) as LessonCount
      FROM Courses c
      LEFT JOIN LearningLevels ll ON c.LevelId = ll.Id
      LEFT JOIN Users u ON c.CreatedBy = u.Id
      ${whereClause}
      ORDER BY c.CreatedAt DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return { courses: result.recordset, total: countResult.recordset[0].total };
  },

  async getById(courseId) {
    const pool = getPool();

    const courseResult = await pool.request()
      .input('courseId', sql.UniqueIdentifier, courseId)
      .query(`
        SELECT c.Id, c.Title, c.Description, c.LevelId, c.CreatedBy, c.CreatedAt,
               ll.Code as LevelCode, ll.Name as LevelName,
               u.Username as CreatorName
        FROM Courses c
        LEFT JOIN LearningLevels ll ON c.LevelId = ll.Id
        LEFT JOIN Users u ON c.CreatedBy = u.Id
        WHERE c.Id = @courseId
      `);

    if (courseResult.recordset.length === 0) return null;

    const course = courseResult.recordset[0];

    // Get lessons for this course
    const lessonsResult = await pool.request()
      .input('courseId', sql.UniqueIdentifier, courseId)
      .query(`
        SELECT l.Id, l.Title, l.Content, l.Type, l.OrderIndex,
               ll.Code as LevelCode, ll.Name as LevelName
        FROM Lessons l
        LEFT JOIN LearningLevels ll ON l.LevelId = ll.Id
        WHERE l.CourseId = @courseId
        ORDER BY l.OrderIndex ASC
      `);

    course.lessons = lessonsResult.recordset;
    return course;
  },

  async create(data) {
    const pool = getPool();
    const result = await pool.request()
      .input('title', sql.NVarChar, data.title)
      .input('description', sql.NVarChar, data.description)
      .input('levelId', sql.Int, data.levelId || null)
      .input('createdBy', sql.UniqueIdentifier, data.createdBy)
      .query(`
        INSERT INTO Courses (Title, Description, LevelId, CreatedBy)
        OUTPUT INSERTED.*
        VALUES (@title, @description, @levelId, @createdBy)
      `);
    return result.recordset[0];
  },

  async update(courseId, data) {
    const pool = getPool();
    const result = await pool.request()
      .input('courseId', sql.UniqueIdentifier, courseId)
      .input('title', sql.NVarChar, data.title || null)
      .input('description', sql.NVarChar, data.description || null)
      .input('levelId', sql.Int, data.levelId || null)
      .query(`
        UPDATE Courses
        SET Title = COALESCE(@title, Title),
            Description = COALESCE(@description, Description),
            LevelId = COALESCE(@levelId, LevelId)
        OUTPUT INSERTED.*
        WHERE Id = @courseId
      `);
    return result.recordset[0] || null;
  },

  async remove(courseId) {
    const pool = getPool();
    const result = await pool.request()
      .input('courseId', sql.UniqueIdentifier, courseId)
      .query('DELETE FROM Courses WHERE Id = @courseId');
    return result.rowsAffected[0] > 0;
  }
};

module.exports = courseService;
