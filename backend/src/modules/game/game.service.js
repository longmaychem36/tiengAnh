// ============================================
// Mini Game Module — Service (PostgreSQL, Mixed Game Support)
// ============================================
const { getPool } = require('../../config/database');
const { EXP_REWARDS } = require('../../utils/constants');
const gamificationService = require('../gamification/gamification.service');
const dailyService = require('../daily/daily.service');

const GAME_DIFFICULTY_EXP = {
  easy: 24,
  medium: 34,
  hard: 46
};

function calculateGameExp({ difficulty, scorePercent, totalQuestions, alreadyCompleted }) {
  if (scorePercent < 50) return 0;

  const base = GAME_DIFFICULTY_EXP[difficulty] || EXP_REWARDS.GAME_WIN;
  const questionBonus = Math.min(12, Math.max(0, totalQuestions - 5) * 2);
  const scoreBonus = scorePercent >= 95
    ? EXP_REWARDS.PERFECT_SCORE_BONUS
    : scorePercent >= 85
      ? 6
      : scorePercent >= 70
        ? 3
        : 0;
  const firstClearExp = base + questionBonus + scoreBonus;

  if (!alreadyCompleted) return firstClearExp;
  return Math.max(5, Math.round(firstClearExp * EXP_REWARDS.GAME_REPLAY_FACTOR));
}

function normalizeText(value) {
  return String(value || '').toLowerCase().trim();
}

function normalizeSentence(value) {
  return normalizeText(value).replace(/[.,!?]/g, '');
}

function getSpeakingPassScore(options) {
  const configured = Number(options?.passScore);
  return Number.isFinite(configured) ? configured : 70;
}

function getAnswerText(answerValue) {
  if (answerValue && typeof answerValue === 'object') {
    return answerValue.transcript || answerValue.text || '';
  }
  return answerValue || '';
}

function getAnswerScore(answerValue) {
  if (!answerValue || typeof answerValue !== 'object') return 0;
  const score = Number(answerValue.score);
  return Number.isFinite(score) ? score : 0;
}

