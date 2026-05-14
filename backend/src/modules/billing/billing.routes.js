// ============================================
// Billing Module - Routes
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const billingController = require('./billing.controller');

router.post('/sepay/webhook', billingController.handleSepayWebhook);

router.use(authMiddleware);

router.get('/subscription', billingController.getSubscription);
router.post('/plus/orders', billingController.createPlusOrder);
router.get('/plus/orders/:id', billingController.getPlusOrderStatus);

module.exports = router;
