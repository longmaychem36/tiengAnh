// ============================================
// Admin Routes — Game Management + User Management
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { requireRole, superAdminOnly } = require('../../middlewares/roleMiddleware');
const adminGameService = require('./admin.game.service');
const adminUserService = require('./admin.user.service');
const adminContentService = require('./admin.content.service');
const adminPlacementService = require('./admin.placement.service');
const { success, badRequest, notFound } = require('../../utils/responseHelper');

// All admin routes require at least admin role
router.use(authMiddleware);

// ========== PLACEMENT TEST MANAGEMENT (admin + superadmin) ==========
router.get('/placement/tests', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminPlacementService.getTests();
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/placement/tests', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminPlacementService.createTest(req.body);
    return success(res, data, 'Placement test created');
  } catch (err) { next(err); }
});

router.put('/placement/tests/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminPlacementService.updateTest(req.params.id, req.body);
    if (!data) return notFound(res, 'Placement test not found');
    return success(res, data, 'Placement test updated');
  } catch (err) { next(err); }
});

router.delete('/placement/tests/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminPlacementService.deleteTest(req.params.id);
    return success(res, null, 'Placement test deleted');
  } catch (err) { next(err); }
});

router.get('/placement/tests/:id/questions', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminPlacementService.getQuestions(req.params.id);
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/placement/questions', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminPlacementService.createQuestion(req.body);
    return success(res, data, 'Placement question created');
  } catch (err) { next(err); }
});

router.put('/placement/questions/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminPlacementService.updateQuestion(req.params.id, req.body);
    if (!data) return notFound(res, 'Placement question not found');
    return success(res, data, 'Placement question updated');
  } catch (err) { next(err); }
});

router.delete('/placement/questions/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await adminPlacementService.deleteQuestion(req.params.id);
    return success(res, null, 'Placement question deleted');
  } catch (err) { next(err); }
});

// ========== SPEAKING MANAGEMENT (admin + superadmin) ==========
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

router.delete('/speaking/lessons/:id', superAdminOnly(), async (req, res, next) => {
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

// ========== WRITING MANAGEMENT (admin + superadmin) ==========
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

router.delete('/writing/lessons/:id', superAdminOnly(), async (req, res, next) => {
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

// ========== LISTENING / READING MANAGEMENT (admin + superadmin) ==========
registerReceptiveAdminRoutes('listening', 'segments', 'Segment');
registerReceptiveAdminRoutes('reading', 'paragraphs', 'Paragraph');

// ========== GRAMMAR MANAGEMENT (admin + superadmin) ==========
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

router.delete('/grammar/categories/:id', superAdminOnly(), async (req, res, next) => {
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

// ========== VOCABULARY MANAGEMENT (admin + superadmin) ==========
router.get('/vocabulary/collections', requireRole('admin'), async (req, res, next) => {
  try {
    const data = await adminContentService.getVocabularyCollections(req.query.status || 'all');
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
    await adminContentService.reviewVocabularyCollection(req.params.id, status, req.user.id);
    return success(res, null, 'Vocabulary collection reviewed');
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

// ========== GAME MANAGEMENT (admin + superadmin) ==========

// Sets CRUD
router.post('/games/sets', requireRole('admin'), async (req, res, next) => {
  try {
    const set = await adminGameService.createSet(req.body);
    return success(res, set, 'Game set created');
  } catch (err) { next(err); }
});

router.put('/games/sets/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const set = await adminGameService.updateSet(req.params.id, req.body);
    return success(res, set, 'Game set updated');
  } catch (err) { next(err); }
});

router.delete('/games/sets/:id', superAdminOnly(), async (req, res, next) => {
  try {
    await adminGameService.deleteSet(req.params.id);
    return success(res, null, 'Game set deleted');
  } catch (err) { next(err); }
});

// Levels CRUD
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

router.delete('/games/levels/:id', superAdminOnly(), async (req, res, next) => {
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

// ========== DASHBOARD STATS (admin + superadmin) ==========
router.get('/dashboard/stats', requireRole('admin'), async (req, res, next) => {
  try {
    const { getPool } = require('../../config/database');
    const pool = getPool();
    const countTable = async (tableName) => {
      try {
        return await pool.query(`SELECT count(*) as count FROM ${tableName}`);
      } catch (err) {
        return { rows: [{ count: 0 }] };
      }
    };
    const queries = await Promise.all([
      countTable('Users'),
      pool.query("SELECT count(*) as count FROM Users WHERE isactive = true"),
      pool.query("SELECT count(*) as count FROM Users WHERE createdat >= NOW() - INTERVAL '7 days'"),
      countTable('GameSets'),
      countTable('GameLevels'),
      countTable('MiniGameQuestions'),
      countTable('SpeakingLessons'),
      countTable('SpeakingQuestions'),
      countTable('WritingLessons'),
      countTable('WritingExercises'),
      countTable('GrammarCategories'),
      countTable('GrammarTopics'),
      countTable('ListeningLessons'),
      countTable('ListeningQuestions'),
      countTable('ReadingLessons'),
      countTable('ReadingQuestions'),
    ]);
    const stats = {
      totalUsers: parseInt(queries[0].rows[0].count),
      activeUsers: parseInt(queries[1].rows[0].count),
      newUsers7d: parseInt(queries[2].rows[0].count),
      totalGameSets: parseInt(queries[3].rows[0].count),
      totalGameLevels: parseInt(queries[4].rows[0].count),
      totalQuestions: parseInt(queries[5].rows[0].count),
      totalSpeakingLessons: parseInt(queries[6].rows[0].count),
      totalSpeakingQuestions: parseInt(queries[7].rows[0].count),
      totalWritingLessons: parseInt(queries[8].rows[0].count),
      totalWritingExercises: parseInt(queries[9].rows[0].count),
      totalGrammarCategories: parseInt(queries[10].rows[0].count),
      totalGrammarTopics: parseInt(queries[11].rows[0].count),
      totalListeningLessons: parseInt(queries[12].rows[0].count),
      totalListeningQuestions: parseInt(queries[13].rows[0].count),
      totalReadingLessons: parseInt(queries[14].rows[0].count),
      totalReadingQuestions: parseInt(queries[15].rows[0].count),
    };
    stats.totalSkillLessons = stats.totalSpeakingLessons + stats.totalWritingLessons + stats.totalListeningLessons + stats.totalReadingLessons;
    return success(res, stats);
  } catch (err) { next(err); }
});

// ========== USER MANAGEMENT (superadmin only) ==========

router.get('/users', superAdminOnly(), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const data = await adminUserService.getAllUsers(Number(page), Number(limit), search);
    return success(res, data);
  } catch (err) { next(err); }
});

router.get('/users/stats', superAdminOnly(), async (req, res, next) => {
  try {
    const stats = await adminUserService.getUserStats();
    return success(res, stats);
  } catch (err) { next(err); }
});

router.put('/users/:id/role', superAdminOnly(), async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) return badRequest(res, 'Role is required');
    // Prevent demoting yourself
    if (req.params.id === req.user.id) return badRequest(res, 'Cannot change your own role');
    await adminUserService.updateUserRole(req.params.id, role);
    return success(res, null, `Role updated to ${role}`);
  } catch (err) { next(err); }
});

router.put('/users/:id/toggle-active', superAdminOnly(), async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) return badRequest(res, 'Cannot lock your own account');
    await adminUserService.toggleUserActive(req.params.id);
    return success(res, null, 'User status toggled');
  } catch (err) { next(err); }
});

module.exports = router;
