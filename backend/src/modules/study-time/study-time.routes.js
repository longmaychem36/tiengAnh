const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');
const studyTimeController = require('./study-time.controller');

router.use(authMiddleware, learnerOnly());

router.post('/heartbeat', studyTimeController.heartbeat);

module.exports = router;
