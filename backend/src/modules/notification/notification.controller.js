const notificationService = require('./notification.service');
const { success, paginated } = require('../../utils/responseHelper');

const notificationController = {
  async listMine(req, res, next) {
    try {
      const data = await notificationService.listForUser(req.user.id, req.query.limit);
      return success(res, data);
    } catch (err) {
      next(err);
    }
  },

  async markRead(req, res, next) {
    try {
      const data = await notificationService.markRead(req.user.id, req.params.recipientId || null);
      return success(res, data, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  },

  async adminList(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const data = await notificationService.adminList(page, limit);
      return paginated(res, data.notifications, data.total, data.page, data.limit);
    } catch (err) {
      next(err);
    }
  },

  async adminCreate(req, res, next) {
    try {
      const data = await notificationService.createNotification({
        ...req.body,
        createdBy: req.user.id
      });
      return success(res, data, 'Notification sent', 201);
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }
      next(err);
    }
  }
};

module.exports = notificationController;
