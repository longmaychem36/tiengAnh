const nodemailer = require('nodemailer');

function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const timeout = Number(process.env.SMTP_TIMEOUT_MS || 20000);

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass },
    connectionTimeout: timeout,
    greetingTimeout: timeout,
    socketTimeout: timeout
  });
}

async function sendMail({ to, subject, text, html }) {
  const transporter = getMailTransporter();
  if (!transporter) {
    return { error: 'Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and MAIL_FROM.' };
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  try {
    await transporter.sendMail({ from, to, subject, text, html });
    return { sent: true };
  } catch (err) {
    const reason = err?.code || err?.command || err?.message || 'SMTP error';
    console.error('[Mailer] Failed to send email:', reason);
    return { error: 'Could not send email. Check SMTP settings on the server.' };
  }
}

module.exports = { getMailTransporter, sendMail };
