// ============================================
// Admin Game Management — Service
// ============================================
const { sql, getPool } = require('../../config/database');

const adminGameService = {
  // ========== GAME SETS ==========
  async createSet(data) {
    const pool = getPool();
    const { name, description, gameType, icon, orderIndex, unlockCondition } = data;
    const r = await pool.request()
      .input('n', sql.NVarChar, name).input('d', sql.NVarChar, description || '')
      .input('t', sql.NVarChar, gameType).input('i', sql.NVarChar, icon || '🎮')
      .input('o', sql.Int, orderIndex || 0).input('u', sql.NVarChar, unlockCondition || 'none')
      .query('INSERT INTO GameSets (Name,Description,GameType,Icon,OrderIndex,UnlockCondition) OUTPUT INSERTED.* VALUES (@n,@d,@t,@i,@o,@u)');
    return r.recordset[0];
  },

  async updateSet(id, data) {
    const pool = getPool();
    const { name, description, gameType, icon, orderIndex, unlockCondition } = data;
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('n', sql.NVarChar, name).input('d', sql.NVarChar, description || '')
      .input('t', sql.NVarChar, gameType).input('i', sql.NVarChar, icon || '🎮')
      .input('o', sql.Int, orderIndex || 0).input('u', sql.NVarChar, unlockCondition || 'none')
      .query('UPDATE GameSets SET Name=@n,Description=@d,GameType=@t,Icon=@i,OrderIndex=@o,UnlockCondition=@u WHERE Id=@id');
    return { Id: id, ...data };
  },

  async deleteSet(id) {
    const pool = getPool();
    // Cascade: delete questions → levels → set
    await pool.request().input('id', sql.UniqueIdentifier, id)
      .query('DELETE FROM MiniGameQuestions WHERE LevelId IN (SELECT Id FROM GameLevels WHERE SetId=@id)');
    await pool.request().input('id', sql.UniqueIdentifier, id)
      .query('DELETE FROM UserGameProgress WHERE LevelId IN (SELECT Id FROM GameLevels WHERE SetId=@id)');
    await pool.request().input('id', sql.UniqueIdentifier, id)
      .query('DELETE FROM GameLevels WHERE SetId=@id');
    await pool.request().input('id', sql.UniqueIdentifier, id)
      .query('DELETE FROM GameSets WHERE Id=@id');
  },

  // ========== LEVELS ==========
  async createLevel(data) {
    const pool = getPool();
    const { setId, levelNumber, name, difficulty, timeLimit, passScore, isLocked } = data;
    const r = await pool.request()
      .input('s', sql.UniqueIdentifier, setId).input('n', sql.Int, levelNumber)
      .input('nm', sql.NVarChar, name).input('d', sql.NVarChar, difficulty || 'easy')
      .input('t', sql.Int, timeLimit || 60).input('p', sql.Int, passScore || 70)
      .input('l', sql.Int, isLocked ? 1 : 0)
      .query('INSERT INTO GameLevels (SetId,LevelNumber,Name,Difficulty,TimeLimit,PassScore,IsLocked) OUTPUT INSERTED.* VALUES (@s,@n,@nm,@d,@t,@p,@l)');
    return r.recordset[0];
  },

  async updateLevel(id, data) {
    const pool = getPool();
    const { name, difficulty, timeLimit, passScore } = data;
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('nm', sql.NVarChar, name).input('d', sql.NVarChar, difficulty || 'easy')
      .input('t', sql.Int, timeLimit || 60).input('p', sql.Int, passScore || 70)
      .query('UPDATE GameLevels SET Name=@nm,Difficulty=@d,TimeLimit=@t,PassScore=@p WHERE Id=@id');
  },

  async deleteLevel(id) {
    const pool = getPool();
    await pool.request().input('id', sql.UniqueIdentifier, id).query('DELETE FROM MiniGameQuestions WHERE LevelId=@id');
    await pool.request().input('id', sql.UniqueIdentifier, id).query('DELETE FROM UserGameProgress WHERE LevelId=@id');
    await pool.request().input('id', sql.UniqueIdentifier, id).query('DELETE FROM GameLevels WHERE Id=@id');
  },

  // ========== QUESTIONS ==========
  async getQuestionsByLevel(levelId) {
    const pool = getPool();
    const r = await pool.request().input('lid', sql.UniqueIdentifier, levelId)
      .query('SELECT * FROM MiniGameQuestions WHERE LevelId=@lid ORDER BY OrderIndex ASC');
    return r.recordset.map(q => ({ ...q, Options: q.Options ? JSON.parse(q.Options) : null }));
  },

  async createQuestion(data) {
    const pool = getPool();
    const { levelId, questionType, contentEN, contentVI, audioUrl, imageUrl, correctAnswer, options, orderIndex } = data;
    const r = await pool.request()
      .input('lid', sql.UniqueIdentifier, levelId).input('t', sql.NVarChar, questionType)
      .input('en', sql.NVarChar, contentEN).input('vi', sql.NVarChar, contentVI || '')
      .input('au', sql.NVarChar, audioUrl || null).input('im', sql.NVarChar, imageUrl || null)
      .input('a', sql.NVarChar, correctAnswer)
      .input('o', sql.NVarChar, options ? JSON.stringify(options) : null)
      .input('oi', sql.Int, orderIndex || 0)
      .query('INSERT INTO MiniGameQuestions (LevelId,QuestionType,ContentEN,ContentVI,AudioUrl,ImageUrl,CorrectAnswer,Options,OrderIndex) OUTPUT INSERTED.* VALUES (@lid,@t,@en,@vi,@au,@im,@a,@o,@oi)');
    return r.recordset[0];
  },

  async updateQuestion(id, data) {
    const pool = getPool();
    const { contentEN, contentVI, audioUrl, imageUrl, correctAnswer, options, orderIndex } = data;
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('en', sql.NVarChar, contentEN).input('vi', sql.NVarChar, contentVI || '')
      .input('au', sql.NVarChar, audioUrl || null).input('im', sql.NVarChar, imageUrl || null)
      .input('a', sql.NVarChar, correctAnswer)
      .input('o', sql.NVarChar, options ? JSON.stringify(options) : null)
      .input('oi', sql.Int, orderIndex || 0)
      .query('UPDATE MiniGameQuestions SET ContentEN=@en,ContentVI=@vi,AudioUrl=@au,ImageUrl=@im,CorrectAnswer=@a,Options=@o,OrderIndex=@oi WHERE Id=@id');
  },

  async deleteQuestion(id) {
    const pool = getPool();
    await pool.request().input('id', sql.UniqueIdentifier, id).query('DELETE FROM MiniGameQuestions WHERE Id=@id');
  }
};

module.exports = adminGameService;
