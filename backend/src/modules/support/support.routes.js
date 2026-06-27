const router = require('express').Router();
const multer = require('multer');
const authMiddleware = require('../../middlewares/authMiddleware');
const { learnerOnly } = require('../../middlewares/roleMiddleware');
const supportController = require('./support.controller');

const attachmentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype)) {
      cb(null, true);
      return;
    }
    const err = new Error('Attachment must be a PNG, JPG, WEBP, or GIF image');
    err.statusCode = 400;
    cb(err);
  }
});

router.use(authMiddleware, learnerOnly());

router.get('/tickets', supportController.getMyTickets);
router.get('/tickets/:id', supportController.getMyTicket);
router.post('/tickets', attachmentUpload.single('attachment'), supportController.createTicket);
router.post('/tickets/:id/messages', attachmentUpload.single('attachment'), supportController.addMyMessage);

module.exports = router;
