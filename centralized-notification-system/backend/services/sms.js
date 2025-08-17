const Twilio = require('twilio');
require('dotenv').config();

const client = Twilio(process.env.TWILIO_ACCOUNT_SID || '', process.env.TWILIO_AUTH_TOKEN || '');

async function sendSMS({ to, body, from = process.env.TWILIO_FROM }) {
  if (!process.env.TWILIO_ACCOUNT_SID) throw new Error('Twilio not configured');
  const msg = await client.messages.create({ to, from, body });
  return msg;
}

module.exports = { sendSMS };
