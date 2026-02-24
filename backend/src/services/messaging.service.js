const twilio = require("twilio");

function getTwilioClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

async function sendSMS(to, body) {
  if (String(process.env.MOCK_MESSAGING).toLowerCase() === "true") {
    return { sid: "MOCK-SMS", to, body };
  }
  const client = getTwilioClient();
  return client.messages.create({
    to,
    from: process.env.TWILIO_SMS_FROM,
    body,
  });
}

async function sendWhatsApp(toE164, body) {
  const to = toE164.startsWith("whatsapp:") ? toE164 : `whatsapp:${toE164}`;
  if (String(process.env.MOCK_MESSAGING).toLowerCase() === "true") {
    return { sid: "MOCK-WA", to, body };
  }
  const client = getTwilioClient();
  return client.messages.create({
    to,
    from: process.env.TWILIO_WHATSAPP_FROM,
    body,
  });
}

module.exports = { sendSMS, sendWhatsApp };
