// ============================================
// Auth Module - Service (Business Logic)
// ============================================
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sql, getPool } = require('../../config/database');
const { generateToken } = require('../../config/jwt');
const billingService = require('../billing/billing.service');
const dailyService = require('../daily/daily.service');
const { ensureOnboardingSchema } = require('../onboarding/onboarding.schema');
const { sendMail } = require('../../utils/mailer');

let profileSchemaReady = false;
let passwordResetSchemaReady = false;

async function ensureProfileSchema() {
  if (profileSchemaReady) return;
  const pool = getPool();
  await pool.query('ALTER TABLE Users ADD COLUMN IF NOT EXISTS AvatarUrl text');
  profileSchemaReady = true;
}

async function ensurePasswordResetSchema() {
  if (passwordResetSchemaReady) return;
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS PasswordResetCodes (
      Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      Email VARCHAR(255) NOT NULL,
      CodeHash TEXT NOT NULL,
      ExpiresAt TIMESTAMP NOT NULL,
      UsedAt TIMESTAMP,
      CreatedAt TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query('CREATE INDEX IF NOT EXISTS idx_password_reset_email_created ON PasswordResetCodes (Email, CreatedAt DESC)');
  passwordResetSchemaReady = true;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getPlanInfo(user = {}) {
  const plan = (user.Plan || user.plan || 'free').toLowerCase();
  const plusExpiresAt = user.PlusExpiresAt || user.plusexpiresat || null;
  const isPlus = plan === 'plus' && (!plusExpiresAt || new Date(plusExpiresAt).getTime() > Date.now());

  return {
    plan: isPlus ? 'plus' : 'free',
    isPlus,
    plusExpiresAt
  };
}

function getOnboardingInfo(user = {}) {
  return {
    onboardingCompleted: Boolean(user.OnboardingCompleted ?? user.onboardingcompleted),
    placementLevel: user.PlacementLevel || user.placementlevel || null,
    placementSource: user.PlacementSource || user.placementsource || null,
    placementCompletedAt: user.PlacementCompletedAt || user.placementcompletedat || null
  };
}

function normalizeRole(role) {
  return String(role || '').toLowerCase() === 'superadmin' ? 'admin' : role;
}

function shapeUser(user = {}) {
  return {
    id: user.Id,
    username: user.Username,
    email: user.Email,
    role: normalizeRole(user.Role),
    avatarUrl: user.AvatarUrl || null,
    ...getPlanInfo(user),
    ...getOnboardingInfo(user),
    level: user.LevelCode ? { code: user.LevelCode, name: user.LevelName } : null,
    stats: {
      exp: user.Exp ?? user.exp ?? 0,
      gameLevel: user.GameLevel ?? user.gamelevel ?? user.Level ?? user.level ?? 1,
      streakDays: user.StreakDays ?? user.Streakdays ?? user.streakdays ?? 0,
      lastLogin: user.LastLogin ?? user.Lastlogin ?? user.lastlogin ?? null
    },
    createdAt: user.CreatedAt
  };
}

async function prepareAuthSchemas() {
  await billingService.ensureBillingSchema();
  await ensureProfileSchema();
  await ensureOnboardingSchema();
}

async function findUserByEmail(email) {
  const pool = getPool();
  const result = await pool.request()
    .input('email', sql.NVarChar, normalizeEmail(email))
    .query(`
      SELECT u.Id, u.Username, u.Email, u.PasswordHash, u.Role, COALESCE(u.IsActive, true) AS IsActive,
             u.Plan, u.PlusExpiresAt, u.LevelId, u.AvatarUrl,
             u.OnboardingCompleted, u.PlacementLevel, u.PlacementSource, u.PlacementCompletedAt, u.CreatedAt,
             ll.Code as LevelCode, ll.Name as LevelName,
             us.Exp, us.Level as GameLevel, us.StreakDays, us.LastLogin
      FROM Users u
      LEFT JOIN LearningLevels ll ON u.LevelId = ll.Id
      LEFT JOIN UserStats us ON u.Id = us.UserId
      WHERE LOWER(u.Email) = @email
    `);

  return result.recordset[0] || null;
}

async function findUserById(userId) {
  const pool = getPool();
  const result = await pool.request()
    .input('userId', sql.UniqueIdentifier, userId)
    .query(`
      SELECT u.Id, u.Username, u.Email, u.PasswordHash, u.Role, COALESCE(u.IsActive, true) AS IsActive,
             u.Plan, u.PlusExpiresAt, u.LevelId, u.AvatarUrl,
             u.OnboardingCompleted, u.PlacementLevel, u.PlacementSource, u.PlacementCompletedAt, u.CreatedAt,
             ll.Code as LevelCode, ll.Name as LevelName,
             us.Exp, us.Level as GameLevel, us.StreakDays, us.LastLogin
      FROM Users u
      LEFT JOIN LearningLevels ll ON u.LevelId = ll.Id
      LEFT JOIN UserStats us ON u.Id = us.UserId
      WHERE u.Id = @userId
    `);

  return result.recordset[0] || null;
}

async function updateLoginStats(userId) {
  const pool = getPool();
  await pool.request()
    .input('userId', sql.UniqueIdentifier, userId)
    .query(`
      UPDATE UserStats
      SET LastLogin = NOW(),
          StreakDays = CASE
            WHEN DATE_PART('day', NOW() - LastLogin)::int = 1 THEN StreakDays + 1
            WHEN DATE_PART('day', NOW() - LastLogin)::int = 0 THEN StreakDays
            ELSE 1
          END
      WHERE UserId = @userId
    `);
}

async function createSession(user) {
  await updateLoginStats(user.Id);
  const token = generateToken({
    id: user.Id,
    username: user.Username,
    role: normalizeRole(user.Role)
  });

  let dailyPlan = null;
  if (normalizeRole(user.Role) !== 'admin') {
    try {
      dailyPlan = await dailyService.getToday({ id: user.Id });
    } catch (error) {
      console.error('[auth] failed to prepare daily tasks on login:', error.message);
    }
  }

  const refreshedUser = await findUserById(user.Id).catch(() => null);

  return {
    user: shapeUser(refreshedUser || user),
    token,
    dailyPlan
  };
}

async function sendResetCodeEmail(email, code) {
  const appName = process.env.APP_NAME || 'LingoConnect';

  const sent = await sendMail({
    to: email,
    subject: `${appName} password reset code`,
    text: `Your ${appName} password reset code is ${code}. This code expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#102033">
          <h2>${appName} password reset</h2>
          <p>Your verification code is:</p>
          <div style="font-size:28px;font-weight:800;letter-spacing:6px;color:#1cb0f6">${code}</div>
          <p>This code expires in <strong>10 minutes</strong>.</p>
          <p>If you did not request this, ignore this email.</p>
        </div>
      `
  });

  if (sent.error) {
    console.error('[Auth] Failed to send password reset email:', sent.error);
    return { error: 'Could not send reset code email. Check SMTP settings on the server.' };
  }

  return { sent: true };
}

const authService = {
  /**
   * Register a new user
   */
  async register({ username, email, password }) {
    const pool = getPool();
    await prepareAuthSchemas();

    const normalizedEmail = normalizeEmail(email);

    // Check if user already exists
    const existing = await pool.request()
      .input('email', sql.NVarChar, normalizedEmail)
      .input('username', sql.NVarChar, username)
      .query('SELECT Id FROM Users WHERE LOWER(Email) = @email OR Username = @username');

    if (existing.recordset.length > 0) {
      return { error: 'Username or email already exists.' };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, normalizedEmail)
      .input('passwordHash', sql.NVarChar, passwordHash)
      .query(`
        INSERT INTO Users (Username, Email, PasswordHash, Role, Plan, OnboardingCompleted, PlacementLevel, PlacementSource, PlacementCompletedAt)
        VALUES (@username, @email, @passwordHash, 'user', 'free', false, NULL, NULL, NULL)
        RETURNING Id, Username, Email, Role, Plan, PlusExpiresAt, AvatarUrl, OnboardingCompleted, PlacementLevel, PlacementSource, PlacementCompletedAt, CreatedAt
      `);

    const user = result.recordset[0];

    // Initialize user stats for gamification
    await pool.request()
      .input('userId', sql.UniqueIdentifier, user.Id)
      .query(`
        INSERT INTO UserStats (UserId, Exp, Level, StreakDays, LastLogin)
        VALUES (@userId, 0, 1, 0, NOW())
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
        avatarUrl: user.AvatarUrl || null,
        ...getPlanInfo(user),
        ...getOnboardingInfo(user),
        createdAt: user.CreatedAt
      },
      token
    };
  },

  /**
   * Login user with email and password
   */
  async login({ email, password }) {
    await prepareAuthSchemas();
    const user = await findUserByEmail(email);

    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.PasswordHash || '');
    if (!isMatch) {
      return { error: 'Invalid email or password.' };
    }

    if (user.IsActive === false || user.isactive === false) {
      return {
        error: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.',
        statusCode: 403
      };
    }

    return createSession(user);
  },

  async requestPasswordReset({ email }) {
    await prepareAuthSchemas();
    await ensurePasswordResetSchema();
    const pool = getPool();
    const normalizedEmail = normalizeEmail(email);
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      return { error: 'No account exists with this email.' };
    }

    const code = String(crypto.randomInt(100000, 1000000));
    const codeHash = await bcrypt.hash(code, 10);

    await pool.query(`
      UPDATE PasswordResetCodes
      SET UsedAt = NOW()
      WHERE UserId = $1 AND UsedAt IS NULL
    `, [user.Id]);

    await pool.query(`
      INSERT INTO PasswordResetCodes (UserId, Email, CodeHash, ExpiresAt)
      VALUES ($1, $2, $3, NOW() + INTERVAL '10 minutes')
    `, [user.Id, normalizedEmail, codeHash]);

    const sent = await sendResetCodeEmail(normalizedEmail, code);
    if (sent.error) return sent;

    return { email: normalizedEmail, expiresInMinutes: 10 };
  },

  async resetPassword({ email, code, password }) {
    await prepareAuthSchemas();
    await ensurePasswordResetSchema();
    const pool = getPool();
    const normalizedEmail = normalizeEmail(email);
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      return { error: 'Invalid or expired reset code.' };
    }

    const result = await pool.query(`
      SELECT Id, CodeHash
      FROM PasswordResetCodes
      WHERE UserId = $1
        AND Email = $2
        AND UsedAt IS NULL
        AND ExpiresAt > NOW()
      ORDER BY CreatedAt DESC
      LIMIT 1
    `, [user.Id, normalizedEmail]);

    const reset = result.rows[0];
    if (!reset) {
      return { error: 'Invalid or expired reset code.' };
    }

    const ok = await bcrypt.compare(String(code || '').trim(), reset.codehash || reset.CodeHash || '');
    if (!ok) {
      return { error: 'Invalid or expired reset code.' };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.request()
      .input('userId', sql.UniqueIdentifier, user.Id)
      .input('passwordHash', sql.NVarChar, passwordHash)
      .query('UPDATE Users SET PasswordHash = @passwordHash WHERE Id = @userId');

    await pool.query('UPDATE PasswordResetCodes SET UsedAt = NOW() WHERE Id = $1', [reset.id || reset.Id]);

    return { reset: true };
  },

  /**
   * Get user by ID (for /me endpoint)
   */
  async getUserById(userId) {
    await prepareAuthSchemas();

    const user = await findUserById(userId);
    if (!user) return null;

    return shapeUser(user);
  }
};

module.exports = authService;
