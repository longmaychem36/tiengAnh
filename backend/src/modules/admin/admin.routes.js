// ============================================
// Admin Routes — Game Management + User Management
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const adminGameService = require('./admin.game.service');
const adminUserService = require('./admin.user.service');
const adminContentService = require('./admin.content.service');
const supportController = require('../support/support.controller');
const { success, badRequest } = require('../../utils/responseHelper');

// All admin routes require at least admin role
router.use(authMiddleware);

// ========== SUPPORT MANAGEMENT ==========
router.get('/support/tickets', requireRole('admin'), supportController.getAdminTickets);
router.get('/support/tickets/:id', requireRole('admin'), supportController.getAdminTicket);
router.put('/support/tickets/:id/respond', requireRole('admin'), supportController.respondToTicket);
router.put('/support/tickets/:id/status', requireRole('admin'), supportController.updateTicketStatus);

// ========== SPEAKING MANAGEMENT ==========
router.get('/speaking/lessons', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.getSpeakingLessons();
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/speaking/lessons', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.createSpeakingLesson(req.body);
    return success(res, data, 'Lesson created');
  } catch (err) { next(err); }
});

router.put('/speaking/lessons/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.updateSpeakingLesson(req.params.id, req.body);
    return success(res, null, 'Lesson updated');
  } catch (err) { next(err); }
});

router.delete('/speaking/lessons/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.deleteSpeakingLesson(req.params.id);
    return success(res, null, 'Lesson deleted');
  } catch (err) { next(err); }
});

router.get('/speaking/lessons/:id/questions', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.getSpeakingQuestions(req.params.id);
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/speaking/questions', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.createSpeakingQuestion(req.body);
    return success(res, data, 'Question created');
  } catch (err) { next(err); }
});

router.put('/speaking/questions/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.updateSpeakingQuestion(req.params.id, req.body);
    return success(res, null, 'Question updated');
  } catch (err) { next(err); }
});

router.delete('/speaking/questions/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.deleteSpeakingQuestion(req.params.id);
    return success(res, null, 'Question deleted');
  } catch (err) { next(err); }
});

// ========== WRITING MANAGEMENT ==========
router.get('/writing/lessons', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.getWritingLessons();
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/writing/lessons', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.createWritingLesson(req.body);
    return success(res, data, 'Lesson created');
  } catch (err) { next(err); }
});

router.put('/writing/lessons/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.updateWritingLesson(req.params.id, req.body);
    return success(res, null, 'Lesson updated');
  } catch (err) { next(err); }
});

router.delete('/writing/lessons/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.deleteWritingLesson(req.params.id);
    return success(res, null, 'Lesson deleted');
  } catch (err) { next(err); }
});

router.get('/writing/lessons/:id/exercises', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.getWritingExercises(req.params.id);
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/writing/exercises', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.createWritingExercise(req.body);
    return success(res, data, 'Exercise created');
  } catch (err) { next(err); }
});

router.put('/writing/exercises/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.updateWritingExercise(req.params.id, req.body);
    return success(res, null, 'Exercise updated');
  } catch (err) { next(err); }
});

router.delete('/writing/exercises/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.deleteWritingExercise(req.params.id);
    return success(res, null, 'Exercise deleted');
  } catch (err) { next(err); }
});

router.get('/writing/exercises/:id/vocab', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.getWritingVocab(req.params.id);
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/writing/vocab', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.createWritingVocab(req.body);
    return success(res, data, 'Vocab created');
  } catch (err) { next(err); }
});

router.delete('/writing/vocab/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.deleteWritingVocab(req.params.id);
    return success(res, null, 'Vocab deleted');
  } catch (err) { next(err); }
});

