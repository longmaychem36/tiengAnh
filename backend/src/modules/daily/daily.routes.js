const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');
const dailyController = require('./daily.controller');

router.use(authMiddleware, learnerOnly());

router.get('/today', dailyController.getToday);
router.post('/:id/complete', dailyController.completeTask);

module.exports = router;
