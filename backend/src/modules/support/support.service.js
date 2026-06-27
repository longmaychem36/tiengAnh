const axios = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');
const { getPool } = require('../../config/database');
const notificationService = require('../notification/notification.service');

const VALID_STATUSES = new Set(['open', 'in_progress', 'answered', 'resolved', 'closed']);
let schemaReady = false;

function requiredString(value, fieldName, maxLength = 1000) {
  const text = String(value ?? '').trim();
  if (!text) {
    const err = new Error(`${fieldName} is required`);
    err.statusCode = 400;
    throw err;
  }
  return text.slice(0, maxLength);
}

function optionalString(value, maxLength = 1000) {
  const text = String(value ?? '').trim();
  return text ? text.slice(0, maxLength) : null;
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

async function uploadAttachment(file, ticketId) {
  if (!file) return null;

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    folder: 'lingoconnect/support-tickets',
    public_id: `ticket_${ticketId}`,
    timestamp
  };

  const form = new FormData();
  form.append('file', file.buffer, {
    filename: file.originalname || 'support-attachment',
    contentType: file.mimetype
  });
  Object.entries(params).forEach(([key, value]) => form.append(key, value));
  form.append('api_key', apiKey);
  form.append('signature', signCloudinaryParams(params, apiSecret));

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      form,
      {
        headers: form.getHeaders(),
        timeout: 30000,
        maxContentLength: 8 * 1024 * 1024
      }
    );

    const secureUrl = response.data?.secure_url;
    if (!secureUrl) {
      const err = new Error('Cloudinary did not return an attachment URL');
      err.statusCode = 502;
      throw err;
    }

    return {
      url: secureUrl,
      publicId: response.data?.public_id || params.public_id
    };
  } catch (err) {
    if (err.statusCode) throw err;
    const detail = err.response?.data?.error?.message || err.message;
    const uploadErr = new Error(`Cloudinary upload failed: ${detail}`);
    uploadErr.statusCode = 502;
    throw uploadErr;
  }
}

