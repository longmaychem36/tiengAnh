// ============================================
// Application Constants
// ============================================

// Gamification
const EXP_REWARDS = {
  LESSON_COMPLETE: 35,
  SPEAKING_LESSON_COMPLETE: 45,
  WRITING_LESSON_COMPLETE: 55,
  QUIZ_COMPLETE: 25,
  GAME_WIN: 30,
  GAME_REPLAY_FACTOR: 0.25,
  PERFECT_SCORE_BONUS: 10,
  DAILY_LOGIN: 10,
  STREAK_BONUS: 5      // per day of streak
};

const MAX_LEVEL = 10;
const LEVEL_THRESHOLDS = [
  0,    // unused index, levels start at 1
  0,    // level 1
  120,  // level 2
  300,  // level 3
  550,  // level 4
  900,  // level 5
  1350, // level 6
  1900, // level 7
  2600, // level 8
  3400, // level 9
  4400  // level 10
];

module.exports = {
  EXP_REWARDS,
  LEVEL_THRESHOLDS,
  MAX_LEVEL
};
