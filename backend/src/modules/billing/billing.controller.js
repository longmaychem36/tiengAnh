// ============================================
// Billing Module - Controller
// ============================================
const billingService = require('./billing.service');
const { success } = require('../../utils/responseHelper');

const billingController = {
  async getSubscription(req, res, next) {
    try {
      const subscription = await billingService.getUserPlan(req.user.id);
      const upgrade = billingService.getUpgradeInfo();
      return success(res, { subscription, upgrade });
    } catch (err) {
      next(err);
    }
  },

  async createPlusOrder(req, res, next) {
    try {
      const result = await billingService.createPlusOrder(req.user.id);
      return success(res, result, 'Plus payment order created');
    } catch (err) {
      next(err);
    }
  },

  async getPlusOrderStatus(req, res, next) {
    try {
      const result = await billingService.getPlusOrderStatus(req.user.id, req.params.id);
      return success(res, result);
    } catch (err) {
      next(err);
    }
  },

  async handleSepayWebhook(req, res, next) {
    try {
      console.log('[SePay webhook] headers:', JSON.stringify({
        authorization: req.headers.authorization ? 'present' : 'missing',
        xSepayApiKey: req.headers['x-sepay-api-key'] ? 'present' : 'missing',
        xApiKey: req.headers['x-api-key'] ? 'present' : 'missing'
      }));

      if (!billingService.verifySepayWebhook(req)) {
        console.log('[SePay webhook] invalid API key');
        return res.status(401).json({ success: false, message: 'Invalid webhook API key' });
      }

      await billingService.handleSepayWebhook(req.body);
      return res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = billingController;
