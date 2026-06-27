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
const dictionaryRoutes = require('./modules/dictionary/dictionary.routes');
const gameRoutes = require('./modules/game/game.routes');
const gamificationRoutes = require('./modules/gamification/gamification.routes');
const speakingRoutes = require('./modules/speaking/speaking.routes');
const collectionRoutes = require('./modules/collection/collection.routes');
const grammarRoutes = require('./modules/grammar/grammar.routes');
const writingRoutes = require('./modules/writing/writing.routes');
const billingRoutes = require('./modules/billing/billing.routes');
const listeningRoutes = require('./modules/listening/listening.routes');
const readingRoutes = require('./modules/reading/reading.routes');
const dailyRoutes = require('./modules/daily/daily.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const studyTimeRoutes = require('./modules/study-time/study-time.routes');
const onboardingRoutes = require('./modules/onboarding/onboarding.routes');
const supportRoutes = require('./modules/support/support.routes');
const notificationRoutes = require('./modules/notification/notification.routes');
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
app.use('/api/v1/dictionary', dictionaryRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/speaking', speakingRoutes);
app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/grammar', grammarRoutes);
app.use('/api/v1/writing', writingRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/listening', listeningRoutes);
app.use('/api/v1/reading', readingRoutes);
app.use('/api/v1/daily-tasks', dailyRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/study-time', studyTimeRoutes);
app.use('/api/v1/onboarding', onboardingRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Admin routes (role-guarded internally)
const adminRoutes = require('./modules/admin/admin.routes');
const adminNotificationRoutes = require('./modules/notification/admin.notification.routes');
app.use('/api/v1/admin/notifications', adminNotificationRoutes);
app.use('/api/v1/admin', adminRoutes);

// Alias routes: GET /user/stats and POST /user/exp
const gamificationController = require('./modules/gamification/gamification.controller');
const authMiddlewareAlias = require('./middlewares/authMiddleware');
const { learnerOnly } = require('./middlewares/roleMiddleware');
app.get('/api/v1/user/stats', authMiddlewareAlias, learnerOnly(), gamificationController.getStats);
app.post('/api/v1/user/exp', authMiddlewareAlias, learnerOnly(), gamificationController.addExp);

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
