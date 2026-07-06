const { sql, getPool } = require('../../config/database');
const { sendMail } = require('../../utils/mailer');
const { ensureSoftDeleteSchema } = require('../soft-delete/soft-delete.schema');

let schemaReady = false;

function rowId(row = {}) {
  return row.Id || row.id;
}

function normalizeNotification(row = {}) {
  return {
    id: row.Id || row.id,
    title: row.Title || row.title,
    message: row.Message || row.message,
    type: row.Type || row.type || 'info',
    linkUrl: row.LinkUrl || row.linkurl || null,
    audience: row.Audience || row.audience || 'selected',
    createdBy: row.CreatedBy || row.createdby || null,
    createdAt: row.CreatedAt || row.createdat,
    readAt: row.ReadAt || row.readat || null,
    emailedAt: row.EmailedAt || row.emailedat || null,
    emailError: row.EmailError || row.emailerror || null,
    recipientId: row.RecipientId || row.recipientid || null,
    username: row.Username || row.username || null,
    email: row.Email || row.email || null
  };
}

async function ensureNotificationSchema() {
  if (schemaReady) return;
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Notifications (
      Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      Title VARCHAR(180) NOT NULL,
      Message TEXT NOT NULL,
      Type VARCHAR(40) NOT NULL DEFAULT 'info',
      LinkUrl TEXT NULL,
      Audience VARCHAR(30) NOT NULL DEFAULT 'selected',
      CreatedBy UUID NULL REFERENCES Users(Id) ON DELETE SET NULL,
      CreatedAt TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS NotificationRecipients (
      Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      NotificationId UUID NOT NULL REFERENCES Notifications(Id) ON DELETE CASCADE,
      UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      ReadAt TIMESTAMP NULL,
      EmailedAt TIMESTAMP NULL,
      EmailError TEXT NULL,
      CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE(NotificationId, UserId)
    )
  `);

  await pool.query('CREATE INDEX IF NOT EXISTS idx_notification_recipients_user_created ON NotificationRecipients (UserId, CreatedAt DESC)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_notification_recipients_notification ON NotificationRecipients (NotificationId)');
  schemaReady = true;
}

async function getUsersByIds(userIds = []) {
  const ids = [...new Set(userIds.filter(Boolean).map(String))];
  if (ids.length === 0) return [];

  const pool = getPool();
  await ensureSoftDeleteSchema();
  const result = await pool.query(`
    SELECT Id, Username, Email
    FROM Users
    WHERE Id = ANY($1::uuid[])
      AND Role = 'user'
      AND COALESCE(IsDeleted, false) = false
  `, [ids]);
  return result.rows;
}

async function getAllLearners() {
  const pool = getPool();
  await ensureSoftDeleteSchema();
  const result = await pool.query(`
    SELECT Id, Username, Email
    FROM Users
    WHERE Role = 'user'
      AND COALESCE(IsDeleted, false) = false
  `);
  return result.rows;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getAbsoluteLinkUrl(linkUrl) {
  if (!linkUrl) return null;
  if (/^https?:\/\//i.test(linkUrl)) return linkUrl;

  const baseUrl = (process.env.FRONTEND_URL || process.env.APP_URL || '').replace(/\/$/, '');
  if (!baseUrl) return linkUrl;
  return `${baseUrl}${String(linkUrl).startsWith('/') ? linkUrl : `/${linkUrl}`}`;
}

function buildEmailHtml({ title, message, linkUrl }) {
  const appName = process.env.APP_NAME || 'LingoConnect';
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const absoluteLink = getAbsoluteLinkUrl(linkUrl);
  const linkHtml = absoluteLink
    ? `<p><a href="${escapeHtml(absoluteLink)}" style="display:inline-block;background:#1cb0f6;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:700">Mở trong ${escapeHtml(appName)}</a></p>`
    : '';

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#102033">
      <h2>${safeTitle}</h2>
      <p>${safeMessage}</p>
      ${linkHtml}
      <p style="color:#6b7280;font-size:13px">Thông báo này được gửi từ ${escapeHtml(appName)}.</p>
    </div>
  `;
}

async function emailRecipient(notification, recipient) {
  const to = recipient.Email || recipient.email;
  if (!to) return { skipped: true, reason: 'missing email' };

  const appName = process.env.APP_NAME || 'LingoConnect';
  const title = notification.Title || notification.title;
  const message = notification.Message || notification.message;
  const linkUrl = notification.LinkUrl || notification.linkurl || null;
  const absoluteLink = getAbsoluteLinkUrl(linkUrl);

  return sendMail({
    to,
    subject: `[${appName}] ${title}`,
    text: `${title}\n\n${message}${absoluteLink ? `\n\n${absoluteLink}` : ''}`,
    html: buildEmailHtml({ title, message, linkUrl })
  });
}

const notificationService = {
  async ensureNotificationSchema() {
    await ensureNotificationSchema();
  },

  async createNotification({ title, message, type = 'info', linkUrl = null, audience = 'selected', userIds = [], createdBy = null, sendEmail = true }) {
    await ensureNotificationSchema();

    if (!String(title || '').trim() || !String(message || '').trim()) {
      const err = new Error('Title and message are required');
      err.statusCode = 400;
      throw err;
    }

    const recipients = audience === 'all' ? await getAllLearners() : await getUsersByIds(userIds);
    if (recipients.length === 0) {
      const err = new Error('No notification recipients found');
      err.statusCode = 400;
      throw err;
    }

    const pool = getPool();
    const created = await pool.request()
      .input('title', sql.NVarChar, String(title).trim())
      .input('message', sql.NText, String(message).trim())
      .input('type', sql.NVarChar, String(type || 'info'))
      .input('linkUrl', sql.NVarChar, linkUrl || null)
      .input('audience', sql.NVarChar, audience === 'all' ? 'all' : 'selected')
      .input('createdBy', sql.UniqueIdentifier, createdBy || null)
      .query(`
        INSERT INTO Notifications (Title, Message, Type, LinkUrl, Audience, CreatedBy)
        VALUES (@title, @message, @type, @linkUrl, @audience, @createdBy)
        RETURNING Id, Title, Message, Type, LinkUrl, Audience, CreatedBy, CreatedAt
      `);

    const notification = created.recordset[0];
    const notificationId = rowId(notification);

    for (const recipient of recipients) {
      await pool.query(`
        INSERT INTO NotificationRecipients (NotificationId, UserId)
        VALUES ($1, $2)
        ON CONFLICT (NotificationId, UserId) DO NOTHING
      `, [notificationId, rowId(recipient)]);
    }

    if (sendEmail) {
      await this.sendNotificationEmails(notificationId);
    }

    return {
      notification: normalizeNotification(notification),
      recipientCount: recipients.length
    };
  },

  async sendNotificationEmails(notificationId) {
    await ensureNotificationSchema();
    const pool = getPool();
    const result = await pool.query(`
      SELECT n.Id, n.Title, n.Message, n.Type, n.LinkUrl,
             nr.Id AS RecipientId, nr.UserId, u.Username, u.Email
      FROM Notifications n
      INNER JOIN NotificationRecipients nr ON nr.NotificationId = n.Id
      INNER JOIN Users u ON u.Id = nr.UserId
      WHERE n.Id = $1
        AND nr.EmailedAt IS NULL
    `, [notificationId]);

    let sent = 0;
    let failed = 0;
    for (const row of result.rows) {
      const mail = await emailRecipient(row, row);
      if (mail.sent) {
        sent += 1;
        await pool.query('UPDATE NotificationRecipients SET EmailedAt = NOW(), EmailError = NULL WHERE Id = $1', [row.recipientid]);
      } else if (mail.error) {
        failed += 1;
        await pool.query('UPDATE NotificationRecipients SET EmailError = $2 WHERE Id = $1', [row.recipientid, mail.error]);
      }
    }

    return { sent, failed };
  },

  async listForUser(userId, limit = 20) {
    await ensureNotificationSchema();
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const pool = getPool();
    const result = await pool.query(`
      SELECT n.Id, n.Title, n.Message, n.Type, n.LinkUrl, n.Audience, n.CreatedAt,
             nr.Id AS RecipientId, nr.ReadAt, nr.EmailedAt, nr.EmailError
      FROM NotificationRecipients nr
      INNER JOIN Notifications n ON n.Id = nr.NotificationId
      WHERE nr.UserId = $1
      ORDER BY n.CreatedAt DESC
      LIMIT $2
    `, [userId, safeLimit]);

    const unreadResult = await pool.query(`
      SELECT COUNT(*)::int AS count
      FROM NotificationRecipients
      WHERE UserId = $1 AND ReadAt IS NULL
    `, [userId]);

    return {
      notifications: result.rows.map(normalizeNotification),
      unreadCount: Number(unreadResult.rows[0]?.count || 0)
    };
  },

  async markRead(userId, recipientId = null) {
    await ensureNotificationSchema();
    const pool = getPool();
    if (recipientId) {
      await pool.query('UPDATE NotificationRecipients SET ReadAt = COALESCE(ReadAt, NOW()) WHERE Id = $1 AND UserId = $2', [recipientId, userId]);
    } else {
      await pool.query('UPDATE NotificationRecipients SET ReadAt = COALESCE(ReadAt, NOW()) WHERE UserId = $1', [userId]);
    }
    return this.listForUser(userId);
  },

  async adminList(page = 1, limit = 20) {
    await ensureNotificationSchema();
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const offset = (safePage - 1) * safeLimit;
    const pool = getPool();
    const count = await pool.query('SELECT COUNT(*)::int AS total FROM Notifications');
    const result = await pool.query(`
      SELECT n.Id, n.Title, n.Message, n.Type, n.LinkUrl, n.Audience, n.CreatedBy, n.CreatedAt,
             COUNT(nr.Id)::int AS RecipientCount,
             COUNT(nr.ReadAt)::int AS ReadCount,
             COUNT(nr.EmailedAt)::int AS EmailSentCount
      FROM Notifications n
      LEFT JOIN NotificationRecipients nr ON nr.NotificationId = n.Id
      GROUP BY n.Id
      ORDER BY n.CreatedAt DESC
      LIMIT $1 OFFSET $2
    `, [safeLimit, offset]);

    return {
      notifications: result.rows.map((row) => ({
        ...normalizeNotification(row),
        recipientCount: Number(row.recipientcount || 0),
        readCount: Number(row.readcount || 0),
        emailSentCount: Number(row.emailsentcount || 0)
      })),
      total: Number(count.rows[0]?.total || 0),
      page: safePage,
      limit: safeLimit
    };
  },

  async notifyLevelUp(userId, level) {
    return this.createNotification({
      title: `Bạn đã lên cấp ${level}`,
      message: `Chúc mừng! Bạn vừa đạt cấp ${level} trên LingoConnect. Tiếp tục học đều để giữ nhịp tiến bộ.`,
      type: 'level_up',
      linkUrl: '/dashboard',
      audience: 'selected',
      userIds: [userId],
      sendEmail: true
    });
  },

  async notifyPlusActivated(userId, plusExpiresAt) {
    const untilText = plusExpiresAt ? ` Gói có hiệu lực đến ${new Date(plusExpiresAt).toLocaleDateString('vi-VN')}.` : '';
    return this.createNotification({
      title: 'Plus đã được kích hoạt',
      message: `Tài khoản của bạn đã được nâng cấp Plus thành công.${untilText} Bạn có thể bắt đầu luyện Listening, Speaking và AI Speaking Builder.`,
      type: 'plus_activated',
      linkUrl: '/settings',
      audience: 'selected',
      userIds: [userId],
      sendEmail: true
    });
  }
};

module.exports = notificationService;
