// ============================================
// Admin User Management - Service (Admin)
// ============================================
const bcrypt = require('bcryptjs');
const { sql, getPool } = require('../../config/database');
const notificationService = require('../notification/notification.service');

function httpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeRole(role = 'user') {
  const value = String(role || 'user').toLowerCase();
  if (!['user', 'admin'].includes(value)) throw httpError('Invalid role', 400);
  return value;
}

function normalizeEmail(email = '') {
  return String(email || '').trim().toLowerCase();
}

function normalizeUsername(username = '') {
  return String(username || '').trim();
}

function validateUsername(username) {
  if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
    throw httpError('Username must be 3-50 characters and contain only letters, numbers, and underscores', 400);
  }
}

function validateEmail(email) {
  if (!/^\S+@\S+\.\S+$/.test(email)) throw httpError('Invalid email address', 400);
}

function pick(row = {}, ...keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return undefined;
}

async function ensureUniqueIdentity(pool, { id = null, username, email }) {
  const req = pool.request()
    .input('username', sql.NVarChar, username)
    .input('email', sql.NVarChar, email);

  const excludeCurrentUser = Boolean(id);
  if (excludeCurrentUser) req.input('id', sql.UniqueIdentifier, id);

  const result = await req.query(`
      SELECT Id
      FROM Users
      WHERE (LOWER(Email) = @email OR Username = @username)
        ${excludeCurrentUser ? 'AND Id <> @id' : ''}
      LIMIT 1
    `);

  if (result.recordset.length > 0) throw httpError('Username or email already exists', 409);
}

