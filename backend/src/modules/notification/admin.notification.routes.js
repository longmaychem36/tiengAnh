const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { authorize } = require('../../middlewares/roleMiddleware');
const notificationController = require('./notification.controller');

router.use(authMiddleware, authorize('admin'));

router.get('/', notificationController.adminList);
router.post('/', notificationController.adminCreate);

module.exports = router;
