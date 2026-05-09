// ============================================
// Mini Game Module — Routes
// ============================================
const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const gameController = require('./game.controller');
const axios = require('axios');

// Public
router.get('/sets', gameController.getSets);

// Audio proxy endpoint — avoid CORS issues
router.get('/audio/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });
  
  try {
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    });
    res.set('Content-Type', response.headers['content-type']);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(response.data);
  } catch (err) {
    console.error('Audio proxy error:', err.message);
    res.status(500).json({ error: 'Failed to fetch audio' });
  }
});

// Needs auth (for progress tracking)
router.get('/sets/:setId/levels', authMiddleware, gameController.getLevels);
router.get('/levels/:levelId/questions', authMiddleware, gameController.getQuestions);
router.post('/submit', authMiddleware, gameController.submit);

module.exports = router;
