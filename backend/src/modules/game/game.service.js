// ============================================
// Mini Game Module — Service (New: Set → Level → Question)
// ============================================
const { sql, getPool } = require('../../config/database');
const { EXP_REWARDS } = require('../../utils/constants');

const gameService = {
  // ==================
  // GET all game sets (with optional user progress for set-level unlock)
  // ==================
  async getSets(userId) {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT gs.*, 
        (SELECT COUNT(*) FROM GameLevels WHERE SetId = gs.Id) as LevelCount
      FROM GameSets gs
      ORDER BY gs.OrderIndex ASC
    `);

    if (userId) {
      // For each set, count completed levels
      for (const set of result.recordset) {
        const progressRes = await pool.request()
          .input('setId', sql.UniqueIdentifier, set.Id)
          .input('userId', sql.UniqueIdentifier, userId)
          .query(`
            SELECT COUNT(*) as completedLevels,
                   ISNULL(SUM(ugp.Stars), 0) as totalStars
            FROM GameLevels gl
            INNER JOIN UserGameProgress ugp ON gl.Id = ugp.LevelId AND ugp.UserId = @userId AND ugp.IsCompleted = 1
            WHERE gl.SetId = @setId
          `);
        set.CompletedLevels = progressRes.recordset[0].completedLevels;
        set.TotalStars = progressRes.recordset[0].totalStars;
        set.MaxStars = set.LevelCount * 3;
        set.IsSetCompleted = set.CompletedLevels >= set.LevelCount;
      }
    }

    return result.recordset;
  },

  // ==================
  // GET levels by set (with user progress)
  // ==================
  async getLevelsBySet(setId, userId) {
    const pool = getPool();
    const req = pool.request().input('setId', sql.UniqueIdentifier, setId);

    let progressJoin = '';
    if (userId) {
      req.input('userId', sql.UniqueIdentifier, userId);
      progressJoin = `LEFT JOIN UserGameProgress ugp ON gl.Id = ugp.LevelId AND ugp.UserId = @userId`;
    }

    const result = await req.query(`
      SELECT gl.Id, gl.SetId, gl.LevelNumber, gl.Name, gl.Difficulty, 
             gl.TimeLimit, gl.PassScore, gl.IsLocked,
             (SELECT COUNT(*) FROM MiniGameQuestions WHERE LevelId = gl.Id) as QuestionCount
             ${userId ? `, ugp.Score as UserScore, ugp.Stars as UserStars, ugp.IsCompleted as UserCompleted, ugp.BestTime, ugp.Attempts` : ''}
      FROM GameLevels gl
      ${progressJoin}
      WHERE gl.SetId = @setId
      ORDER BY gl.LevelNumber ASC
    `);

    const levels = result.recordset;

    // Dynamic unlock: level N is unlocked if level N-1 is completed
    if (userId) {
      for (let i = 0; i < levels.length; i++) {
        if (i === 0) {
          levels[i].IsLocked = false; // First level always unlocked
        } else {
          const prev = levels[i - 1];
          levels[i].IsLocked = !prev.UserCompleted;
        }
      }
    }

    return levels;
  },

  // ==================
  // GET questions for a level
  // ==================
  async getQuestions(levelId) {
    const pool = getPool();

    // Get level info
    const levelRes = await pool.request()
      .input('levelId', sql.UniqueIdentifier, levelId)
      .query(`
        SELECT gl.*, gs.GameType, gs.Name as SetName
        FROM GameLevels gl
        JOIN GameSets gs ON gl.SetId = gs.Id
        WHERE gl.Id = @levelId
      `);
    if (levelRes.recordset.length === 0) return null;
    const level = levelRes.recordset[0];

    // Get questions
    const questionsRes = await pool.request()
      .input('levelId', sql.UniqueIdentifier, levelId)
      .query(`
        SELECT Id, QuestionType, ContentEN, ContentVI, AudioUrl, ImageUrl, CorrectAnswer, Options, OrderIndex
        FROM MiniGameQuestions
        WHERE LevelId = @levelId
        ORDER BY OrderIndex ASC
      `);

    const questions = questionsRes.recordset.map(q => ({
      ...q,
      Options: q.Options ? JSON.parse(q.Options) : null
    }));

    return { level, questions };
  },

  // ==================
  // POST submit answers for a level
  // ==================
  async submitLevel(userId, levelId, answers, duration) {
    const pool = getPool();

    // Get level + questions
    const data = await this.getQuestions(levelId);
    if (!data) throw new Error('Level not found');

    const { level, questions } = data;

    // Score calculation
    let correctCount = 0;
    const results = [];

    for (const q of questions) {
      const userAnswer = answers.find(a => a.questionId === q.Id);
      let isCorrect = false;

      if (userAnswer) {
        isCorrect = userAnswer.answer.toLowerCase().trim() === q.CorrectAnswer.toLowerCase().trim();
      }

      if (isCorrect) correctCount++;
      results.push({
        questionId: q.Id,
        correct: isCorrect,
        correctAnswer: q.CorrectAnswer,
        userAnswer: userAnswer?.answer || null
      });
    }

    const totalQuestions = questions.length;
    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePercent >= level.PassScore;

    // Calculate stars
    let stars = 0;
    if (scorePercent >= 90) stars = 3;
    else if (scorePercent >= 70) stars = 2;
    else if (scorePercent >= 50) stars = 1;

    // Save/update progress
    const existingProgress = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('levelId', sql.UniqueIdentifier, levelId)
      .query('SELECT * FROM UserGameProgress WHERE UserId = @userId AND LevelId = @levelId');

    const completedInt = passed ? 1 : 0;

    if (existingProgress.recordset.length > 0) {
      const old = existingProgress.recordset[0];
      const finalCompleted = (old.IsCompleted || passed) ? 1 : 0;
      await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .input('levelId', sql.UniqueIdentifier, levelId)
        .input('score', sql.Int, Math.max(old.Score, scorePercent))
        .input('stars', sql.Int, Math.max(old.Stars, stars))
        .input('completed', sql.Int, finalCompleted)
        .input('bestTime', sql.Int, (old.BestTime && old.BestTime < duration && old.BestTime > 0) ? old.BestTime : (duration || 0))
        .input('attempts', sql.Int, old.Attempts + 1)
        .query(`UPDATE UserGameProgress 
                SET Score = @score, Stars = @stars, IsCompleted = @completed, 
                    BestTime = @bestTime, Attempts = @attempts
                    ${passed ? ', CompletedAt = GETDATE()' : ''}
                WHERE UserId = @userId AND LevelId = @levelId`);
    } else {
      await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .input('levelId', sql.UniqueIdentifier, levelId)
        .input('score', sql.Int, scorePercent)
        .input('stars', sql.Int, stars)
        .input('completed', sql.Int, completedInt)
        .input('bestTime', sql.Int, duration || 0)
        .query(`INSERT INTO UserGameProgress (UserId,LevelId,Score,Stars,IsCompleted,BestTime,Attempts${passed ? ',CompletedAt' : ''}) 
                VALUES (@userId,@levelId,@score,@stars,@completed,@bestTime,1${passed ? ',GETDATE()' : ''})`);
    }

    // Award EXP (safe — create UserStats row if missing)
    let expEarned = 0;
    if (passed) {
      expEarned = EXP_REWARDS.GAME_WIN || 25;
      if (scorePercent >= 90) expEarned = Math.round(expEarned * 1.5);

      try {
        // Ensure UserStats row exists
        await pool.request()
          .input('userId', sql.UniqueIdentifier, userId)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM UserStats WHERE UserId = @userId)
            INSERT INTO UserStats (UserId, Exp, Level, StreakDays) VALUES (@userId, 0, 1, 0)
          `);

        await pool.request()
          .input('userId', sql.UniqueIdentifier, userId)
          .input('exp', sql.Int, expEarned)
          .query(`
            UPDATE UserStats
            SET Exp = Exp + @exp,
                Level = CASE
                  WHEN Exp + @exp >= 10000 THEN 10
                  WHEN Exp + @exp >= 7500 THEN 9
                  WHEN Exp + @exp >= 5500 THEN 8
                  WHEN Exp + @exp >= 4000 THEN 7
                  WHEN Exp + @exp >= 2800 THEN 6
                  WHEN Exp + @exp >= 1800 THEN 5
                  WHEN Exp + @exp >= 1000 THEN 4
                  WHEN Exp + @exp >= 500 THEN 3
                  WHEN Exp + @exp >= 250 THEN 2
                  WHEN Exp + @exp >= 100 THEN 1
                  ELSE Level
                END
            WHERE UserId = @userId
          `);
      } catch (expErr) {
        console.error('EXP award error (non-fatal):', expErr.message);
      }
    }

    return {
      score: scorePercent,
      stars,
      passed,
      correctCount,
      totalQuestions,
      expEarned,
      duration: duration || 0,
      results
    };
  }
};

module.exports = gameService;
