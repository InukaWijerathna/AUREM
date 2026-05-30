const nodemailer = require('nodemailer');

const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const sendEmail = async ({ to, subject, html }) => {
  if (!hasSmtp) {
    console.log(`[EMAIL SKIPPED — no SMTP config] To: ${to} | Subject: ${subject}`);
    return;
  }
  const transporter = getTransporter();
  return transporter.sendMail({
    from: `"${process.env.FROM_NAME || 'AUREM'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

const emailTemplates = {
  verification: (name, url) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7A5C28;">Verify your AUREM account</h2>
      <p>Hi ${name}, thanks for signing up!</p>
      <p>Click the button below to verify your email address:</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#7A5C28;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">Verify Email</a>
      <p style="color:#666;font-size:14px;margin-top:20px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
    </div>
  `,
  passwordReset: (name, otp) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7A5C28;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>Your password reset OTP is:</p>
      <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#4F46E5;margin:20px 0;">${otp}</div>
      <p style="color:#666;font-size:14px;">This OTP expires in 10 minutes. If you didn't request this, ignore this email.</p>
    </div>
  `,
  orderConfirmation: (name, orderId, total) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7A5C28;">Order Confirmed!</h2>
      <p>Hi ${name}, your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <p>We'll notify you when your order ships. Thank you for shopping with AUREM!</p>
    </div>
  `,
  orderShipped: (name, orderId, tracking) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7A5C28;">Your order has shipped!</h2>
      <p>Hi ${name}, order #${orderId} is on its way.</p>
      ${tracking ? `<p><strong>Tracking Number:</strong> ${tracking}</p>` : ''}
      <p>Thank you for shopping with AUREM!</p>
    </div>
  `,
};

module.exports = { sendEmail, emailTemplates };
