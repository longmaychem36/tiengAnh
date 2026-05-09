// ============================================
// Auth Module — Service (Business Logic)
// ============================================
const bcrypt = require('bcryptjs');
const { sql, getPool } = require('../../config/database');
const { generateToken } = require('../../config/jwt');

const authService = {
  /**
   * Register a new user
   */
  async register({ username, email, password }) {
    const pool = getPool();

    // Check if user already exists
    const existing = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('username', sql.NVarChar, username)
      .query('SELECT Id FROM Users WHERE Email = @email OR Username = @username');

    if (existing.recordset.length > 0) {
      return { error: 'Username or email already exists.' };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('passwordHash', sql.NVarChar, passwordHash)
      .query(`
        INSERT INTO Users (Username, Email, PasswordHash, Role)
        OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.Email, INSERTED.Role, INSERTED.CreatedAt
        VALUES (@username, @email, @passwordHash, 'user')
      `);

    const user = result.recordset[0];

    // Initialize user stats for gamification
    await pool.request()
      .input('userId', sql.UniqueIdentifier, user.Id)
      .query(`
        INSERT INTO UserStats (UserId, Exp, Level, StreakDays, LastLogin)
        VALUES (@userId, 0, 1, 0, GETDATE())
      `);

    // Generate JWT
    const token = generateToken({
      id: user.Id,
      username: user.Username,
      role: user.Role
    });

    return {
      user: {
        id: user.Id,
        username: user.Username,
        email: user.Email,
        role: user.Role,
        createdAt: user.CreatedAt
      },
      token
    };
  },

  /**
   * Login user with email and password
   */
  async login({ email, password }) {
    const pool = getPool();

    // Find user
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT u.Id, u.Username, u.Email, u.PasswordHash, u.Role, u.LevelId, u.CreatedAt,
               ll.Code as LevelCode, ll.Name as LevelName,
               us.Exp, us.Level as GameLevel, us.StreakDays
        FROM Users u
        LEFT JOIN LearningLevels ll ON u.LevelId = ll.Id
        LEFT JOIN UserStats us ON u.Id = us.UserId
        WHERE u.Email = @email
      `);

    if (result.recordset.length === 0) {
      return { error: 'Invalid email or password.' };
    }

    const user = result.recordset[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return { error: 'Invalid email or password.' };
    }

    // Update streak & last login
    await pool.request()
      .input('userId', sql.UniqueIdentifier, user.Id)
      .query(`
        UPDATE UserStats 
        SET LastLogin = GETDATE(),
            StreakDays = CASE 
              WHEN DATEDIFF(DAY, LastLogin, GETDATE()) = 1 THEN StreakDays + 1
              WHEN DATEDIFF(DAY, LastLogin, GETDATE()) = 0 THEN StreakDays
              ELSE 1
            END
        WHERE UserId = @userId
      `);

    // Generate JWT
    const token = generateToken({
      id: user.Id,
      username: user.Username,
      role: user.Role
    });

    return {
      user: {
        id: user.Id,
        username: user.Username,
        email: user.Email,
        role: user.Role,
        level: user.LevelCode ? { code: user.LevelCode, name: user.LevelName } : null,
        stats: {
          exp: user.Exp || 0,
          gameLevel: user.GameLevel || 1,
          streakDays: user.StreakDays || 0
        },
        createdAt: user.CreatedAt
      },
      token
    };
  },

  /**
   * Get user by ID (for /me endpoint)
   */
  async getUserById(userId) {
    const pool = getPool();

    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT u.Id, u.Username, u.Email, u.Role, u.LevelId, u.CreatedAt,
               ll.Code as LevelCode, ll.Name as LevelName,
               us.Exp, us.Level as GameLevel, us.StreakDays, us.LastLogin
        FROM Users u
        LEFT JOIN LearningLevels ll ON u.LevelId = ll.Id
        LEFT JOIN UserStats us ON u.Id = us.UserId
        WHERE u.Id = @userId
      `);

    if (result.recordset.length === 0) return null;

    const user = result.recordset[0];
    return {
      id: user.Id,
      username: user.Username,
      email: user.Email,
      role: user.Role,
      level: user.LevelCode ? { code: user.LevelCode, name: user.LevelName } : null,
      stats: {
        exp: user.Exp || 0,
        gameLevel: user.GameLevel || 1,
        streakDays: user.StreakDays || 0,
        lastLogin: user.LastLogin
      },
      createdAt: user.CreatedAt
    };
  }
};

module.exports = authService;
