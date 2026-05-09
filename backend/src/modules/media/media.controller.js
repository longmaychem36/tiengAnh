// ============================================
// Media Module — Controller
// ============================================
const mediaService = require('./media.service');
const { success, badRequest } = require('../../utils/responseHelper');

const mediaController = {
  async uploadImage(req, res, next) {
    try {
      if (!req.file) return badRequest(res, 'Image file is required');
      const url = `/uploads/images/${req.file.filename}`;
      const result = await mediaService.saveMedia(req.body.lessonId, 'image', url, req.body.description);
      return success(res, { url, ...result }, 'Image uploaded successfully');
    } catch (err) {
      next(err);
    }
  },

  async uploadAudio(req, res, next) {
    try {
      if (!req.file) return badRequest(res, 'Audio file is required');
      const url = `/uploads/audio/${req.file.filename}`;
      const result = await mediaService.saveMedia(req.body.lessonId, 'audio', url, req.body.description);
      return success(res, { url, ...result }, 'Audio uploaded successfully');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = mediaController;
