// ============================================
// Dictionary Module — Controller
// ============================================
const dictionaryService = require('./dictionary.service');
const { success, created, notFound, badRequest, paginated } = require('../../utils/responseHelper');

const dictionaryController = {
  async search(req, res, next) {
    try {
      const { q, page = 1, limit = 20, levelId, direction = 'en-vi' } = req.query;
      if (!q || q.trim().length === 0) {
        return success(res, [], 'Please provide a search query');
      }
      const result = await dictionaryService.search({ query: q, page, limit, levelId, direction });

      // Log search history if user is authenticated
      if (req.headers.authorization) {
        try {
          const { verifyToken } = require('../../config/jwt');
          const token = req.headers.authorization.split(' ')[1];
          const decoded = verifyToken(token);
          await dictionaryService.logSearch(decoded.id, q);
        } catch (e) { /* ignore auth errors for search logging */ }
      }

      // Include suggestions in response meta
      const response = paginated(res, result.entries, result.total, page, limit, 'Success', { suggestions: result.suggestions || [] });
      return response;
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const entry = await dictionaryService.getById(req.params.id);
      if (!entry) return notFound(res, 'Dictionary entry not found');
      return success(res, entry);
    } catch (err) {
      next(err);
    }
  },

  async getHistory(req, res, next) {
    try {
      const history = await dictionaryService.getHistory(req.user.id);
      return success(res, history);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const entry = await dictionaryService.create(req.body);
      return created(res, entry, 'Dictionary entry created');
    } catch (err) {
      next(err);
    }
  },

  async autocomplete(req, res, next) {
    try {
      const { q, limit = 8 } = req.query;
      if (!q || q.trim().length < 1) return success(res, []);
      const results = await dictionaryService.autocomplete(q.trim(), parseInt(limit));
      return success(res, results);
    } catch (err) {
      next(err);
    }
  },

  async translateSentence(req, res, next) {
    try {
      const { text, direction = 'en-vi' } = req.body;
      if (!text || text.trim().length === 0) {
        return badRequest(res, 'Text is required');
      }
      const result = await dictionaryService.translateSentence(text.trim(), direction);
      return success(res, result);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dictionaryController;
