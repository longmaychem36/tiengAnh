// ============================================
// User Module — Service
// ============================================
const axios = require('axios');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const FormData = require('form-data');
const { sql, getPool } = require('../../config/database');
const { parsePagination } = require('../../utils/pagination');
const { ensureOnboardingSchema } = require('../onboarding/onboarding.schema');

let profileSchemaReady = false;

function httpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function ensureProfileSchema() {
  if (profileSchemaReady) return;
  const pool = getPool();
  await pool.query('ALTER TABLE Users ADD COLUMN IF NOT EXISTS AvatarUrl text');
  profileSchemaReady = true;
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    const err = new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
    err.statusCode = 500;
    throw err;
  }

  return { cloudName, apiKey, apiSecret };
}

function signCloudinaryParams(params, apiSecret) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
}

const userService = {
  async getAll(page, limit) {
    await ensureProfileSchema();
    await ensureOnboardingSchema();
    const pool = getPool();
    const { offset } = parsePagination({ page, limit });

    const countResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM Users');
    const total = countResult.recordset[0].total;

    const result = await pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit))
      .query(`
        SELECT u.Id, u.Username, u.Email, u.Role, u.AvatarUrl, u.OnboardingCompleted,
               u.PlacementLevel, u.PlacementSource, u.PlacementCompletedAt, u.CreatedAt,
               ll.Code as LevelCode, ll.Name as LevelName
        FROM Users u
        LEFT JOIN LearningLevels ll ON u.LevelId = ll.Id
        ORDER BY u.CreatedAt DESC
        LIMIT @limit OFFSET @offset
      `);

    return { users: result.recordset, total };
  },

  async getById(userId) {
    await ensureProfileSchema();
    await ensureOnboardingSchema();
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT u.Id, u.Username, u.Email, u.Role, u.LevelId, u.AvatarUrl, u.OnboardingCompleted,
               u.PlacementLevel, u.PlacementSource, u.PlacementCompletedAt, u.CreatedAt,
               ll.Code as LevelCode, ll.Name as LevelName
        FROM Users u
        LEFT JOIN LearningLevels ll ON u.LevelId = ll.Id
        WHERE u.Id = @userId
      `);
    return result.recordset[0] || null;
  },

  async update(userId, data) {
    await ensureProfileSchema();
    await ensureOnboardingSchema();
    const pool = getPool();
    const { username, levelId } = data;

    // Check duplicate username
    if (username) {
      const existing = await pool.request()
        .input('username', sql.NVarChar, username)
        .input('userId', sql.UniqueIdentifier, userId)
        .query('SELECT Id FROM Users WHERE Username = @username AND Id != @userId');
      if (existing.recordset.length > 0) {
        return { error: 'Username already taken.' };
      }
    }

    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('username', sql.NVarChar, username || null)
      .input('levelId', sql.Int, levelId || null)
      .query(`
        UPDATE Users
        SET Username = COALESCE(@username, Username),
            LevelId = COALESCE(@levelId, LevelId)
        WHERE Id = @userId
        RETURNING Id, Username, Email, Role, LevelId, AvatarUrl, OnboardingCompleted, PlacementLevel, PlacementSource, PlacementCompletedAt
      `);

    return result.recordset[0] || null;
  },

  async updateAvatar(userId, file) {
    await ensureProfileSchema();
    await ensureOnboardingSchema();

    if (!file) {
      const err = new Error('Avatar image is required');
      err.statusCode = 400;
      throw err;
    }

    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      folder: 'lingoconnect/avatars',
      overwrite: 'true',
      public_id: `user_${userId}`,
      timestamp
    };

    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname || 'avatar',
      contentType: file.mimetype
    });
    Object.entries(params).forEach(([key, value]) => form.append(key, value));
    form.append('api_key', apiKey);
    form.append('signature', signCloudinaryParams(params, apiSecret));

    let uploadResult;
    try {
      uploadResult = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        form,
        {
          headers: form.getHeaders(),
          timeout: 30000,
          maxContentLength: 5 * 1024 * 1024
        }
      );
    } catch (err) {
      const detail = err.response?.data?.error?.message || err.message;
      const uploadErr = new Error(`Cloudinary upload failed: ${detail}`);
      uploadErr.statusCode = 502;
      throw uploadErr;
    }

    const avatarUrl = uploadResult.data?.secure_url;
    if (!avatarUrl) {
      const err = new Error('Cloudinary did not return an avatar URL');
      err.statusCode = 502;
      throw err;
    }

    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('avatarUrl', sql.NVarChar, avatarUrl)
      .query(`
        UPDATE Users
        SET AvatarUrl = @avatarUrl
        WHERE Id = @userId
        RETURNING Id, Username, Email, Role, LevelId, AvatarUrl, OnboardingCompleted, PlacementLevel, PlacementSource, PlacementCompletedAt
      `);

    return result.recordset[0] || null;
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      throw httpError('Current password and new password are required', 400);
    }

    if (String(newPassword).length < 6) {
      throw httpError('New password must be at least 6 characters', 400);
    }

    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query('SELECT Id, PasswordHash FROM Users WHERE Id = @userId');

    const user = result.recordset[0];
    if (!user) throw httpError('User not found', 404);

    const isMatch = await bcrypt.compare(String(currentPassword), user.PasswordHash || '');
    if (!isMatch) throw httpError('Current password is incorrect', 400);

    const passwordHash = await bcrypt.hash(String(newPassword), 10);
    await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('passwordHash', sql.NVarChar, passwordHash)
      .query('UPDATE Users SET PasswordHash = @passwordHash WHERE Id = @userId');

    return { changed: true };
  },

  async resetLearningProgress(userId) {
    const pool = getPool();
    const existing = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query('SELECT Id FROM Users WHERE Id = @userId');

    if (existing.recordset.length === 0) throw httpError('User not found', 404);

    const summary = {};
    const deleteTargets = [
      ['DailyTasks', 'dailyTasks'],
      ['SpacedRepetitionItems', 'spacedRepetition'],
      ['StudyTimeDaily', 'studyTime'],
      ['UserGameProgress', 'gameProgress'],
      ['GrammarProgress', 'grammarProgress'],
      ['SpeakingProgress', 'speakingProgress'],
      ['WritingProgress', 'writingProgress'],
      ['ListeningProgress', 'listeningProgress'],
      ['ReadingProgress', 'readingProgress']
    ];

    for (const [table, key] of deleteTargets) {
      try {
        const result = await pool.query(`DELETE FROM ${table} WHERE UserId = $1`, [userId]);
        summary[key] = result.rowCount || 0;
      } catch (err) {
        if (err.code !== '42P01') throw err;
        summary[key] = 0;
      }
    }

    await pool.query(`
      INSERT INTO UserStats (UserId, Exp, Level, StreakDays, LastLogin)
      VALUES ($1, 0, 1, 0, NULL)
      ON CONFLICT (UserId)
      DO UPDATE SET Exp = 0, Level = 1, StreakDays = 0, LastLogin = NULL
    `, [userId]);

    return { reset: true, summary };
  },

  async getStats(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT us.UserId, us.Exp, us.Level, us.StreakDays, us.LastLogin,
               (
                 (SELECT COUNT(*)::int FROM SpeakingProgress WHERE UserId = @userId AND Status = 'completed') +
                 (SELECT COUNT(*)::int FROM WritingProgress WHERE UserId = @userId AND Status = 'completed') +
                 (SELECT COUNT(*)::int FROM ListeningProgress WHERE UserId = @userId AND Status = 'completed') +
                 (SELECT COUNT(*)::int FROM ReadingProgress WHERE UserId = @userId AND Status = 'completed')
               ) as CompletedLessons,
               (
                 SELECT COUNT(*)::int
                 FROM UserCollectionWords ucw
                 INNER JOIN UserCollections uc ON uc.Id = ucw.CollectionId
                 WHERE uc.UserId = @userId
               ) as MasteredWords,
               (SELECT COALESCE(SUM(Attempts), 0)::int FROM UserGameProgress WHERE UserId = @userId) as GamesPlayed
        FROM UserStats us
        WHERE us.UserId = @userId
      `);
    return result.recordset[0] || null;
  }
};

module.exports = userService;
