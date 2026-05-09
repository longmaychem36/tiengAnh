// ============================================
// Admin Routes — Game Management + User Management
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { requireRole, superAdminOnly } = require('../../middlewares/roleMiddleware');
const adminGameService = require('./admin.game.service');
const adminUserService = require('./admin.user.service');
const { success, badRequest, notFound } = require('../../utils/responseHelper');

// All admin routes require at least admin role
router.use(authMiddleware);

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