function registerReceptiveAdminRoutes(skill, contentPath, itemName) {
  router.get(`/${skill}/lessons`, requireRole('admin'), async (req, res, next) => {
    try {
      const data = await adminContentService.getReceptiveLessons(skill);
      return success(res, data);
    } catch (err) { next(err); }
  });

  router.post(`/${skill}/lessons`, requireRole('admin'), async (req, res, next) => {
    try {
      const data = await adminContentService.createReceptiveLesson(skill, req.body);
      return success(res, data, 'Lesson created');
    } catch (err) { next(err); }
  });

  router.put(`/${skill}/lessons/:id`, requireRole('admin'), async (req, res, next) => {
    try {
      await adminContentService.updateReceptiveLesson(skill, req.params.id, req.body);
      return success(res, null, 'Lesson updated');
    } catch (err) { next(err); }
  });

  router.delete(`/${skill}/lessons/:id`, requireRole('admin'), async (req, res, next) => {
    try {
      await adminContentService.deleteReceptiveLesson(skill, req.params.id);
      return success(res, null, 'Lesson deleted');
    } catch (err) { next(err); }
  });

  if (skill === 'listening') {
    router.get('/listening/lessons/:id/speakers', requireRole('admin'), async (req, res, next) => {
      try {
        const data = await adminContentService.getListeningSpeakers(req.params.id);
        return success(res, data);
      } catch (err) { next(err); }
    });

    router.post('/listening/speakers', requireRole('admin'), async (req, res, next) => {
      try {
        const data = await adminContentService.createListeningSpeaker(req.body);
        return success(res, data, 'Speaker created');
      } catch (err) { next(err); }
    });

    router.put('/listening/speakers/:id', requireRole('admin'), async (req, res, next) => {
      try {
        await adminContentService.updateListeningSpeaker(req.params.id, req.body);
        return success(res, null, 'Speaker updated');
      } catch (err) { next(err); }
    });

    router.delete('/listening/speakers/:id', requireRole('admin'), async (req, res, next) => {
      try {
        await adminContentService.deleteListeningSpeaker(req.params.id);
        return success(res, null, 'Speaker deleted');
      } catch (err) { next(err); }
    });
  }

  router.get(`/${skill}/lessons/:id/${contentPath}`, requireRole('admin'), async (req, res, next) => {
    try {
      const data = await adminContentService.getReceptiveContent(skill, req.params.id);
      return success(res, data);
    } catch (err) { next(err); }
  });

  router.post(`/${skill}/${contentPath}`, requireRole('admin'), async (req, res, next) => {
    try {
      const data = await adminContentService.createReceptiveContent(skill, req.body);
      return success(res, data, `${itemName} created`);
    } catch (err) { next(err); }
  });

  router.put(`/${skill}/${contentPath}/:id`, requireRole('admin'), async (req, res, next) => {
    try {
      await adminContentService.updateReceptiveContent(skill, req.params.id, req.body);
      return success(res, null, `${itemName} updated`);
    } catch (err) { next(err); }
  });

  router.delete(`/${skill}/${contentPath}/:id`, requireRole('admin'), async (req, res, next) => {
    try {
      await adminContentService.deleteReceptiveContent(skill, req.params.id);
      return success(res, null, `${itemName} deleted`);
    } catch (err) { next(err); }
  });

  router.get(`/${skill}/lessons/:id/vocab`, requireRole('admin'), async (req, res, next) => {
    try {
      const data = await adminContentService.getReceptiveVocab(skill, req.params.id);
      return success(res, data);
    } catch (err) { next(err); }
  });

  router.post(`/${skill}/vocab`, requireRole('admin'), async (req, res, next) => {
    try {
      const data = await adminContentService.createReceptiveVocab(skill, req.body);
      return success(res, data, 'Vocab created');
    } catch (err) { next(err); }
  });

  router.put(`/${skill}/vocab/:id`, requireRole('admin'), async (req, res, next) => {
    try {
      await adminContentService.updateReceptiveVocab(skill, req.params.id, req.body);
      return success(res, null, 'Vocab updated');
    } catch (err) { next(err); }
  });

  router.delete(`/${skill}/vocab/:id`, requireRole('admin'), async (req, res, next) => {
    try {
      await adminContentService.deleteReceptiveVocab(skill, req.params.id);
      return success(res, null, 'Vocab deleted');
    } catch (err) { next(err); }
  });

  router.get(`/${skill}/lessons/:id/questions`, requireRole('admin'), async (req, res, next) => {
    try {
      const data = await adminContentService.getReceptiveQuestions(skill, req.params.id);
      return success(res, data);
    } catch (err) { next(err); }
  });

  router.post(`/${skill}/questions`, requireRole('admin'), async (req, res, next) => {
    try {
      const data = await adminContentService.createReceptiveQuestion(skill, req.body);
      return success(res, data, 'Question created');
    } catch (err) { next(err); }
  });

  router.put(`/${skill}/questions/:id`, requireRole('admin'), async (req, res, next) => {
    try {
      await adminContentService.updateReceptiveQuestion(skill, req.params.id, req.body);
      return success(res, null, 'Question updated');
    } catch (err) { next(err); }
  });

  router.delete(`/${skill}/questions/:id`, requireRole('admin'), async (req, res, next) => {
    try {
      await adminContentService.deleteReceptiveQuestion(skill, req.params.id);
      return success(res, null, 'Question deleted');
    } catch (err) { next(err); }
  });
}

