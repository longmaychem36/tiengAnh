// ============================================
// Billing Module - Service
// ============================================
const crypto = require('crypto');
const axios = require('axios');
const { getPool } = require('../../config/database');
const notificationService = require('../notification/notification.service');

const PLUS_PRICE_VND = Number.parseInt(process.env.PLUS_PRICE_VND || '2000', 10);
const PLUS_DURATION_DAYS = Number.parseInt(process.env.PLUS_DURATION_DAYS || '30', 10);

const sepayConfig = {
  bankCode: process.env.SEPAY_BANK_CODE || '',
  accountNumber: process.env.SEPAY_ACCOUNT_NUMBER || '',
  accountName: process.env.SEPAY_ACCOUNT_NAME || '',
  webhookApiKey: process.env.SEPAY_WEBHOOK_API_KEY || '',
  apiToken: process.env.SEPAY_API_TOKEN || ''
};

let schemaReady = false;

async function ensureBillingSchema() {
  if (schemaReady) return;
  const pool = getPool();

  await pool.query(`
    ALTER TABLE Users
    ADD COLUMN IF NOT EXISTS Plan VARCHAR(20) DEFAULT 'free',
    ADD COLUMN IF NOT EXISTS PlusExpiresAt TIMESTAMP NULL
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS PaymentRequests (
      Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      UserId UUID NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      Plan VARCHAR(20) NOT NULL DEFAULT 'plus',
      Amount INTEGER NOT NULL,
      Status VARCHAR(20) NOT NULL DEFAULT 'pending',
      TransferContent VARCHAR(120) NOT NULL,
      Gateway VARCHAR(40) NOT NULL DEFAULT 'sepay',
      SePayTransactionId VARCHAR(80) NULL,
      RawPayload JSONB NULL,
      CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
      CompletedAt TIMESTAMP NULL
    )
  `);

  await pool.query(`
    ALTER TABLE PaymentRequests
    ADD COLUMN IF NOT EXISTS Gateway VARCHAR(40) NOT NULL DEFAULT 'sepay',
    ADD COLUMN IF NOT EXISTS SePayTransactionId VARCHAR(80) NULL,
    ADD COLUMN IF NOT EXISTS RawPayload JSONB NULL
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_requests_transfer_content
    ON PaymentRequests (TransferContent)
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_requests_sepay_transaction
    ON PaymentRequests (SePayTransactionId)
    WHERE SePayTransactionId IS NOT NULL
  `);

  schemaReady = true;
}

function normalizePlan(row = {}) {
  const plan = (row.plan || row.Plan || 'free').toLowerCase();
  const plusExpiresAt = row.plusexpiresat || row.PlusExpiresAt || null;
  const isPlus = plan === 'plus' && (!plusExpiresAt || new Date(plusExpiresAt).getTime() > Date.now());

  return {
    plan: isPlus ? 'plus' : 'free',
    isPlus,
    plusExpiresAt
  };
}

function normalizePayment(row = {}) {
  return {
    id: row.id || row.Id,
    amount: row.amount || row.Amount,
    status: row.status || row.Status,
    transferContent: row.transfercontent || row.TransferContent,
    gateway: row.gateway || row.Gateway,
    sepayTransactionId: row.sepaytransactionid || row.SePayTransactionId || null,
    createdAt: row.createdat || row.CreatedAt,
    completedAt: row.completedat || row.CompletedAt || null
  };
}

function normalizeQrText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .slice(0, 80);
}

function buildQrUrl({ amount, content }) {
  if (!sepayConfig.bankCode || !sepayConfig.accountNumber) return null;

  const params = new URLSearchParams({
    acc: sepayConfig.accountNumber,
    bank: sepayConfig.bankCode,
    amount: String(amount),
    des: normalizeQrText(content),
    template: 'compact',
    showinfo: 'true'
  });

  if (sepayConfig.accountName) {
    params.set('holder', normalizeQrText(sepayConfig.accountName));
  }

  return `https://vietqr.app/img?${params.toString()}`;
}

