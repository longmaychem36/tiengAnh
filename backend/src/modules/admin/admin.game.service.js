// ============================================
// Admin Mini Game Management - Service (PostgreSQL)
// ============================================
const { getPool } = require('../../config/database');
const { ensureOnboardingSchema } = require('../onboarding/onboarding.schema');
const { ensureSoftDeleteSchema } = require('../soft-delete/soft-delete.schema');

function parseOptions(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return null;
  }
}

function stringifyOptions(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    const list = value.split(',').map((item) => item.trim()).filter(Boolean);
    return list.length ? JSON.stringify(list) : null;
  }
  return JSON.stringify(value);
}

const adminGameService = {
  // ========== LEVELS ==========
  async getLevels() {
    await ensureSoftDeleteSchema();
    const pool = getPool();
    const r = await pool.query(
      `SELECT Id, LevelNumber, Name, Difficulty, TimeLimit, PassScore, IsLocked,
              (SELECT COUNT(*) FROM MiniGameQuestions WHERE LevelId = GameLevels.Id) as "QuestionCount"
       FROM GameLevels
       WHERE COALESCE(IsDeleted, false) = false
       ORDER BY LevelNumber ASC, CreatedAt ASC`
    );

    return r.rows.map(level => ({
      Id: level.id,
      LevelNumber: level.levelnumber,
      Name: level.name,
      Difficulty: level.difficulty,
      TimeLimit: level.timelimit,
      PassScore: level.passscore,
      IsLocked: level.islocked,
      QuestionCount: parseInt(level.QuestionCount, 10) || 0,
    }));
  },

  async createLevel(data) {
    await ensureSoftDeleteSchema();
    const pool = getPool();
    const { levelNumber, name, difficulty, timeLimit, passScore } = data;
    const r = await pool.query(
      `INSERT INTO GameLevels (Id, LevelNumber, Name, Difficulty, TimeLimit, PassScore, IsLocked)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, false) RETURNING *`,
      [levelNumber || 1, name, difficulty || 'easy', timeLimit || 60, passScore || 70]
    );
    return r.rows[0];
  },

  async updateLevel(id, data) {
    await ensureSoftDeleteSchema();
    const pool = getPool();
    const { levelNumber, name, difficulty, timeLimit, passScore } = data;
    await pool.query(
      `UPDATE GameLevels
       SET LevelNumber=$1, Name=$2, Difficulty=$3, TimeLimit=$4, PassScore=$5
       WHERE Id=$6`,
      [levelNumber || 1, name, difficulty || 'easy', timeLimit || 60, passScore || 70, id]
    );
  },

  async deleteLevel(id) {
    await ensureSoftDeleteSchema();
    const pool = getPool();
    await pool.query(`
      UPDATE GameLevels
      SET IsDeleted = true, DeletedAt = COALESCE(DeletedAt, NOW())
      WHERE Id=$1
    `, [id]);
  },

  // ========== QUESTIONS ==========
  async getQuestionsByLevel(levelId) {
    const pool = getPool();
    const r = await pool.query(
      `SELECT Id, QuestionType, ContentEN, ContentVI, AudioUrl, ImageUrl, CorrectAnswer, Options, OrderIndex
       FROM MiniGameQuestions WHERE LevelId=$1 ORDER BY OrderIndex ASC`,
      [levelId]
    );
    return r.rows.map(q => ({
      Id: q.id, QuestionType: q.questiontype, ContentEN: q.contenten,
      ContentVI: q.contentvi, AudioUrl: q.audiourl, ImageUrl: q.imageurl,
      CorrectAnswer: q.correctanswer, Options: parseOptions(q.options),
      OrderIndex: q.orderindex
    }));
  },

  async createQuestion(data) {
    const pool = getPool();
    const { levelId, questionType, contentEN, contentVI, audioUrl, imageUrl, correctAnswer, options, orderIndex } = data;
    const r = await pool.query(
      `INSERT INTO MiniGameQuestions (Id, LevelId, QuestionType, ContentEN, ContentVI, AudioUrl, ImageUrl, CorrectAnswer, Options, OrderIndex)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [levelId, questionType || 'matching', contentEN || '', contentVI || '',
       audioUrl || null, imageUrl || null, correctAnswer,
       stringifyOptions(options), orderIndex || 0]
    );
    return r.rows[0];
  },

  async updateQuestion(id, data) {
    const pool = getPool();
    const { questionType, contentEN, contentVI, audioUrl, imageUrl, correctAnswer, options, orderIndex } = data;
    await pool.query(
      `UPDATE MiniGameQuestions SET QuestionType=$1, ContentEN=$2, ContentVI=$3,
       AudioUrl=$4, ImageUrl=$5, CorrectAnswer=$6, Options=$7, OrderIndex=$8 WHERE Id=$9`,
      [questionType || 'matching', contentEN || '', contentVI || '',
       audioUrl || null, imageUrl || null, correctAnswer,
       stringifyOptions(options), orderIndex || 0, id]
    );
  },

  async deleteQuestion(id) {
    const pool = getPool();
    await pool.query(`DELETE FROM MiniGameQuestions WHERE Id=$1`, [id]);
  },

  // ========== PLACEMENT MINI GAME QUESTIONS ==========
  async getPlacementQuestions() {
    await ensureOnboardingSchema();
    const pool = getPool();
    const r = await pool.query(`
      SELECT Id, QuestionType, ContentEN, ContentVI, AudioUrl, ImageUrl, CorrectAnswer, Options,
             Difficulty, PointRatio, IsActive, OrderIndex, CreatedAt, UpdatedAt
      FROM PlacementMiniGameQuestions
      ORDER BY IsActive DESC, QuestionType ASC, Difficulty ASC, OrderIndex ASC, CreatedAt ASC
    `);

    return r.rows.map(q => ({
      Id: q.id,
      QuestionType: q.questiontype,
      ContentEN: q.contenten,
      ContentVI: q.contentvi,
      AudioUrl: q.audiourl,
      ImageUrl: q.imageurl,
      CorrectAnswer: q.correctanswer,
      Options: parseOptions(q.options),
      Difficulty: q.difficulty,
      PointRatio: Number(q.pointratio || 1),
      IsActive: q.isactive !== false,
      OrderIndex: q.orderindex,
      CreatedAt: q.createdat,
      UpdatedAt: q.updatedat
    }));
  },

  async createPlacementQuestion(data) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const {
      questionType, contentEN, contentVI, audioUrl, imageUrl, correctAnswer,
      options, difficulty, pointRatio, isActive, orderIndex
    } = data;
    const r = await pool.query(`
      INSERT INTO PlacementMiniGameQuestions
        (Id, QuestionType, ContentEN, ContentVI, AudioUrl, ImageUrl, CorrectAnswer, Options, Difficulty, PointRatio, IsActive, OrderIndex)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11)
      RETURNING *
    `, [
      questionType || 'matching', contentEN || '', contentVI || '', audioUrl || null, imageUrl || null,
      correctAnswer || '', stringifyOptions(options), difficulty || 'easy', Number(pointRatio || 1), isActive !== false,
      Number(orderIndex || 0)
    ]);
    return r.rows[0];
  },

  async updatePlacementQuestion(id, data) {
    await ensureOnboardingSchema();
    const pool = getPool();
    const {
      questionType, contentEN, contentVI, audioUrl, imageUrl, correctAnswer,
      options, difficulty, pointRatio, isActive, orderIndex
    } = data;
    await pool.query(`
      UPDATE PlacementMiniGameQuestions
      SET QuestionType=$1,
          ContentEN=$2,
          ContentVI=$3,
          AudioUrl=$4,
          ImageUrl=$5,
          CorrectAnswer=$6,
          Options=$7::jsonb,
          Difficulty=$8,
          PointRatio=$9,
          IsActive=$10,
          OrderIndex=$11,
          UpdatedAt=NOW()
      WHERE Id=$12
    `, [
      questionType || 'matching', contentEN || '', contentVI || '', audioUrl || null, imageUrl || null,
      correctAnswer || '', stringifyOptions(options), difficulty || 'easy', Number(pointRatio || 1), isActive !== false,
      Number(orderIndex || 0), id
    ]);
  },

  async deletePlacementQuestion(id) {
    await ensureOnboardingSchema();
    const pool = getPool();
    await pool.query(`DELETE FROM PlacementMiniGameQuestions WHERE Id=$1`, [id]);
  }
};

module.exports = adminGameService;
