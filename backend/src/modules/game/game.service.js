// ============================================
// Mini Game Module — Service (PostgreSQL, Mixed Game Support)
// ============================================
const { getPool } = require('../../config/database');
const { EXP_REWARDS } = require('../../utils/constants');

const gameService = {
  // ==================
  // GET all game sets (with user progress)
  // ==================
  async getSets(userId) {
    const pool = getPool();
    const result = await pool.query(`
      SELECT gs.*,
        (SELECT COUNT(*) FROM GameLevels WHERE SetId = gs.Id) as "LevelCount"
      FROM GameSets gs
      ORDER BY gs.OrderIndex ASC
    `);

    const sets = result.rows.map(r => ({
      ...r,
      Id: r.id, Name: r.name, Description: r.description, Icon: r.icon,
      GameType: r.gametype, OrderIndex: r.orderindex, LevelCount: parseInt(r.LevelCount)
    }));

    if (userId) {
      for (const set of sets) {
        const progressRes = await pool.query(`
          SELECT COUNT(*) as completedlevels,
                 COALESCE(SUM(ugp.stars), 0) as totalstars
          FROM GameLevels gl
          INNER JOIN UserGameProgress ugp ON gl.Id = ugp.LevelId AND ugp.UserId = $1 AND ugp.IsCompleted = true
          WHERE gl.SetId = $2
        `, [userId, set.Id]);
        set.CompletedLevels = parseInt(progressRes.rows[0].completedlevels);
        set.TotalStars = parseInt(progressRes.rows[0].totalstars);
        set.MaxStars = set.LevelCount * 3;
        set.IsSetCompleted = set.CompletedLevels >= set.LevelCount;
      }
    }

    return sets;
  },

  // ==================
  // GET levels by set (with user progress & dynamic unlock)
  // ==================
  async getLevelsBySet(setId, userId) {
    const pool = getPool();

    const result = await pool.query(`
      SELECT gl.Id, gl.SetId, gl.LevelNumber, gl.Name, gl.Difficulty,
             gl.TimeLimit, gl.PassScore, gl.IsLocked,
             (SELECT COUNT(*) FROM MiniGameQuestions WHERE LevelId = gl.Id) as "QuestionCount"
             ${userId ? `, ugp.Score as "UserScore", ugp.Stars as "UserStars", ugp.IsCompleted as "UserCompleted", ugp.BestTime, ugp.Attempts` : ''}
      FROM GameLevels gl
      ${userId ? `LEFT JOIN UserGameProgress ugp ON gl.Id = ugp.LevelId AND ugp.UserId = $2` : ''}
      WHERE gl.SetId = $1
      ORDER BY gl.LevelNumber ASC
    `, userId ? [setId, userId] : [setId]);

    const levels = result.rows.map(r => ({
      Id: r.id, SetId: r.setid, LevelNumber: r.levelnumber, Name: r.name,
      Difficulty: r.difficulty, TimeLimit: r.timelimit, PassScore: r.passscore,
      IsLocked: r.islocked, QuestionCount: parseInt(r.QuestionCount),
      UserScore: r.UserScore || 0, UserStars: r.UserStars || 0,
      UserCompleted: r.UserCompleted || false,
    }));

    // Dynamic unlock: level N is unlocked if level N-1 is completed
    if (userId) {
      for (let i = 0; i < levels.length; i++) {
        levels[i].IsLocked = i === 0 ? false : !levels[i - 1].UserCompleted;
      }
    }

    return levels;
  },

  // ==================
  // GET questions for a level (shuffle, limit 10)
  // ==================
  async getQuestions(levelId) {
    const pool = getPool();

    const levelRes = await pool.query(`
      SELECT gl.*, gs.GameType, gs.Name as "SetName"
      FROM GameLevels gl
      JOIN GameSets gs ON gl.SetId = gs.Id
      WHERE gl.Id = $1
    `, [levelId]);
    if (levelRes.rows.length === 0) return null;

    const row = levelRes.rows[0];
    const level = {
      Id: row.id, SetId: row.setid, LevelNumber: row.levelnumber, Name: row.name,
      Difficulty: row.difficulty, TimeLimit: row.timelimit, PassScore: row.passscore,
      IsLocked: row.islocked, GameType: row.gametype, SetName: row.setname
    };

    // Get questions — shuffle via random(), limit 10
    const questionsRes = await pool.query(`
      SELECT Id, QuestionType, ContentEN, ContentVI, AudioUrl, ImageUrl, CorrectAnswer, Options, OrderIndex
      FROM MiniGameQuestions
      WHERE LevelId = $1
      ORDER BY RANDOM()
      LIMIT 10
    `, [levelId]);

    const questions = questionsRes.rows.map(q => ({
      Id: q.id,
      QuestionType: q.questiontype,
      ContentEN: q.contenten,
      ContentVI: q.contentvi,
      AudioUrl: q.audiourl,
      ImageUrl: q.imageurl,
      CorrectAnswer: q.correctanswer,
      Options: q.options ? JSON.parse(q.options) : null,
      OrderIndex: q.orderindex
    }));

    return { level, questions };
  },

  // ==================
  // POST submit answers
  // ==================
  async submitLevel(userId, levelId, answers, duration) {
    const pool = getPool();

    const data = await this.getQuestions(levelId);
    if (!data) throw new Error('Level not found');
    const { level, questions } = data;

    // Re-fetch all questions (not just random 10) to score accurately
    const allQRes = await pool.query(`
      SELECT Id, QuestionType, CorrectAnswer, Options FROM MiniGameQuestions WHERE LevelId = $1
    `, [levelId]);
    const allQuestions = allQRes.rows.map(q => ({
      Id: q.id, QuestionType: q.questiontype, CorrectAnswer: q.correctanswer,
      Options: q.options ? JSON.parse(q.options) : null
    }));

    let correctCount = 0;
    const results = [];

    for (const q of allQuestions) {
      const userAnswer = answers.find(a => a.questionId === q.Id);
      if (!userAnswer) continue;

      let isCorrect = false;
      const ua = (userAnswer.answer || '').toLowerCase().trim();
      const ca = (q.CorrectAnswer || '').toLowerCase().trim();

      if (q.QuestionType === 'matching') {
        isCorrect = ua === ca;
      } else if (q.QuestionType === 'listening') {
        isCorrect = ua === ca;
      } else if (q.QuestionType === 'listenbuild') {
        // Compare word by word, trim punctuation
        isCorrect = ua.replace(/[.,!?]/g, '') === ca.replace(/[.,!?]/g, '');
      } else if (q.QuestionType === 'truefalse') {
        isCorrect = ua === ca;
      } else {
        isCorrect = ua === ca;
      }

      if (isCorrect) correctCount++;
      results.push({ questionId: q.Id, correct: isCorrect, correctAnswer: q.CorrectAnswer, userAnswer: userAnswer.answer });
    }

    const totalQuestions = answers.length || allQuestions.length;
    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePercent >= level.PassScore;
    let stars = scorePercent >= 90 ? 3 : scorePercent >= 70 ? 2 : scorePercent >= 50 ? 1 : 0;

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

    // Award EXP
    let expEarned = 0;
    if (passed) {
      expEarned = EXP_REWARDS.GAME_WIN || 25;
      if (scorePercent >= 90) expEarned = Math.round(expEarned * 1.5);
      try {
        await pool.query(`
          INSERT INTO UserStats (UserId, Exp, Level, StreakDays)
          VALUES ($1, 0, 1, 0)
          ON CONFLICT (UserId) DO NOTHING
        `, [userId]);
        await pool.query(`
          UPDATE UserStats SET Exp = Exp + $2,
            Level = CASE
              WHEN Exp + $2 >= 10000 THEN 10 WHEN Exp + $2 >= 7500 THEN 9
              WHEN Exp + $2 >= 5500 THEN 8  WHEN Exp + $2 >= 4000 THEN 7
              WHEN Exp + $2 >= 2800 THEN 6  WHEN Exp + $2 >= 1800 THEN 5
              WHEN Exp + $2 >= 1000 THEN 4  WHEN Exp + $2 >= 500 THEN 3
              WHEN Exp + $2 >= 250 THEN 2   WHEN Exp + $2 >= 100 THEN 1
              ELSE Level END
          WHERE UserId = $1
        `, [userId, expEarned]);
      } catch (e) { console.error('EXP error (non-fatal):', e.message); }
    }

    return { score: scorePercent, stars, passed, correctCount, totalQuestions, expEarned, duration: duration || 0, results };
  }
};

module.exports = gameService;