// ========== LISTENING / READING MANAGEMENT ==========
registerReceptiveAdminRoutes('listening', 'segments', 'Segment');
registerReceptiveAdminRoutes('reading', 'paragraphs', 'Paragraph');

// ========== GRAMMAR MANAGEMENT ==========
router.get('/grammar/categories', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.getGrammarCategories();
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/grammar/categories', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.createGrammarCategory(req.body);
    return success(res, data, 'Category created');
  } catch (err) { next(err); }
});

router.put('/grammar/categories/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.updateGrammarCategory(req.params.id, req.body);
    return success(res, null, 'Category updated');
  } catch (err) { next(err); }
});

router.delete('/grammar/categories/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.deleteGrammarCategory(req.params.id);
    return success(res, null, 'Category deleted');
  } catch (err) { next(err); }
});

router.get('/grammar/categories/:id/topics', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.getGrammarTopics(req.params.id);
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/grammar/topics', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.createGrammarTopic(req.body);
    return success(res, data, 'Topic created');
  } catch (err) { next(err); }
});

router.put('/grammar/topics/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.updateGrammarTopic(req.params.id, req.body);
    return success(res, null, 'Topic updated');
  } catch (err) { next(err); }
});

router.delete('/grammar/topics/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.deleteGrammarTopic(req.params.id);
    return success(res, null, 'Topic deleted');
  } catch (err) { next(err); }
});

router.get('/grammar/topics/:id/quizzes', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.getGrammarQuizzes(req.params.id);
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/grammar/quizzes', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.createGrammarQuiz(req.body);
    return success(res, data, 'Quiz created');
  } catch (err) { next(err); }
});

router.put('/grammar/quizzes/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.updateGrammarQuiz(req.params.id, req.body);
    return success(res, null, 'Quiz updated');
  } catch (err) { next(err); }
});

router.delete('/grammar/quizzes/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.deleteGrammarQuiz(req.params.id);
    return success(res, null, 'Quiz deleted');
  } catch (err) { next(err); }
});

// ========== VOCABULARY MANAGEMENT ==========
router.get('/vocabulary/collections', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.getVocabularyCollections(req.query.status || 'all', req.query.source || 'all');
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/vocabulary/collections', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.createVocabularyCollection(req.user.id, req.body);
    return success(res, data, 'Vocabulary collection created');
  } catch (err) { next(err); }
});

router.put('/vocabulary/collections/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.updateVocabularyCollection(req.params.id, req.body);
    return success(res, null, 'Vocabulary collection updated');
  } catch (err) { next(err); }
});

router.put('/vocabulary/collections/:id/review', requireRole('admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return badRequest(res, 'status is required');
    const data = await adminContentService.reviewVocabularyCollection(req.params.id, status, req.user.id);
    return success(res, data, 'Vocabulary collection reviewed');
  } catch (err) { next(err); }
});

