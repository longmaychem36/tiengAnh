// ============================================
// Course Module — Controller
// ============================================
const courseService = require('./course.service');
const { success, created, notFound, badRequest, paginated } = require('../../utils/responseHelper');

const courseController = {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, levelId } = req.query;
      const result = await courseService.getAll({ page, limit, levelId });
      return paginated(res, result.courses, result.total, page, limit);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const course = await courseService.getById(req.params.id);
      if (!course) return notFound(res, 'Course not found');
      return success(res, course);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const course = await courseService.create({ ...req.body, createdBy: req.user.id });
      return created(res, course, 'Course created successfully');
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const course = await courseService.update(req.params.id, req.body);
      if (!course) return notFound(res, 'Course not found');
      return success(res, course, 'Course updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const result = await courseService.remove(req.params.id);
      if (!result) return notFound(res, 'Course not found');
      return success(res, null, 'Course deleted successfully');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = courseController;
