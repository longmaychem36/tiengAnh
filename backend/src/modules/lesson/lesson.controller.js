// ============================================
// Lesson Module — Controller
// ============================================
const lessonService = require('./lesson.service');
const { success, created, notFound } = require('../../utils/responseHelper');

const lessonController = {
  async getByCourse(req, res, next) {
    try {
      const lessons = await lessonService.getByCourse(req.params.courseId);
      return success(res, lessons);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const lesson = await lessonService.getById(req.params.id);
      if (!lesson) return notFound(res, 'Lesson not found');
      return success(res, lesson);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const lesson = await lessonService.create(req.body);
      return created(res, lesson, 'Lesson created successfully');
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const lesson = await lessonService.update(req.params.id, req.body);
      if (!lesson) return notFound(res, 'Lesson not found');
      return success(res, lesson, 'Lesson updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const result = await lessonService.remove(req.params.id);
      if (!result) return notFound(res, 'Lesson not found');
      return success(res, null, 'Lesson deleted successfully');
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, levelId } = req.query;
      const result = await lessonService.getAll({ page, limit, levelId });
      return require('../../utils/responseHelper').paginated(res, result.lessons, result.total, page, limit);
    } catch (err) {
      next(err);
    }
  },

  async addMedia(req, res, next) {
    try {
      const media = await lessonService.addMedia(req.params.id, req.body);
      return created(res, media, 'Media added successfully');
    } catch (err) {
      next(err);
    }
  },

  async removeMedia(req, res, next) {
    try {
      const result = await lessonService.removeMedia(req.params.mediaId);
      if (!result) return notFound(res, 'Media not found');
      return success(res, null, 'Media removed successfully');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = lessonController;