router.delete('/vocabulary/collections/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.deleteVocabularyCollection(req.params.id);
    return success(res, null, 'Vocabulary collection deleted');
  } catch (err) { next(err); }
});

router.get('/vocabulary/collections/:id/words', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.getVocabularyWords(req.params.id);
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/vocabulary/collections/:id/words', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.addVocabularyWord(req.params.id, req.body);
    return success(res, data, 'Vocabulary word created');
  } catch (err) { next(err); }
});

router.put('/vocabulary/words/:wordId', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.updateVocabularyWord(req.params.wordId, req.body);
    return success(res, null, 'Vocabulary word updated');
  } catch (err) { next(err); }
});

router.delete('/vocabulary/words/:wordId', requireRole('admin'), async (req, res, next) => {
  try {
    await adminContentService.deleteVocabularyWord(req.params.wordId);
    return success(res, null, 'Vocabulary word deleted');
  } catch (err) { next(err); }
});

// ========== GAME MANAGEMENT ==========

// Levels CRUD
router.get('/games/levels', requireRole('admin'), async (req, res, next) => {
  try {
    const levels = await adminGameService.getLevels();
    return success(res, levels);
  } catch (err) { next(err); }
});

router.post('/games/levels', requireRole('admin'), async (req, res, next) => {
  try {
    const level = await adminGameService.createLevel(req.body);
    return success(res, level, 'Level created');
  } catch (err) { next(err); }
});

router.put('/games/levels/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminGameService.updateLevel(req.params.id, req.body);
    return success(res, null, 'Level updated');
  } catch (err) { next(err); }
});

router.delete('/games/levels/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminGameService.deleteLevel(req.params.id);
    return success(res, null, 'Level deleted');
  } catch (err) { next(err); }
});

// Questions CRUD
router.get('/games/levels/:levelId/questions', requireRole('admin'), async (req, res, next) => {
  try {
    const questions = await adminGameService.getQuestionsByLevel(req.params.levelId);
    return success(res, questions);
  } catch (err) { next(err); }
});

router.post('/games/questions', requireRole('admin'), async (req, res, next) => {
  try {
    const q = await adminGameService.createQuestion(req.body);
    return success(res, q, 'Question created');
  } catch (err) { next(err); }
});

router.put('/games/questions/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminGameService.updateQuestion(req.params.id, req.body);
    return success(res, null, 'Question updated');
  } catch (err) { next(err); }
});

router.delete('/games/questions/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminGameService.deleteQuestion(req.params.id);
    return success(res, null, 'Question deleted');
  } catch (err) { next(err); }
});

// Placement mini-game questions CRUD
router.get('/placement/minigame-questions', requireRole('admin'), async (req, res, next) => {
  try {
    const questions = await adminGameService.getPlacementQuestions();
    return success(res, questions);
  } catch (err) { next(err); }
});

router.post('/placement/minigame-questions', requireRole('admin'), async (req, res, next) => {
  try {
    const q = await adminGameService.createPlacementQuestion(req.body);
    return success(res, q, 'Placement question created');
  } catch (err) { next(err); }
});

router.put('/placement/minigame-questions/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminGameService.updatePlacementQuestion(req.params.id, req.body);
    return success(res, null, 'Placement question updated');
  } catch (err) { next(err); }
});