function createTransferContent(userId) {
  const userSuffix = String(userId || '').replace(/-/g, '').slice(0, 6).toUpperCase();
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SEVQR${userSuffix}${randomSuffix}`;
}

function isValidSepayTransferContent(content) {
  return /^SEVQR/i.test(String(content || '').trim());
}

function extractWebhookApiKey(req) {
  const auth = req.headers.authorization || '';
  if (auth.toLowerCase().startsWith('apikey ')) return auth.slice(7).trim();
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();
  return req.headers['x-sepay-api-key']
    || req.headers['x-api-key']
    || req.query?.apiKey
    || req.query?.apikey
    || '';
}

function parseAmount(value = 0) {
  const normalized = String(value).replace(/[^\d.-]/g, '');
  return Number(normalized || 0);
}

function getWebhookAmount(payload = {}) {
  const raw = payload.transferAmount || payload.amount || payload.transfer_amount || payload.money || 0;
  return parseAmount(raw);
}

function getWebhookContent(payload = {}) {
  return String(
    payload.content
    || payload.code
    || payload.transferContent
    || payload.description
    || payload.transactionContent
    || payload.transaction_content
    || payload.reference
    || ''
  ).trim();
}

function getWebhookTransactionId(payload = {}) {
  return String(payload.id || payload.referenceCode || payload.reference_code || payload.code || payload.gatewayTransactionId || '').trim();
}

function normalizeSepayApiTransaction(row = {}) {
  const amount = row.transferAmount || row.amount_in || row.amountIn || row.amount || 0;
  return {
    id: String(row.id || row.referenceCode || row.reference_code || row.code || ''),
    content: String(row.content || row.transaction_content || row.transactionContent || row.description || row.code || ''),
    amount: parseAmount(amount),
    accountNumber: String(row.accountNumber || row.account_number || '').trim(),
    transferType: String(row.transferType || row.transfer_type || (parseAmount(row.amount_out || 0) > 0 ? 'out' : 'in')).toLowerCase(),
    raw: row
  };
}

async function activatePlusForPayment(payment, payload) {
  const pool = getPool();
  const userResult = await pool.query(`
    UPDATE Users
    SET Plan = 'plus',
        PlusExpiresAt = GREATEST(COALESCE(PlusExpiresAt, NOW()), NOW()) + ($2 || ' days')::INTERVAL
    WHERE Id = $1
    RETURNING Id, Username, Email, Role, Plan, PlusExpiresAt, CreatedAt
  `, [payment.userid, PLUS_DURATION_DAYS]);

  await pool.query(`
    UPDATE PaymentRequests
    SET Status = 'completed',
        CompletedAt = NOW(),
        SePayTransactionId = $2,
        RawPayload = $3::jsonb
    WHERE Id = $1
  `, [payment.id, getWebhookTransactionId(payload) || null, JSON.stringify(payload)]);

  const user = userResult.rows[0];
  notificationService.notifyPlusActivated(user.id || user.Id, user.plusexpiresat || user.PlusExpiresAt).catch((err) => {
    console.error('[Notification] Failed to send Plus notification:', err.message);
  });

  return user;
}

async function fetchSepayTransactions() {
  if (!sepayConfig.apiToken) return [];

  const response = await axios.get('https://my.sepay.vn/userapi/transactions/list', {
    headers: {
      Authorization: `Bearer ${sepayConfig.apiToken}`,
      'Content-Type': 'application/json'
    },
    params: {
      limit: 100,
      ...(sepayConfig.accountNumber ? { account_number: sepayConfig.accountNumber } : {})
    },
    timeout: 20000
  });

  const body = response.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.transactions)) return body.transactions;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.transactions)) return body.data.transactions;
  return [];
}

function payloadToTransaction(payload = {}) {
  return {
    id: getWebhookTransactionId(payload) || String(payload.id || payload.code || ''),
    content: getWebhookContent(payload),
    amount: getWebhookAmount(payload),
    accountNumber: String(payload.accountNumber || payload.account_number || '').trim(),
    transferType: String(payload.transferType || payload.transfer_type || 'in').toLowerCase(),
    raw: payload
  };
}

async function findPendingPaymentForTransaction(transaction) {
  const pool = getPool();
  const result = await pool.query(`
    SELECT Id, UserId, Amount, Status, TransferContent
    FROM PaymentRequests
    WHERE Status = 'pending'
      AND $1 ILIKE '%' || TransferContent || '%'
      AND Amount <= $2
    ORDER BY CreatedAt ASC
    LIMIT 1
  `, [transaction.content, transaction.amount]);

  return result.rows[0] || null;
}

async function activatePlusFromTransaction(transaction) {
  if (!transaction || transaction.transferType === 'out') {
    return { ignored: true, reason: 'not incoming transaction' };
  }

  if (sepayConfig.accountNumber && transaction.accountNumber && transaction.accountNumber !== sepayConfig.accountNumber) {
    return { ignored: true, reason: 'account number mismatch' };
  }

  const payment = await findPendingPaymentForTransaction(transaction);
  if (!payment) {
    console.log('[SePay] no pending payment matches transaction:', transaction.content);
    return { ignored: true, reason: 'no matching pending payment' };
  }

  const payload = {
    id: transaction.id || `sepay-${payment.id}`,
    transferType: 'in',
    transferAmount: transaction.amount,
    content: transaction.content,
    accountNumber: transaction.accountNumber,
    source: transaction.raw?.source || 'sepay',
    raw: transaction.raw
  };

  const user = await activatePlusForPayment(payment, payload);
  return {
    success: true,
    paymentId: payment.id,
    userId: payment.userid,
    subscription: normalizePlan(user)
  };
}

const billingService = {
  async ensureBillingSchema() {
    await ensureBillingSchema();
  },

  async getUserPlan(userId) {
    await ensureBillingSchema();
    const pool = getPool();
    const result = await pool.query(
      'SELECT Plan, PlusExpiresAt FROM Users WHERE Id = $1',
      [userId]
    );

    if (result.rows.length === 0) return null;
    return normalizePlan(result.rows[0]);
  },

  async isPlusUser(userId) {
    const plan = await this.getUserPlan(userId);
    return Boolean(plan?.isPlus);
  },

  getUpgradeInfo() {
    return {
      plan: 'plus',
      price: PLUS_PRICE_VND,
      durationDays: PLUS_DURATION_DAYS,
      provider: 'sepay',
      transfer: {
        bankCode: sepayConfig.bankCode,
        accountNumber: sepayConfig.accountNumber,
        accountName: sepayConfig.accountName,
        amount: PLUS_PRICE_VND,
        currency: 'VND'
      }
    };
  },

  async createPlusOrder(userId) {
    await ensureBillingSchema();
    const pool = getPool();

    const existing = await pool.query(`
      SELECT Id, Amount, Status, TransferContent, Gateway, SePayTransactionId, CreatedAt, CompletedAt
      FROM PaymentRequests
      WHERE UserId = $1 AND Plan = 'plus' AND Status = 'pending'
      ORDER BY CreatedAt DESC
      LIMIT 1
    `, [userId]);

    let payment = existing.rows[0] || null;

    if (payment && !isValidSepayTransferContent(payment.transfercontent || payment.TransferContent)) {
      await pool.query(`
        UPDATE PaymentRequests
        SET Status = 'expired'
        WHERE Id = $1
      `, [payment.id || payment.Id]);
      payment = null;
    }

    payment = payment || (await pool.query(`
      INSERT INTO PaymentRequests (UserId, Plan, Amount, Status, TransferContent, Gateway)
      VALUES ($1, 'plus', $2, 'pending', $3, 'sepay')
      RETURNING Id, Amount, Status, TransferContent, Gateway, SePayTransactionId, CreatedAt, CompletedAt
    `, [userId, PLUS_PRICE_VND, createTransferContent(userId)])).rows[0];

    const normalized = normalizePayment(payment);
    return {
      payment: normalized,
      subscription: await this.getUserPlan(userId),
      upgrade: this.getUpgradeInfo(),
      qrUrl: buildQrUrl({
        amount: normalized.amount,
        content: normalized.transferContent
      })
    };
  },

  async getPlusOrderStatus(userId, orderId) {
    await ensureBillingSchema();
    const pool = getPool();
    let result = await pool.query(`
      SELECT Id, Amount, Status, TransferContent, Gateway, SePayTransactionId, CreatedAt, CompletedAt
      FROM PaymentRequests
      WHERE Id = $1 AND UserId = $2
    `, [orderId, userId]);

    if (result.rows.length === 0) {
      const err = new Error('Payment order not found');
      err.statusCode = 404;
      throw err;
    }

    let payment = result.rows[0];
    if (payment.status === 'pending') {
      await this.reconcilePlusOrder(payment.id);
      result = await pool.query(`
        SELECT Id, Amount, Status, TransferContent, Gateway, SePayTransactionId, CreatedAt, CompletedAt
        FROM PaymentRequests
        WHERE Id = $1 AND UserId = $2
      `, [orderId, userId]);
      payment = result.rows[0];
    }

    return {
      payment: normalizePayment(payment),
      subscription: await this.getUserPlan(userId)
    };
  },

  async reconcilePlusOrder(orderId) {
    await ensureBillingSchema();
    const pool = getPool();
    const orderResult = await pool.query(`
      SELECT Id, UserId, Amount, Status, TransferContent
      FROM PaymentRequests
      WHERE Id = $1 AND Status = 'pending'
      LIMIT 1
    `, [orderId]);

    if (orderResult.rows.length === 0) {
      return { ignored: true, reason: 'no pending order' };
    }

    const payment = orderResult.rows[0];
    let transactions = [];
    try {
      transactions = await fetchSepayTransactions();
    } catch (err) {
      console.log('[SePay reconcile] failed:', err.response?.data || err.message);
      return { ignored: true, reason: 'sepay api failed' };
    }

    const match = transactions
      .map(normalizeSepayApiTransaction)
      .find((tx) => (
        tx.transferType !== 'out'
        && tx.content.toUpperCase().includes(String(payment.transfercontent).toUpperCase())
        && tx.amount >= payment.amount
        && (!sepayConfig.accountNumber || !tx.accountNumber || tx.accountNumber === sepayConfig.accountNumber)
      ));

    if (!match) {
      console.log('[SePay reconcile] no matching transaction for', payment.transfercontent);
      return { ignored: true, reason: 'no matching transaction' };
    }

    const payload = {
      id: match.id || `sepay-api-${payment.id}`,
      transferType: 'in',
      transferAmount: match.amount,
      content: match.content,
      accountNumber: match.accountNumber,
      source: 'sepay-api',
      raw: match.raw
    };

    const user = await activatePlusForPayment(payment, payload);
    return {
      success: true,
      paymentId: payment.id,
      userId: payment.userid,
      subscription: normalizePlan(user)
    };
  },

  verifySepayWebhook(req) {
    if (!sepayConfig.webhookApiKey) return true;
    return extractWebhookApiKey(req) === sepayConfig.webhookApiKey;
  },

  async handleSepayWebhook(payload = {}) {
    await ensureBillingSchema();
    console.log('[SePay webhook] payload:', JSON.stringify(payload));
    return activatePlusFromTransaction(payloadToTransaction(payload));
  }
};

module.exports = billingService;
