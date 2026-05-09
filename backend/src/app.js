// ============================================
// Express Application Setup
// ============================================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const corsOptions = require('./config/cors');
const errorHandler = require('./middlewares/errorHandler');

// Import Routes
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const courseRoutes = require('./modules/course/course.routes');
const lessonRoutes = require('./modules/lesson/lesson.routes');
const dictionaryRoutes = require('./modules/dictionary/dictionary.routes');
const vocabularyRoutes = require('./modules/vocabulary/vocabulary.routes');
const quizRoutes = require('./modules/quiz/quiz.routes');
const gameRoutes = require('./modules/game/game.routes');
const progressRoutes = require('./modules/progress/progress.routes');
const gamificationRoutes = require('./modules/gamification/gamification.routes');
const speakingRoutes = require('./modules/speaking/speaking.routes');
const mediaRoutes = require('./modules/media/media.routes');
const collectionRoutes = require('./modules/collection/collection.routes');
const grammarRoutes = require('./modules/grammar/grammar.routes');
const writingRoutes = require('./modules/writing/writing.routes');
const app = express();

// ==================
// Global Middleware
// ==================
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files — serve uploaded media
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ==================
// Health Check
// ==================
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'English Learning System API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ==================
// API Routes (v1)
// ==================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/lessons', lessonRoutes);
app.use('/api/v1/dictionary', dictionaryRoutes);
app.use('/api/v1/vocabulary', vocabularyRoutes);
app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/speaking', speakingRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/grammar', grammarRoutes);
app.use('/api/v1/writing', writingRoutes);

// Admin routes (role-guarded internally)
const adminRoutes = require('./modules/admin/admin.routes');
app.use('/api/v1/admin', adminRoutes);

// Alias routes: GET /user/stats and POST /user/exp
const gamificationController = require('./modules/gamification/gamification.controller');
const authMiddlewareAlias = require('./middlewares/authMiddleware');
app.get('/api/v1/user/stats', authMiddlewareAlias, gamificationController.getStats);
app.post('/api/v1/user/exp', authMiddlewareAlias, gamificationController.addExp);

// ==================
// 404 Handler
// ==================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// ==================
// Global Error Handler
// ==================
app.use(errorHandler);

module.exports = app;