router.delete('/placement/minigame-questions/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminGameService.deletePlacementQuestion(req.params.id);
    return success(res, null, 'Placement question deleted');
  } catch (err) { next(err); }
});
// ========== DASHBOARD STATS ==========
router.get('/dashboard/stats', requireRole('admin'), async (req, res, next) => {
  try {
    const { getPool } = require('../../config/database');
    const pool = getPool();
    const countTable = (tableName) => pool.query(`SELECT count(*)::int as count FROM ${tableName}`);
    const scalar = async (query) => {
      const result = await pool.query(query);
      return Number(Object.values(result.rows[0] || {})[0] || 0);
    };
    const rows = async (query) => {
      const result = await pool.query(query);
      return result.rows || [];
    };

    const queries = await Promise.all([
      countTable('Users'),
      scalar("SELECT count(*)::int FROM Users WHERE COALESCE(IsActive, true) = true"),
      scalar("SELECT count(*)::int FROM Users WHERE COALESCE(IsActive, true) = false"),
      scalar("SELECT count(*)::int FROM Users WHERE Role IN ('admin', 'superadmin')"),
      scalar("SELECT count(*)::int FROM Users WHERE Role = 'user'"),
      scalar("SELECT count(*)::int FROM Users WHERE Plan = 'plus'"),
      scalar("SELECT count(*)::int FROM Users WHERE CreatedAt >= NOW() - INTERVAL '7 days'"),
      countTable('GameLevels'),
      countTable('MiniGameQuestions'),
      countTable('SpeakingLessons'),
      countTable('SpeakingQuestions'),
      countTable('WritingLessons'),
      countTable('WritingExercises'),
      countTable('GrammarCategories'),
      countTable('GrammarTopics'),
      countTable('GrammarQuiz'),
      countTable('ListeningLessons'),
      countTable('ListeningQuestions'),
      countTable('ReadingLessons'),
      countTable('ReadingQuestions'),
      countTable('UserCollections'),
      countTable('UserCollectionWords'),
      countTable('PaymentRequests'),
      countTable('DailyTasks'),
      scalar("SELECT COALESCE(SUM(ActiveSeconds), 0)::int FROM StudyTimeDaily"),
      scalar("SELECT COALESCE(SUM(Exp), 0)::int FROM UserStats"),
    ]);

    const topLearnersByExp = await rows(`
      SELECT u.Id, u.Username, u.Email, u.Plan,
             COALESCE(us.Exp, 0)::int AS Exp,
             COALESCE(us.Level, 1)::int AS Level,
             COALESCE(us.StreakDays, 0)::int AS StreakDays,
             us.LastLogin
      FROM Users u
      LEFT JOIN UserStats us ON us.UserId = u.Id
      WHERE u.Role = 'user'
      ORDER BY COALESCE(us.Exp, 0) DESC, COALESCE(us.Level, 1) DESC, COALESCE(us.StreakDays, 0) DESC, u.CreatedAt DESC
      LIMIT 8
    `);

    const topLearnersByStreak = await rows(`
      SELECT u.Id, u.Username, u.Email, u.Plan,
             COALESCE(us.StreakDays, 0)::int AS StreakDays,
             COALESCE(us.Exp, 0)::int AS Exp,
             COALESCE(us.Level, 1)::int AS Level,
             us.LastLogin
      FROM Users u
      LEFT JOIN UserStats us ON us.UserId = u.Id
      WHERE u.Role = 'user'
      ORDER BY COALESCE(us.StreakDays, 0) DESC, COALESCE(us.Exp, 0) DESC, u.CreatedAt DESC
      LIMIT 8
    `);

    const topLearnersByStudyTime30d = await rows(`
      SELECT u.Id, u.Username, u.Email, u.Plan,
             COALESCE(SUM(std.ActiveSeconds), 0)::int AS ActiveSeconds,
             COUNT(std.ActivityDate)::int AS ActiveDays,
             COALESCE(us.Exp, 0)::int AS Exp,
             COALESCE(us.StreakDays, 0)::int AS StreakDays
      FROM Users u
      LEFT JOIN UserStats us ON us.UserId = u.Id
      LEFT JOIN StudyTimeDaily std ON std.UserId = u.Id AND std.ActivityDate >= CURRENT_DATE - 29
      WHERE u.Role = 'user'
      GROUP BY u.Id, u.Username, u.Email, u.Plan, us.Exp, us.StreakDays
      HAVING COALESCE(SUM(std.ActiveSeconds), 0) > 0
      ORDER BY COALESCE(SUM(std.ActiveSeconds), 0) DESC, COUNT(std.ActivityDate) DESC, COALESCE(us.Exp, 0) DESC
      LIMIT 8
    `);

    const topLearnersByDailyTasks30d = await rows(`
      SELECT u.Id, u.Username, u.Email, u.Plan,
             COUNT(dt.Id)::int AS CompletedTasks,
             COALESCE(SUM(dt.RewardExp), 0)::int AS EarnedExp,
             COALESCE(us.Exp, 0)::int AS Exp,
             COALESCE(us.StreakDays, 0)::int AS StreakDays
      FROM Users u
      LEFT JOIN UserStats us ON us.UserId = u.Id
      LEFT JOIN DailyTasks dt ON dt.UserId = u.Id AND dt.Status = 'completed' AND dt.TaskDate >= CURRENT_DATE - 29
      WHERE u.Role = 'user'
      GROUP BY u.Id, u.Username, u.Email, u.Plan, us.Exp, us.StreakDays
      HAVING COUNT(dt.Id) > 0
      ORDER BY COUNT(dt.Id) DESC, COALESCE(SUM(dt.RewardExp), 0) DESC, COALESCE(us.Exp, 0) DESC
      LIMIT 8
    `);

    const learnersNeedingAttention = await rows(`
      SELECT u.Id, u.Username, u.Email, u.Plan,
             COALESCE(us.Exp, 0)::int AS Exp,
             COALESCE(us.StreakDays, 0)::int AS StreakDays,
             us.LastLogin,
             COALESCE(std.ActiveSeconds30d, 0)::int AS ActiveSeconds30d,
             COALESCE(dt.CompletedTasks30d, 0)::int AS CompletedTasks30d,
             CASE
               WHEN COALESCE(u.IsActive, true) = false THEN 'Tài khoản đang bị khóa'
               WHEN us.LastLogin IS NULL THEN 'Chưa từng đăng nhập'
               WHEN us.LastLogin < NOW() - INTERVAL '14 days' THEN 'Không đăng nhập hơn 14 ngày'
               WHEN COALESCE(std.ActiveSeconds30d, 0) = 0 THEN 'Không có thời gian học 30 ngày'
               WHEN COALESCE(dt.CompletedTasks30d, 0) = 0 THEN 'Chưa hoàn thành nhiệm vụ 30 ngày'
               ELSE 'Cần theo dõi'
             END AS Reason
      FROM Users u
      LEFT JOIN UserStats us ON us.UserId = u.Id
      LEFT JOIN (
        SELECT UserId, SUM(ActiveSeconds)::int AS ActiveSeconds30d
        FROM StudyTimeDaily
        WHERE ActivityDate >= CURRENT_DATE - 29
        GROUP BY UserId
      ) std ON std.UserId = u.Id
      LEFT JOIN (
        SELECT UserId, COUNT(*)::int AS CompletedTasks30d
        FROM DailyTasks
        WHERE Status = 'completed' AND TaskDate >= CURRENT_DATE - 29
        GROUP BY UserId
      ) dt ON dt.UserId = u.Id
      WHERE u.Role = 'user'
        AND (
          COALESCE(u.IsActive, true) = false
          OR us.LastLogin IS NULL
          OR us.LastLogin < NOW() - INTERVAL '14 days'
          OR COALESCE(std.ActiveSeconds30d, 0) = 0
          OR COALESCE(dt.CompletedTasks30d, 0) = 0
        )
      ORDER BY
        CASE WHEN COALESCE(u.IsActive, true) = false THEN 0 ELSE 1 END,
        us.LastLogin ASC NULLS FIRST,
        COALESCE(std.ActiveSeconds30d, 0) ASC
      LIMIT 8
    `);

    const learningHealth = (await rows(`
      SELECT
        COALESCE((SELECT COUNT(DISTINCT UserId) FROM StudyTimeDaily WHERE ActivityDate >= CURRENT_DATE - 6), 0)::int AS ActiveLearners7d,
        COALESCE((SELECT COUNT(DISTINCT UserId) FROM StudyTimeDaily WHERE ActivityDate >= CURRENT_DATE - 29), 0)::int AS ActiveLearners30d,
        COALESCE((SELECT COUNT(*) FROM DailyTasks WHERE Status = 'completed' AND TaskDate >= CURRENT_DATE - 29), 0)::int AS CompletedTasks30d,
        COALESCE((SELECT SUM(ActiveSeconds) FROM StudyTimeDaily WHERE ActivityDate >= CURRENT_DATE - 29), 0)::int AS StudySeconds30d,
        COALESCE((SELECT COUNT(*) FROM SpacedRepetitionItems WHERE COALESCE(IsMastered, false) = true), 0)::int AS MasteredItems,
        COALESCE((SELECT COUNT(*) FROM SpacedRepetitionItems WHERE DueDate <= (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date AND COALESCE(IsMastered, false) = false), 0)::int AS DueReviewItems
    `))[0] || {};

    const activity7d = await pool.query(`
      SELECT d.day::date AS Date,
             COALESCE(std.ActiveSeconds, 0)::int AS ActiveSeconds,
             COALESCE(dt.CompletedTasks, 0)::int AS CompletedTasks,
             COALESCE(newu.NewUsers, 0)::int AS NewUsers
      FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, INTERVAL '1 day') d(day)
      LEFT JOIN (
        SELECT ActivityDate::date AS day, SUM(ActiveSeconds)::int AS ActiveSeconds
        FROM StudyTimeDaily
        GROUP BY ActivityDate::date
      ) std ON std.day = d.day::date
      LEFT JOIN (
        SELECT TaskDate::date AS day, COUNT(*)::int AS CompletedTasks
        FROM DailyTasks
        WHERE Status = 'completed'
        GROUP BY TaskDate::date
      ) dt ON dt.day = d.day::date
      LEFT JOIN (
        SELECT CreatedAt::date AS day, COUNT(*)::int AS NewUsers
        FROM Users
        GROUP BY CreatedAt::date
      ) newu ON newu.day = d.day::date
      ORDER BY d.day ASC
    `);

    const stats = {
      totalUsers: Number(queries[0].rows[0].count || 0),
      activeUsers: queries[1],
      lockedUsers: queries[2],
      adminUsers: queries[3],
      learnerUsers: queries[4],
      plusUsers: queries[5],
      newUsers7d: queries[6],
      totalGameLevels: Number(queries[7].rows[0].count || 0),
      totalQuestions: Number(queries[8].rows[0].count || 0),
      totalSpeakingLessons: Number(queries[9].rows[0].count || 0),
      totalSpeakingQuestions: Number(queries[10].rows[0].count || 0),
      totalWritingLessons: Number(queries[11].rows[0].count || 0),
      totalWritingExercises: Number(queries[12].rows[0].count || 0),
      totalGrammarCategories: Number(queries[13].rows[0].count || 0),
      totalGrammarTopics: Number(queries[14].rows[0].count || 0),
      totalGrammarQuiz: Number(queries[15].rows[0].count || 0),
      totalListeningLessons: Number(queries[16].rows[0].count || 0),
      totalListeningQuestions: Number(queries[17].rows[0].count || 0),
      totalReadingLessons: Number(queries[18].rows[0].count || 0),
      totalReadingQuestions: Number(queries[19].rows[0].count || 0),
      totalVocabularyCollections: Number(queries[20].rows[0].count || 0),
      totalVocabularyWords: Number(queries[21].rows[0].count || 0),
      totalPaymentRequests: Number(queries[22].rows[0].count || 0),
      totalDailyTasks: Number(queries[23].rows[0].count || 0),
      totalStudySeconds: queries[24],
      totalExp: queries[25],
      topLearners: topLearnersByExp,
      topLearnersByExp,
      topLearnersByStreak,
      topLearnersByStudyTime30d,
      topLearnersByDailyTasks30d,
      learnersNeedingAttention,
      learningHealth,
      topCriteria: {
        exp: 'Xếp theo tổng EXP giảm dần; hòa điểm thì ưu tiên level, streak và tài khoản mới hơn.',
        streak: 'Xếp theo streak hiện tại giảm dần; hòa điểm thì ưu tiên tổng EXP.',
        studyTime30d: 'Xếp theo tổng thời gian học trong 30 ngày gần nhất; hòa điểm thì ưu tiên số ngày có học.',
        dailyTasks30d: 'Xếp theo số nhiệm vụ hằng ngày đã hoàn thành trong 30 ngày; hòa điểm thì ưu tiên EXP nhận từ nhiệm vụ.',
        attention: 'Learner bị khóa, chưa đăng nhập, vắng hơn 14 ngày hoặc không có hoạt động/nhiệm vụ trong 30 ngày.'
      },
      activity7d: activity7d.rows,
    };

    stats.totalSkillLessons = stats.totalSpeakingLessons + stats.totalWritingLessons + stats.totalListeningLessons + stats.totalReadingLessons;
    stats.totalLearningItems = stats.totalSpeakingQuestions + stats.totalWritingExercises + stats.totalListeningQuestions + stats.totalReadingQuestions + stats.totalGrammarQuiz + stats.totalQuestions;
    stats.modules = [
      { key: 'listening', name: 'Luyện nghe', lessons: stats.totalListeningLessons, items: stats.totalListeningQuestions, to: '/admin/listening' },
      { key: 'reading', name: 'Luyện đọc', lessons: stats.totalReadingLessons, items: stats.totalReadingQuestions, to: '/admin/reading' },
      { key: 'speaking', name: 'Luyện nói', lessons: stats.totalSpeakingLessons, items: stats.totalSpeakingQuestions, to: '/admin/speaking' },
      { key: 'writing', name: 'Luyện viết', lessons: stats.totalWritingLessons, items: stats.totalWritingExercises, to: '/admin/writing' },
      { key: 'grammar', name: 'Ngữ pháp', lessons: stats.totalGrammarTopics, items: stats.totalGrammarQuiz, to: '/admin/grammar' },
      { key: 'games', name: 'Trò chơi', lessons: stats.totalGameLevels, items: stats.totalQuestions, to: '/admin/games' },
      { key: 'vocabulary', name: 'Từ vựng', lessons: stats.totalVocabularyCollections, items: stats.totalVocabularyWords, to: '/admin/vocabulary' },
    ];

    return success(res, stats);
  } catch (err) { next(err); }
});
// ========== USER MANAGEMENT ==========

