// ============================================
// Admin User Management — Service (SuperAdmin only)
// ============================================
const { sql, getPool } = require('../../config/database');

const adminUserService = {
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
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return { users: dataRes.recordset, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async updateUserRole(userId, newRole) {
    const pool = getPool();
    const validRoles = ['user', 'admin', 'superadmin'];
    if (!validRoles.includes(newRole)) throw new Error('Invalid role');

    await pool.request()
      .input('id', sql.UniqueIdentifier, userId)
      .input('role', sql.NVarChar, newRole)
      .query('UPDATE Users SET Role = @role WHERE Id = @id');
  },

  async toggleUserActive(userId) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.UniqueIdentifier, userId)
      .query('UPDATE Users SET IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END WHERE Id = @id');
  },

  async getUserStats() {
    const pool = getPool();
    const r = await pool.request().query(`
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN Role = 'user' THEN 1 ELSE 0 END) as members,
        SUM(CASE WHEN Role = 'admin' THEN 1 ELSE 0 END) as admins,
        SUM(CASE WHEN Role = 'superadmin' THEN 1 ELSE 0 END) as superadmins,
        SUM(CASE WHEN IsActive = 0 THEN 1 ELSE 0 END) as locked
      FROM Users
    `);
    return r.recordset[0];
  }
};

module.exports = adminUserService;
