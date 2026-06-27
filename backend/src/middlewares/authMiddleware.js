// ============================================
// JWT Authentication Middleware
// ============================================
const { verifyToken } = require('../config/jwt');
const { sql, getPool } = require('../config/database');

/**
 * Middleware to verify JWT token from Authorization header
 * Attaches decoded user info to req.user
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const result = await getPool().request()
      .input('id', sql.UniqueIdentifier, decoded.id)
      .query(`
        SELECT Username, Role, COALESCE(IsActive, true) AS IsActive
        FROM Users
        WHERE Id = @id
      `);
    const account = result.recordset[0];

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không còn tồn tại.'
      });
    }

    if (account.IsActive === false || account.isactive === false) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.'
      });
    }

    req.user = {
      id: decoded.id,
      username: account.Username || account.username,
      // Keep already-issued legacy tokens usable while roles are migrated.
      role: (account.Role || account.role) === 'superadmin' ? 'admin' : (account.Role || account.role)
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
}

module.exports = authMiddleware;
