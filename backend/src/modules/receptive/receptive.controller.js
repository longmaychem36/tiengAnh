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
        const lesson = await receptiveService.getLessonDetails(skill, req.params.id);
        if (!lesson) return notFound(res, 'Lesson not found');
        return success(res, { lesson });
      } catch (err) {
        next(err);
      }
    },

    async saveProgress(req, res, next) {
      try {
        const { lessonId, score = 0, completed = false, mistakes = [] } = req.body;
        if (!lessonId) return badRequest(res, 'lessonId is required');

        await receptiveService.saveProgress(skill, req.user.id, lessonId, Number(score || 0), Boolean(completed));
        if (Array.isArray(mistakes)) {
          for (const mistake of mistakes) {
            await dailyService.safeRecordErrorEvent(req.user.id, {
              skill,
              activityType: `${skill}_comprehension`,
              referenceType: `${skill}_question`,
              referenceId: mistake.questionId || lessonId,
              errorType: mistake.questionType || 'comprehension',
              errorKey: `${skill}_${mistake.questionType || 'comprehension'}`,
              label: skill === 'listening' ? 'Nghe hiểu' : 'Đọc hiểu',
              severity: Number(score || 0) < 50 ? 5 : 3,
              prompt: mistake.prompt,
              userAnswer: mistake.userAnswer,
              expectedAnswer: mistake.expectedAnswer,
              feedback: mistake.explanation,
              metadata: {
                lessonId,
                score: Number(score || 0),
                completed: Boolean(completed)
              }
            });
          }
        }

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
