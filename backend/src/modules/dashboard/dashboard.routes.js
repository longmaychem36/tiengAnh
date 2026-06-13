const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');
const dashboardController = require('./dashboard.controller');

router.use(authMiddleware, learnerOnly());

router.get('/overview', dashboardController.getOverview);

module.exports = router;
