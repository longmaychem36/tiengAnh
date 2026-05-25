// ============================================
// Billing Module - Routes
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');
const billingController = require('./billing.controller');

router.post('/sepay/webhook', billingController.handleSepayWebhook);

router.use(authMiddleware, learnerOnly());

router.get('/subscription', billingController.getSubscription);
router.post('/plus/orders', billingController.createPlusOrder);
router.get('/plus/orders/:id', billingController.getPlusOrderStatus);

module.exports = router;
