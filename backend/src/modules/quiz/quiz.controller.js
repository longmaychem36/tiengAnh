// ============================================
// Quiz Module — Controller
// ============================================
const quizService = require('./quiz.service');
const { success, created, badRequest } = require('../../utils/responseHelper');

const quizController = {
  async getByLesson(req, res, next) {
    try {
      const quizzes = await quizService.getByLesson(req.params.lessonId);
      return success(res, quizzes);
    } catch (err) {
      next(err);
    }
  },

  async submit(req, res, next) {
    try {
      const { answers } = req.body; // [{ quizId, answer }]
      if (!answers || !Array.isArray(answers)) {
        return badRequest(res, 'Answers array is required');
      }
      const result = await quizService.checkAnswers(req.user.id, answers);
      return success(res, result, 'Quiz submitted');
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const quiz = await quizService.create(req.body);
      return created(res, quiz, 'Quiz created');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = quizController;
