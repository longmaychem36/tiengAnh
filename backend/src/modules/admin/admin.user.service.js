// ============================================
// Admin User Management — Service (Admin)
// ============================================
const bcrypt = require('bcryptjs');
const { sql, getPool } = require('../../config/database');

const adminUserService = {
  async createUser({ username, email, password, role = 'user' }) {
    const pool = getPool();
    const normalizedRole = String(role || 'user').toLowerCase();
    const validRoles = ['user', 'admin'];

    if (!username || !email || !password) {
      const error = new Error('Username, email and password are required');
      error.statusCode = 400;
      throw error;
    }

    if (!validRoles.includes(normalizedRole)) {
      const error = new Error('Invalid role');
      error.statusCode = 400;
      throw error;
    }

    if (String(password).length < 6) {
      const error = new Error('Password must be at least 6 characters');
      error.statusCode = 400;
      throw error;
    }

    const existing = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('username', sql.NVarChar, username)
      .query('SELECT Id FROM Users WHERE Email = @email OR Username = @username');

    if (existing.recordset.length > 0) {
      const error = new Error('Username or email already exists');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('passwordHash', sql.NVarChar, passwordHash)
      .input('role', sql.NVarChar, normalizedRole)
      .query(`
        INSERT INTO Users (Username, Email, PasswordHash, Role, Plan, OnboardingCompleted, PlacementLevel, PlacementSource, PlacementCompletedAt)
        VALUES (@username, @email, @passwordHash, @role, 'free', false, NULL, NULL, NULL)
        RETURNING Id, Username, Email, Role, IsActive, CreatedAt
      `);

    const user = result.recordset[0];

    await pool.request()
      .input('userId', sql.UniqueIdentifier, user.Id)
      .query(`
        INSERT INTO UserStats (UserId, Exp, Level, StreakDays, LastLogin)
        VALUES (@userId, 0, 1, 0, NOW())
      `);

    return user;
  },

  async getAllUsers(page = 1, limit = 20, search = '') {
    const pool = getPool();
    const offset = (page - 1) * limit;

    let whereClause = '';
    const req = pool.request().input('limit', sql.Int, limit).input('offset', sql.Int, offset);

    if (search) {
      req.input('search', sql.NVarChar, `%${search}%`);
      whereClause = 'WHERE (u.Username LIKE @search OR u.Email LIKE @search)';
    }

    const countRes = await req.query(`SELECT COUNT(*) as total FROM Users u ${whereClause}`);
    const total = countRes.recordset[0].total;

    const req2 = pool.request().input('limit', sql.Int, limit).input('offset', sql.Int, offset);
    if (search) req2.input('search', sql.NVarChar, `%${search}%`);

    const dataRes = await req2.query(`
      SELECT u.Id, u.Username, u.Email, u.Role, u.IsActive, u.CreatedAt,
             us.Exp, us.Level, us.StreakDays
      FROM Users u
      LEFT JOIN UserStats us ON u.Id = us.UserId
      ${whereClause}
      ORDER BY u.CreatedAt DESC
      LIMIT @limit OFFSET @offset
    `);

    return { users: dataRes.recordset, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async toggleUserActive(userId) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, userId)
      .query('UPDATE Users SET IsActive = NOT IsActive WHERE Id = @id');
  },

  async getUserStats() {
    const pool = getPool();
    const r = await pool.request().query(`
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN Role = 'user' THEN 1 ELSE 0 END) as members,
        SUM(CASE WHEN Role = 'admin' THEN 1 ELSE 0 END) as admins,
        SUM(CASE WHEN IsActive = false THEN 1 ELSE 0 END) as locked
      FROM Users
    `);
    return r.recordset[0];
  }
};

module.exports = adminUserService;
