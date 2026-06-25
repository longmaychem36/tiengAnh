const billingService = require('../modules/billing/billing.service');

function requirePlus(featureName = 'tính năng này') {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const isPlus = await billingService.isPlusUser(req.user.id);
      if (!isPlus) {
        return res.status(403).json({
          success: false,
          code: 'PLUS_REQUIRED',
          message: `Vui lòng nâng cấp Plus để sử dụng ${featureName}.`
        });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = { requirePlus };
