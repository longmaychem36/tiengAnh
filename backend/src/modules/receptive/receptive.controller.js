const receptiveService = require('./receptive.service');
const dailyService = require('../daily/daily.service');
const { success, badRequest, notFound } = require('../../utils/responseHelper');

function createReceptiveController(skill) {
  return {
    async getLessons(req, res, next) {
      try {
        const lessons = await receptiveService.getLessons(skill, req.user.id);
        return success(res, { lessons });
      } catch (err) {
        next(err);
      }
    },

    async getLessonDetails(req, res, next) {
      try {
        const lesson = await receptiveService.getLessonDetails(skill, req.params.id, req.user.id);
        if (!lesson) return notFound(res, 'Lesson not found');
        return success(res, { lesson });
      } catch (err) {
        next(err);
      }
    },

    async saveProgress(req, res, next) {
      try {
        const { lessonId, score = 0, completed = false } = req.body;
        if (!lessonId) return badRequest(res, 'lessonId is required');

        await receptiveService.saveProgress(skill, req.user.id, lessonId, Number(score || 0), Boolean(completed));
        if (completed) {
          dailyService.completeMatchingTasks(req.user.id, `${skill}_lesson`, lessonId).catch((err) => {
            console.error(`[daily] failed to complete ${skill} task:`, err.message);
          });
        }

        return success(res, { message: 'Progress saved' });
      } catch (err) {
        next(err);
      }
    }
  };
}

module.exports = { createReceptiveController };