async function ensureSupportSchema() {
  if (schemaReady) return;
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS SupportTickets (
      Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      Email VARCHAR(255) NOT NULL,
      Title VARCHAR(255) NOT NULL,
      Description TEXT NOT NULL,
      Category VARCHAR(80) NOT NULL,
      Status VARCHAR(30) NOT NULL DEFAULT 'open',
      AttachmentUrl TEXT NULL,
      AttachmentPublicId VARCHAR(255) NULL,
      AttachmentOriginalName VARCHAR(255) NULL,
      AttachmentMimeType VARCHAR(120) NULL,
      AdminResponse TEXT NULL,
      RespondedBy UUID NULL REFERENCES Users(Id) ON DELETE SET NULL,
      RespondedAt TIMESTAMP NULL,
      CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
      UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    ALTER TABLE SupportTickets
    ADD COLUMN IF NOT EXISTS AttachmentPublicId VARCHAR(255) NULL,
    ADD COLUMN IF NOT EXISTS AttachmentOriginalName VARCHAR(255) NULL,
    ADD COLUMN IF NOT EXISTS AttachmentMimeType VARCHAR(120) NULL,
    ADD COLUMN IF NOT EXISTS AdminResponse TEXT NULL,
    ADD COLUMN IF NOT EXISTS RespondedBy UUID NULL REFERENCES Users(Id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS RespondedAt TIMESTAMP NULL,
    ADD COLUMN IF NOT EXISTS UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW()
  `);

  await pool.query('CREATE INDEX IF NOT EXISTS idx_support_tickets_user_created ON SupportTickets (UserId, CreatedAt DESC)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_support_tickets_status_created ON SupportTickets (Status, CreatedAt DESC)');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS SupportTicketMessages (
      Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      TicketId UUID NOT NULL REFERENCES SupportTickets(Id) ON DELETE CASCADE,
      SenderId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      SenderRole VARCHAR(20) NOT NULL,
      Message TEXT NOT NULL,
      AttachmentUrl TEXT NULL,
      AttachmentPublicId VARCHAR(255) NULL,
      AttachmentOriginalName VARCHAR(255) NULL,
      AttachmentMimeType VARCHAR(120) NULL,
      CreatedAt TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query('CREATE INDEX IF NOT EXISTS idx_support_ticket_messages_ticket_created ON SupportTicketMessages (TicketId, CreatedAt ASC)');

  schemaReady = true;
}

function shapeTicket(row = {}) {
  return {
    id: row.id || row.Id,
    userId: row.userid || row.UserId,
    username: row.username || row.Username || null,
    userEmail: row.useremail || row.UserEmail || null,
    email: row.email || row.Email,
    title: row.title || row.Title,
    description: row.description || row.Description,
    category: row.category || row.Category,
    status: row.status || row.Status || 'open',
    attachmentUrl: row.attachmenturl || row.AttachmentUrl || null,
    attachmentPublicId: row.attachmentpublicid || row.AttachmentPublicId || null,
    attachmentOriginalName: row.attachmentoriginalname || row.AttachmentOriginalName || null,
    attachmentMimeType: row.attachmentmimetype || row.AttachmentMimeType || null,
    adminResponse: row.adminresponse || row.AdminResponse || null,
    respondedBy: row.respondedby || row.RespondedBy || null,
    responderName: row.respondername || row.ResponderName || null,
    respondedAt: row.respondedat || row.RespondedAt || null,
    createdAt: row.createdat || row.CreatedAt,
    updatedAt: row.updatedat || row.UpdatedAt
  };
}

function shapeMessage(row = {}) {
  return {
    id: row.id || row.Id,
    ticketId: row.ticketid || row.TicketId,
    senderId: row.senderid || row.SenderId,
    senderRole: row.senderrole || row.SenderRole,
    senderName: row.sendername || row.SenderName || null,
    message: row.message || row.Message,
    attachmentUrl: row.attachmenturl || row.AttachmentUrl || null,
    attachmentPublicId: row.attachmentpublicid || row.AttachmentPublicId || null,
    attachmentOriginalName: row.attachmentoriginalname || row.AttachmentOriginalName || null,
    attachmentMimeType: row.attachmentmimetype || row.AttachmentMimeType || null,
    createdAt: row.createdat || row.CreatedAt
  };
}

async function getTicketMessages(ticketId) {
  const pool = getPool();
  const result = await pool.query(`
    SELECT stm.*, u.Username AS SenderName
    FROM SupportTicketMessages stm
    LEFT JOIN Users u ON u.Id = stm.SenderId
    WHERE stm.TicketId = $1
    ORDER BY stm.CreatedAt ASC
  `, [ticketId]);
  return result.rows.map(shapeMessage);
}

async function getTicketById(ticketId) {
  const pool = getPool();
  const result = await pool.query(`
    SELECT st.*,
           u.Username AS Username,
           u.Email AS UserEmail,
           admin.Username AS ResponderName
    FROM SupportTickets st
    LEFT JOIN Users u ON u.Id = st.UserId
    LEFT JOIN Users admin ON admin.Id = st.RespondedBy
    WHERE st.Id = $1
  `, [ticketId]);
  if (!result.rows[0]) return null;
  const ticket = shapeTicket(result.rows[0]);
  ticket.messages = await getTicketMessages(ticketId);
  return ticket;
}

function ensureTicketCanReceiveMessage(ticket) {
  if ((ticket?.status || '').toLowerCase() !== 'closed') return;
  const err = new Error('Phiếu hỗ trợ đã đóng, không thể gửi thêm tin nhắn.');
  err.statusCode = 400;
  throw err;
}

async function notifyUserAboutAdminReply(ticket, response, status, adminId) {
  try {
    const isClosed = status === 'closed';
    await notificationService.createNotification({
      title: isClosed ? 'Phiếu hỗ trợ đã được đóng' : 'Admin đã phản hồi phiếu hỗ trợ',
      message: `${isClosed ? 'Phiếu hỗ trợ của bạn đã được admin phản hồi và đóng.' : 'Admin vừa phản hồi phiếu hỗ trợ của bạn.'}\n\nTiêu đề: ${ticket.title}\n\nNội dung: ${response}`,
      type: isClosed ? 'support_closed' : 'support_reply',
      linkUrl: '/support',
      audience: 'selected',
      userIds: [ticket.userId],
      createdBy: adminId,
      sendEmail: true
    });
  } catch (error) {
    console.warn('Support reply notification failed:', error.message);
  }
}

const supportService = {
  ensureSupportSchema,

  async createTicket(userId, data, file) {
    await ensureSupportSchema();
    const ticketId = crypto.randomUUID();
    const email = requiredString(data.email, 'Email', 255);
    const title = requiredString(data.title, 'Title', 255);
    const description = requiredString(data.description, 'Description', 5000);
    const category = requiredString(data.category, 'Category', 80);
    const attachment = await uploadAttachment(file, ticketId);

    const pool = getPool();
    const result = await pool.query(`
      INSERT INTO SupportTickets (
        Id, UserId, Email, Title, Description, Category,
        AttachmentUrl, AttachmentPublicId, AttachmentOriginalName, AttachmentMimeType
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      ticketId,
      userId,
      email,
      title,
      description,
      category,
      attachment?.url || null,
      attachment?.publicId || null,
      file?.originalname || null,
      file?.mimetype || null
    ]);

    await pool.query(`
      INSERT INTO SupportTicketMessages (
        TicketId, SenderId, SenderRole, Message,
        AttachmentUrl, AttachmentPublicId, AttachmentOriginalName, AttachmentMimeType
      )
      VALUES ($1, $2, 'user', $3, $4, $5, $6, $7)
    `, [
      ticketId,
      userId,
      description,
      attachment?.url || null,
      attachment?.publicId || null,
      file?.originalname || null,
      file?.mimetype || null
    ]);

    return shapeTicket(result.rows[0]);
  },

  async getUserTickets(userId) {
    await ensureSupportSchema();
    const pool = getPool();
    const result = await pool.query(`
      SELECT st.*, admin.Username AS ResponderName
      FROM SupportTickets st
      LEFT JOIN Users admin ON admin.Id = st.RespondedBy
      WHERE st.UserId = $1
      ORDER BY st.CreatedAt DESC
    `, [userId]);
    return result.rows.map(shapeTicket);
  },

  async getUserTicket(userId, ticketId) {
    await ensureSupportSchema();
    const ticket = await getTicketById(ticketId);
    if (!ticket || ticket.userId !== userId) return null;
    return ticket;
  },

  async getAdminTickets(filters = {}) {
    await ensureSupportSchema();
    const pool = getPool();
    const values = [];
    const where = [];

    if (filters.status && filters.status !== 'all') {
      values.push(filters.status);
      where.push(`st.Status = $${values.length}`);
    }

    if (filters.category && filters.category !== 'all') {
      values.push(filters.category);
      where.push(`st.Category = $${values.length}`);
    }

    if (filters.search) {
      values.push(`%${String(filters.search).trim()}%`);
      where.push(`(st.Title ILIKE $${values.length} OR st.Description ILIKE $${values.length} OR st.Email ILIKE $${values.length} OR u.Username ILIKE $${values.length})`);
    }

    const result = await pool.query(`
      SELECT st.*,
             u.Username AS Username,
             u.Email AS UserEmail,
             admin.Username AS ResponderName
      FROM SupportTickets st
      LEFT JOIN Users u ON u.Id = st.UserId
      LEFT JOIN Users admin ON admin.Id = st.RespondedBy
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY
        CASE st.Status
          WHEN 'open' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'answered' THEN 3
          WHEN 'resolved' THEN 4
          ELSE 5
        END,
        st.CreatedAt DESC
    `, values);

    return result.rows.map(shapeTicket);
  },

  async getAdminTicket(ticketId) {
    await ensureSupportSchema();
    return getTicketById(ticketId);
  },

  async respondToTicket(ticketId, adminId, data) {
    await ensureSupportSchema();
    const existingTicket = await getTicketById(ticketId);
    if (!existingTicket) return null;
    ensureTicketCanReceiveMessage(existingTicket);

    const response = requiredString(data.response, 'Response', 5000);
    const status = optionalString(data.status, 30) || 'answered';

    if (!VALID_STATUSES.has(status)) {
      const err = new Error('Invalid support ticket status');
      err.statusCode = 400;
      throw err;
    }

    const pool = getPool();
    await pool.query(`
      INSERT INTO SupportTicketMessages (TicketId, SenderId, SenderRole, Message)
      VALUES ($1, $2, 'admin', $3)
    `, [ticketId, adminId, response]);

    const result = await pool.query(`
      UPDATE SupportTickets
      SET AdminResponse = $2,
          Status = $3,
          RespondedBy = $4,
          RespondedAt = NOW(),
          UpdatedAt = NOW()
      WHERE Id = $1
      RETURNING *
    `, [ticketId, response, status, adminId]);

    if (!result.rows[0]) return null;
    await notifyUserAboutAdminReply(existingTicket, response, status, adminId);
    return getTicketById(ticketId);
  },

  async addUserMessage(userId, ticketId, data, file) {
    await ensureSupportSchema();
    const ticket = await this.getUserTicket(userId, ticketId);
    if (!ticket) return null;
    ensureTicketCanReceiveMessage(ticket);

    const message = requiredString(data.message, 'Message', 5000);
    const attachment = await uploadAttachment(file, `${ticketId}_${Date.now()}`);
    const pool = getPool();

    await pool.query(`
      INSERT INTO SupportTicketMessages (
        TicketId, SenderId, SenderRole, Message,
        AttachmentUrl, AttachmentPublicId, AttachmentOriginalName, AttachmentMimeType
      )
      VALUES ($1, $2, 'user', $3, $4, $5, $6, $7)
    `, [
      ticketId,
      userId,
      message,
      attachment?.url || null,
      attachment?.publicId || null,
      file?.originalname || null,
      file?.mimetype || null
    ]);

    await pool.query(`
      UPDATE SupportTickets
      SET Status = CASE WHEN Status IN ('answered', 'resolved', 'closed') THEN 'open' ELSE Status END,
          UpdatedAt = NOW()
      WHERE Id = $1
    `, [ticketId]);

    return getTicketById(ticketId);
  },

  async updateTicketStatus(ticketId, status) {
    await ensureSupportSchema();
    if (!VALID_STATUSES.has(status)) {
      const err = new Error('Invalid support ticket status');
      err.statusCode = 400;
      throw err;
    }

    const pool = getPool();
    const result = await pool.query(`
      UPDATE SupportTickets
      SET Status = $2,
          UpdatedAt = NOW()
      WHERE Id = $1
      RETURNING *
    `, [ticketId, status]);

    if (!result.rows[0]) return null;
    return getTicketById(ticketId);
  }
};

module.exports = supportService;
