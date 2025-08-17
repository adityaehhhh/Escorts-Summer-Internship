
const nodemailer = require('nodemailer');
require('dotenv').config();

async function createTransporter() {

  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
  const missing = required.filter(v => !process.env[v]);
  if (missing.length) {
    console.warn(`⚠ Missing ENV vars: ${missing.join(', ')}`);
    console.warn('Using test SMTP account instead...');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: parseInt(process.env.SMTP_PORT, 10) === 465, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: { rejectUnauthorized: false } 
  });
}

async function sendEmail({ to, subject, text, html }) {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Test Sender" <test@example.com>',
      to,
      subject,
      text,
      html
    });

    console.log('Email sent:', info.messageId);

    if (nodemailer.getTestMessageUrl(info)) {
      console.log('📬 Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (err) {
    console.error('Email send failed:', err);
    throw err;
  }
}

module.exports = { sendEmail };
