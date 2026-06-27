const receptiveService = require('./receptive.service');
const dailyService = require('../daily/daily.service');
const { success, badRequest, notFound } = require('../../utils/responseHelper');
const gamificationService = require('../gamification/gamification.service');
const spacedRepetitionService = require('../spaced-repetition/spaced-repetition.service');
const { EXP_REWARDS } = require('../../utils/constants');

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
        const { lessonId, score = 0, completed = false, attemptId } = req.body;
        if (!lessonId) return badRequest(res, 'lessonId is required');

        const pool = require('../../config/database').getPool();
        const progressTable = skill === 'listening' ? 'ListeningProgress' : 'ReadingProgress';

        const existingResult = await pool.query(`
          SELECT Status
          FROM ${progressTable}
          WHERE UserId = $1 AND LessonId = $2
        `, [req.user.id, lessonId]);
        const wasCompleted = existingResult.rows[0]?.status === 'completed';

        await receptiveService.saveProgress(skill, req.user.id, lessonId, Number(score || 0), Boolean(completed));
        const spacedRepetition = await spacedRepetitionService.recordReview({
          userId: req.user.id,
          targetType: `${skill}_lesson`,
          targetId: lessonId,
          score,
          attemptId
        });
        
        let expReward = null;
        if (completed && !wasCompleted) {
          expReward = await gamificationService.addExp(
            req.user.id,
            EXP_REWARDS.LESSON_COMPLETE,
            `${skill}_lesson_complete`
          );
        }

        if (completed) {
          dailyService.completeMatchingTasks(req.user.id, `${skill}_lesson`, lessonId).catch((err) => {
            console.error(`[daily] failed to complete ${skill} task:`, err.message);
          });
        }

        return success(res, {
          message: 'Progress saved',
          alreadyCompleted: wasCompleted,
          expReward,
          nextReviewDate: spacedRepetitionService.formatDueDate(spacedRepetition.item.duedate || spacedRepetition.item.DueDate)
        });
      } catch (err) {
        next(err);
      }
    }
  };
}

module.exports = { createReceptiveController };

