const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');
const notificationController = require('./notification.controller');

router.use(authMiddleware, learnerOnly());

router.get('/', notificationController.listMine);
router.put('/read-all', notificationController.markRead);
router.put('/:recipientId/read', notificationController.markRead);

module.exports = router;