router.post('/users', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminUserService.createUser(req.body);
    return success(res, data, 'User account created', 201);
  } catch (err) { next(err); }
});

router.get('/users', requireRole('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', role = 'all' } = req.query;
    const data = await adminUserService.getAllUsers(Number(page), Number(limit), search, role);
    return success(res, data);
  } catch (err) { next(err); }
});

router.get('/users/stats', requireRole('admin'), async (req, res, next) => {
  try {
    const stats = await adminUserService.getUserStats();
    return success(res, stats);
  } catch (err) { next(err); }
});

router.get('/users/:id/detail', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminUserService.getLearnerDetail(req.params.id);
    return success(res, data);
  } catch (err) { next(err); }
});

router.put('/users/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminUserService.updateUser(req.params.id, req.body, req.user.id);
    return success(res, data, 'User account updated');
  } catch (err) { next(err); }
});

router.put('/users/:id/plus-days', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminUserService.giftPlusDays(req.params.id, req.body.days, req.user.id);
    return success(res, data, 'Plus days gifted');
  } catch (err) { next(err); }
});

router.put('/users/:id/password', requireRole('admin'), async (req, res, next) => {
  try {
    await adminUserService.resetPassword(req.params.id, req.body.password);
    return success(res, null, 'User password reset');
  } catch (err) { next(err); }
});

router.put('/users/:id/toggle-active', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminUserService.toggleUserActive(req.params.id, req.user.id);
    return success(res, data, 'User status toggled');
  } catch (err) { next(err); }
});

router.delete('/users/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminUserService.deleteUser(req.params.id, req.user.id);
    return success(res, null, 'User account deleted');
  } catch (err) { next(err); }
});

module.exports = router;