function parseOptions(value) {
  if (!value) return null;
  if (Array.isArray(value) || typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function shapeQuestionRow(q) {
  return {
    Id: q.id,
    QuestionType: q.questiontype,
    ContentEN: q.contenten,
    ContentVI: q.contentvi,
    AudioUrl: q.audiourl,
    ImageUrl: q.imageurl,
    CorrectAnswer: q.correctanswer,
    Options: parseOptions(q.options),
    OrderIndex: q.orderindex
  };
}

const gameService = {
  // ==================
  // GET all mini-game levels directly
  // ==================
  async getLevels(userId) {
    const pool = getPool();

    const result = await pool.query(`
      SELECT gl.Id, gl.LevelNumber, gl.Name, gl.Difficulty,
             gl.TimeLimit, gl.PassScore, gl.IsLocked,
             (SELECT COUNT(*) FROM MiniGameQuestions WHERE LevelId = gl.Id) as "QuestionCount"
             ${userId ? `, ugp.Score as "UserScore", ugp.Stars as "UserStars", ugp.IsCompleted as "UserCompleted", ugp.BestTime, ugp.Attempts` : ''}
      FROM GameLevels gl
      ${userId ? `LEFT JOIN UserGameProgress ugp ON gl.Id = ugp.LevelId AND ugp.UserId = $1` : ''}
      ORDER BY gl.LevelNumber ASC
    `, userId ? [userId] : []);

    const levels = result.rows.map(r => ({
      Id: r.id, LevelNumber: r.levelnumber, Name: r.name,
      Difficulty: r.difficulty, TimeLimit: r.timelimit, PassScore: r.passscore,
      IsLocked: r.islocked, QuestionCount: parseInt(r.QuestionCount),
      UserScore: r.UserScore || 0, UserStars: r.UserStars || 0,
      UserCompleted: r.UserCompleted || false,
    }));

    if (userId) {
      for (let i = 0; i < levels.length; i++) {
        levels[i].IsLocked = i === 0 ? false : !levels[i - 1].UserCompleted;
      }
    }

    return levels;
  },

  // ==================
  // GET every question configured for a level
  // ==================
  async getQuestions(levelId) {
    const pool = getPool();

    const levelRes = await pool.query(`
      SELECT gl.*
      FROM GameLevels gl
      WHERE gl.Id = $1
    `, [levelId]);
    if (levelRes.rows.length === 0) return null;

    const row = levelRes.rows[0];
    const level = {
      Id: row.id, LevelNumber: row.levelnumber, Name: row.name,
      Difficulty: row.difficulty, TimeLimit: row.timelimit, PassScore: row.passscore,
      IsLocked: row.islocked, GameType: 'mixed', SetName: 'Mini game'
    };

    // Return every question configured for this level.
    const questionsRes = await pool.query(`
      SELECT Id, QuestionType, ContentEN, ContentVI, AudioUrl, ImageUrl, CorrectAnswer, Options, OrderIndex
      FROM MiniGameQuestions
      WHERE LevelId = $1
      ORDER BY RANDOM()
    `, [levelId]);

    const questions = questionsRes.rows.map(shapeQuestionRow);

    return { level, questions };
  },

  // ==================
  // POST submit answers
  // ==================
  async submitLevel(userId, levelId, answers, duration, questionIds = []) {
    const pool = getPool();

    const data = await this.getQuestions(levelId);
    if (!data) throw new Error('Level not found');
    const { level, questions } = data;

    const playedQuestionIds = Array.isArray(questionIds)
      ? questionIds.filter(Boolean)
      : [];

    const allQRes = await pool.query(`
      SELECT Id, QuestionType, ContentEN, ContentVI, CorrectAnswer, Options FROM MiniGameQuestions WHERE LevelId = $1
    `, [levelId]);
    const allQuestions = allQRes.rows
      .filter(q => playedQuestionIds.length === 0 || playedQuestionIds.includes(q.id))
      .map(q => ({
        Id: q.id,
        QuestionType: q.questiontype,
        ContentEN: q.contenten,
        ContentVI: q.contentvi,
        CorrectAnswer: q.correctanswer,
        Options: parseOptions(q.options)
      }));

    let correctCount = 0;
    const results = [];

    for (const q of allQuestions) {
      const userAnswer = answers.find(a => a.questionId === q.Id);
      if (!userAnswer) continue;

      let isCorrect = false;
      const ua = normalizeText(getAnswerText(userAnswer.answer));
      const ca = normalizeText(q.CorrectAnswer);

      if (q.QuestionType === 'matching') {
        isCorrect = ua === normalizeText(q.ContentVI);
      } else if (q.QuestionType === 'listening') {
        isCorrect = ua === ca;
      } else if (q.QuestionType === 'listenbuild') {
        // Compare word by word, trim punctuation
        isCorrect = normalizeSentence(ua) === normalizeSentence(ca);
      } else if (q.QuestionType === 'truefalse') {
        isCorrect = ua === ca;
      } else if (q.QuestionType === 'speakrepeat') {
        isCorrect = getAnswerScore(userAnswer.answer) >= getSpeakingPassScore(q.Options);
      } else {
        isCorrect = ua === ca;
      }

      if (isCorrect) correctCount++;
      results.push({
        questionId: q.Id,
        questionType: q.QuestionType,
        correct: isCorrect,
        correctAnswer: q.CorrectAnswer,
        userAnswer: getAnswerText(userAnswer.answer),
        score: q.QuestionType === 'speakrepeat' ? getAnswerScore(userAnswer.answer) : undefined
      });
    }

    const totalQuestions = allQuestions.length || answers.length;
    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePercent >= level.PassScore;
    let stars = scorePercent >= 90 ? 3 : scorePercent >= 70 ? 2 : scorePercent >= 50 ? 1 : 0;
    const previousProgress = await pool.query(`
      SELECT IsCompleted, Score, Stars
      FROM UserGameProgress
      WHERE UserId = $1 AND LevelId = $2
    `, [userId, levelId]);
    const alreadyCompleted = previousProgress.rows[0]?.iscompleted === true;

    // UPSERT progress
    await pool.query(`
      INSERT INTO UserGameProgress (UserId, LevelId, Score, Stars, IsCompleted, BestTime, Attempts ${passed ? ', CompletedAt' : ''})
      VALUES ($1, $2, $3, $4, $5, $6, 1 ${passed ? ', NOW()' : ''})
      ON CONFLICT (UserId, LevelId) DO UPDATE SET
        Score = GREATEST(UserGameProgress.Score, EXCLUDED.Score),
        Stars = GREATEST(UserGameProgress.Stars, EXCLUDED.Stars),
        IsCompleted = UserGameProgress.IsCompleted OR EXCLUDED.IsCompleted,
        BestTime = CASE WHEN UserGameProgress.BestTime = 0 OR EXCLUDED.BestTime < UserGameProgress.BestTime THEN EXCLUDED.BestTime ELSE UserGameProgress.BestTime END,
        Attempts = UserGameProgress.Attempts + 1
        ${passed ? ', CompletedAt = COALESCE(UserGameProgress.CompletedAt, NOW())' : ''}
    `, [userId, levelId, scorePercent, stars, passed, duration || 0]);

    const expEarned = passed
      ? calculateGameExp({
        difficulty: level.Difficulty,
        scorePercent,
        totalQuestions,
        alreadyCompleted
      })
      : 0;
    let expReward = null;

    if (expEarned > 0) {
      try {
        expReward = await gamificationService.addExp(
          userId,
          expEarned,
          alreadyCompleted ? 'game_replay_complete' : 'game_level_complete'
        );
      } catch (e) { console.error('EXP error (non-fatal):', e.message); }
    }
    await dailyService.completeMatchingTasks(userId, 'game_level', levelId);

    return {
      score: scorePercent,
      stars,
      passed,
      correctCount,
      totalQuestions,
      expEarned,
      expReward,
      alreadyCompleted,
      duration: duration || 0,
      results
    };
  }
};

module.exports = gameService;