const adminUserService = {
  async createUser({ username, email, password, role = 'admin', isActive = true }) {
    const pool = getPool();
    const safeUsername = normalizeUsername(username);
    const safeEmail = normalizeEmail(email);
    const normalizedRole = normalizeRole(role);
    if (normalizedRole !== 'admin') throw httpError('Admin can only create admin accounts', 403);

    if (!safeUsername || !safeEmail || !password) throw httpError('Username, email and password are required', 400);
    validateUsername(safeUsername);
    validateEmail(safeEmail);
    if (String(password).length < 6) throw httpError('Password must be at least 6 characters', 400);

    await ensureUniqueIdentity(pool, { username: safeUsername, email: safeEmail });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const result = await pool.request()
      .input('username', sql.NVarChar, safeUsername)
      .input('email', sql.NVarChar, safeEmail)
      .input('passwordHash', sql.NVarChar, passwordHash)
      .input('role', sql.NVarChar, normalizedRole)
      .input('isActive', sql.Bit, Boolean(isActive))
      .query(`
        INSERT INTO Users (Username, Email, PasswordHash, Role, IsActive, Plan, OnboardingCompleted, PlacementLevel, PlacementSource, PlacementCompletedAt)
        VALUES (@username, @email, @passwordHash, @role, @isActive, 'free', true, NULL, 'admin', NOW())
        RETURNING Id, Username, Email, Role, IsActive, Plan, OnboardingCompleted, PlacementLevel, CreatedAt
      `);

    const user = result.recordset[0];
    await pool.request()
      .input('userId', sql.UniqueIdentifier, user.Id)
      .query(`
        INSERT INTO UserStats (UserId, Exp, Level, StreakDays, LastLogin)
        VALUES (@userId, 0, 1, 0, NOW())
        ON CONFLICT (UserId) DO NOTHING
      `);

    return user;
  },

  async getAllUsers(page = 1, limit = 20, search = '', role = 'all') {
    const pool = getPool();
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const offset = (safePage - 1) * safeLimit;
    const safeRole = String(role || 'all').toLowerCase();

    let whereClause = 'WHERE 1 = 1';
    const req = pool.request().input('limit', sql.Int, safeLimit).input('offset', sql.Int, offset);

    if (search) {
      req.input('search', sql.NVarChar, `%${String(search).trim()}%`);
      whereClause += ' AND (u.Username ILIKE @search OR u.Email ILIKE @search)';
    }

    if (['user', 'admin'].includes(safeRole)) {
      req.input('role', sql.NVarChar, safeRole);
      whereClause += ' AND u.Role = @role';
    }

    const countRes = await req.query(`SELECT COUNT(*)::int as total FROM Users u ${whereClause}`);
    const total = Number(countRes.recordset[0].total || 0);

    const req2 = pool.request().input('limit', sql.Int, safeLimit).input('offset', sql.Int, offset);
    if (search) req2.input('search', sql.NVarChar, `%${String(search).trim()}%`);
    if (['user', 'admin'].includes(safeRole)) req2.input('role', sql.NVarChar, safeRole);

    const dataRes = await req2.query(`
      SELECT u.Id, u.Username, u.Email, u.Role, COALESCE(u.IsActive, true) AS IsActive, u.Plan, u.PlusExpiresAt,
             CASE
               WHEN u.Plan = 'plus' AND u.PlusExpiresAt IS NOT NULL AND u.PlusExpiresAt > NOW()
                 THEN CEIL(EXTRACT(EPOCH FROM (u.PlusExpiresAt - NOW())) / 86400)::int
               ELSE 0
             END AS PlusDaysRemaining,
             u.OnboardingCompleted, u.PlacementLevel, u.PlacementSource, u.PlacementCompletedAt, u.CreatedAt,
             us.Exp, us.Level, us.StreakDays, us.LastLogin,
             COALESCE(std.ActiveDays, 0) AS ActiveDays,
             COALESCE(dt.CompletedTasks, 0) AS CompletedTasks,
             COALESCE(uc.CollectionCount, 0) AS CollectionCount
      FROM Users u
      LEFT JOIN UserStats us ON u.Id = us.UserId
      LEFT JOIN (
        SELECT UserId, COUNT(*)::int AS ActiveDays
        FROM StudyTimeDaily
        GROUP BY UserId
      ) std ON std.UserId = u.Id
      LEFT JOIN (
        SELECT UserId, COUNT(*)::int AS CompletedTasks
        FROM DailyTasks
        WHERE Status = 'completed'
        GROUP BY UserId
      ) dt ON dt.UserId = u.Id
      LEFT JOIN (
        SELECT UserId, COUNT(*)::int AS CollectionCount
        FROM UserCollections
        GROUP BY UserId
      ) uc ON uc.UserId = u.Id
      ${whereClause}
      ORDER BY CASE WHEN u.Role = 'admin' THEN 0 ELSE 1 END, u.CreatedAt DESC
      LIMIT @limit OFFSET @offset
    `);

    return { users: dataRes.recordset, total, page: safePage, limit: safeLimit, totalPages: Math.max(1, Math.ceil(total / safeLimit)) };
  },

  async updateUser(userId, data = {}, currentUserId) {
    const pool = getPool();
    const existing = await pool.request()
      .input('id', sql.UniqueIdentifier, userId)
      .query('SELECT Id, Username, Email, Role, IsActive, Plan, PlusExpiresAt, OnboardingCompleted, PlacementLevel FROM Users WHERE Id = @id');
    if (existing.recordset.length === 0) throw httpError('User not found', 404);

    const current = existing.recordset[0];
    const currentUsername = normalizeUsername(pick(current, 'Username', 'username'));
    const currentEmail = normalizeEmail(pick(current, 'Email', 'email'));
    const requestedUsername = data.username !== undefined ? normalizeUsername(data.username) : currentUsername;
    const requestedEmail = data.email !== undefined ? normalizeEmail(data.email) : currentEmail;
    if (requestedUsername !== currentUsername || requestedEmail !== currentEmail) {
      throw httpError('Username and email cannot be changed from admin account management', 403);
    }
    const currentRole = normalizeRole(pick(current, 'Role', 'role'));
    if (data.role !== undefined && normalizeRole(data.role) !== currentRole) {
      throw httpError('Role cannot be changed from account management', 400);
    }
    const nextRole = currentRole;
    const nextIsActive = data.isActive !== undefined ? Boolean(data.isActive) : pick(current, 'IsActive', 'isactive') !== false;
    const isLearner = nextRole === 'user';
    const currentPlan = String(pick(current, 'Plan', 'plan') || 'free').toLowerCase() === 'plus' ? 'plus' : 'free';
    const nextPlan = isLearner
      ? data.plan !== undefined
        ? (String(data.plan || 'free').toLowerCase() === 'plus' ? 'plus' : 'free')
        : currentPlan
      : 'free';
    const nextOnboarding = isLearner
      ? data.onboardingCompleted !== undefined
        ? Boolean(data.onboardingCompleted)
        : Boolean(pick(current, 'OnboardingCompleted', 'onboardingcompleted'))
      : true;
    const nextPlacement = isLearner
      ? data.placementLevel !== undefined
        ? (data.placementLevel ? String(data.placementLevel) : null)
        : (pick(current, 'PlacementLevel', 'placementlevel') || null)
      : null;

    if (String(userId) === String(currentUserId)) {
      if (nextRole !== currentRole) throw httpError('Cannot change your own role', 400);
      if (!nextIsActive) throw httpError('Cannot lock your own account', 400);
    }

    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, userId)
      .input('role', sql.NVarChar, nextRole)
      .input('isActive', sql.Bit, nextIsActive)
      .input('plan', sql.NVarChar, nextPlan)
      .input('onboardingCompleted', sql.Bit, nextOnboarding)
      .input('placementLevel', sql.NVarChar, nextPlacement)
      .query(`
        UPDATE Users
        SET Role = @role,
            IsActive = @isActive,
            Plan = @plan,
            PlusExpiresAt = CASE WHEN @plan = 'free' THEN NULL ELSE PlusExpiresAt END,
            OnboardingCompleted = @onboardingCompleted,
            PlacementLevel = @placementLevel,
            PlacementSource = CASE WHEN @placementLevel IS NULL THEN NULL ELSE COALESCE(PlacementSource, 'admin') END,
            PlacementCompletedAt = CASE WHEN @placementLevel IS NULL THEN NULL ELSE COALESCE(PlacementCompletedAt, NOW()) END
        WHERE Id = @id
        RETURNING Id, Username, Email, Role, IsActive, Plan, PlusExpiresAt,
          CASE
            WHEN Plan = 'plus' AND PlusExpiresAt IS NOT NULL AND PlusExpiresAt > NOW()
              THEN CEIL(EXTRACT(EPOCH FROM (PlusExpiresAt - NOW())) / 86400)::int
            ELSE 0
          END AS PlusDaysRemaining,
          OnboardingCompleted, PlacementLevel, CreatedAt
      `);

    return result.recordset[0];
  },

  async giftPlusDays(userId, days, adminId = null) {
    const safeDays = Math.floor(Number(days));
    if (!Number.isFinite(safeDays) || safeDays < 1 || safeDays > 3650) {
      throw httpError('Plus gift days must be between 1 and 3650', 400);
    }

    const pool = getPool();
    const existing = await pool.query(`
      SELECT Id, Username, Email, Role, Plan, PlusExpiresAt
      FROM Users
      WHERE Id = $1
    `, [userId]);

    if (existing.rows.length === 0) throw httpError('User not found', 404);
    if (String(existing.rows[0].role || '').toLowerCase() !== 'user') {
      throw httpError('Plus can only be gifted to learner accounts', 400);
    }

    const result = await pool.query(`
      UPDATE Users
      SET Plan = 'plus',
          PlusExpiresAt = GREATEST(COALESCE(PlusExpiresAt, NOW()), NOW()) + ($2 || ' days')::INTERVAL
      WHERE Id = $1
      RETURNING Id, Username, Email, Role, IsActive, Plan, PlusExpiresAt,
        CASE
          WHEN PlusExpiresAt IS NOT NULL AND PlusExpiresAt > NOW()
            THEN CEIL(EXTRACT(EPOCH FROM (PlusExpiresAt - NOW())) / 86400)::int
          ELSE 0
        END AS PlusDaysRemaining,
        OnboardingCompleted, PlacementLevel, CreatedAt
    `, [userId, safeDays]);

    const updated = result.rows[0];
    notificationService.createNotification({
      title: `Bạn được tặng thêm ${safeDays} ngày Plus`,
      message: `Admin đã tặng thêm ${safeDays} ngày Plus cho tài khoản của bạn. Gói Plus hiện có hiệu lực đến ${new Date(updated.plusexpiresat).toLocaleDateString('vi-VN')}.`,
      type: 'plus_gifted',
      linkUrl: '/settings',
      audience: 'selected',
      userIds: [userId],
      createdBy: adminId,
      sendEmail: true
    }).catch((error) => {
      console.warn('Plus gift notification failed:', error.message);
    });

    return {
      Id: updated.id,
      Username: updated.username,
      Email: updated.email,
      Role: updated.role,
      IsActive: updated.isactive,
      Plan: updated.plan,
      PlusExpiresAt: updated.plusexpiresat,
      PlusDaysRemaining: Number(updated.plusdaysremaining || 0),
      OnboardingCompleted: updated.onboardingcompleted,
      PlacementLevel: updated.placementlevel,
      CreatedAt: updated.createdat
    };
  },

  async resetPassword(userId, password) {
    if (!password || String(password).length < 6) throw httpError('Password must be at least 6 characters', 400);
    const pool = getPool();
    const existing = await pool.request()
      .input('id', sql.UniqueIdentifier, userId)
      .query('SELECT Id, Role FROM Users WHERE Id = @id');
    if (existing.recordset.length === 0) throw httpError('User not found', 404);
    if (String(existing.recordset[0].Role || '').toLowerCase() !== 'admin') {
      throw httpError('Admin can only reset admin account passwords', 403);
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    await pool.request()
      .input('id', sql.UniqueIdentifier, userId)
      .input('passwordHash', sql.NVarChar, passwordHash)
      .query('UPDATE Users SET PasswordHash = @passwordHash WHERE Id = @id');
  },

  async deleteUser(userId, currentUserId) {
    if (String(userId) === String(currentUserId)) throw httpError('Cannot delete your own account', 400);
    const pool = getPool();
    const existing = await pool.request()
      .input('id', sql.UniqueIdentifier, userId)
      .query('SELECT Id FROM Users WHERE Id = @id');
    if (existing.recordset.length === 0) throw httpError('User not found', 404);

    await pool.query('BEGIN');
    try {
      await pool.query('DELETE FROM PasswordResetCodes WHERE UserId = $1', [userId]);
      await pool.query('DELETE FROM DailyTasks WHERE UserId = $1', [userId]);
      await pool.query('DELETE FROM StudyTimeDaily WHERE UserId = $1', [userId]);
      await pool.query('DELETE FROM UserGameProgress WHERE UserId = $1', [userId]);
      await pool.query('DELETE FROM UserStats WHERE UserId = $1', [userId]);
      await pool.query('DELETE FROM UserCollectionWords WHERE CollectionId IN (SELECT Id FROM UserCollections WHERE UserId = $1)', [userId]);
      await pool.query('DELETE FROM UserCollections WHERE UserId = $1 OR ReviewedBy = $1', [userId]);
      await pool.query('DELETE FROM GrammarProgress WHERE UserId = $1', [userId]);
      await pool.query('DELETE FROM SpeakingProgress WHERE UserId = $1', [userId]);
      await pool.query('DELETE FROM WritingProgress WHERE UserId = $1', [userId]);
      await pool.query('DELETE FROM ListeningProgress WHERE UserId = $1', [userId]);
      await pool.query('DELETE FROM ReadingProgress WHERE UserId = $1', [userId]);
      await pool.query('DELETE FROM PaymentRequests WHERE UserId = $1', [userId]);
      await pool.query('DELETE FROM Users WHERE Id = $1', [userId]);
      await pool.query('COMMIT');
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  },

  async toggleUserActive(userId, currentUserId) {
    if (String(userId) === String(currentUserId)) throw httpError('Cannot lock your own account', 400);
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, userId)
      .query(`
        UPDATE Users
        SET IsActive = NOT COALESCE(IsActive, true)
        WHERE Id = @id
        RETURNING Id, Username, Email, Role, IsActive
      `);
    if (result.recordset.length === 0) throw httpError('User not found', 404);
    return result.recordset[0];
  },

  async getUserStats() {
    const pool = getPool();
    const r = await pool.request().query(`
      SELECT
        COUNT(*)::int as totalUsers,
        SUM(CASE WHEN Role = 'user' THEN 1 ELSE 0 END)::int as members,
        SUM(CASE WHEN Role = 'admin' THEN 1 ELSE 0 END)::int as admins,
        SUM(CASE WHEN COALESCE(IsActive, true) = false THEN 1 ELSE 0 END)::int as locked,
        SUM(CASE WHEN Plan = 'plus' THEN 1 ELSE 0 END)::int as plusUsers,
        SUM(CASE WHEN CreatedAt >= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END)::int as newUsers7d,
        COALESCE(SUM(us.Exp), 0)::int as totalExp,
        COALESCE(AVG(us.Exp), 0)::int as averageExp
      FROM Users u
      LEFT JOIN UserStats us ON us.UserId = u.Id
    `);
    const row = r.recordset[0] || {};
    return {
      totalUsers: Number(row.totalUsers ?? row.totalusers ?? 0),
      members: Number(row.members ?? 0),
      admins: Number(row.admins ?? 0),
      locked: Number(row.locked ?? 0),
      plusUsers: Number(row.plusUsers ?? row.plususers ?? 0),
      newUsers7d: Number(row.newUsers7d ?? row.newusers7d ?? 0),
      totalExp: Number(row.totalExp ?? row.totalexp ?? 0),
      averageExp: Number(row.averageExp ?? row.averageexp ?? 0)
    };
  }
};

module.exports = adminUserService;
