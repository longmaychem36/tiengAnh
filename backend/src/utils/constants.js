// ============================================
// Application Constants
// ============================================

// Gamification
const EXP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_COMPLETE: 30,
  GAME_WIN: 40,
  DAILY_LOGIN: 10,
  STREAK_BONUS: 5      // per day of streak
};

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1800, 2800, 4000, 5500, 7500, 10000
];

module.exports = {
  EXP_REWARDS,
  LEVEL_THRESHOLDS
};
