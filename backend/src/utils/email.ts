import nodemailer from 'nodemailer';

// Simple nodemailer transporter skeleton.
// In production, use a transactional email provider (SendGrid, SES, Mailgun) and secure credentials.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT || 1025),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
});

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/verify?token=${encodeURIComponent(token)}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject: 'Please verify your email',
    text: `Verify here: ${url}`,
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${encodeURIComponent(token)}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject: 'Password reset',
    text: `Reset here: ${url}`,
    html: `<p>Reset your password <a href="${url}">here</a>.</p>`
  });
}
