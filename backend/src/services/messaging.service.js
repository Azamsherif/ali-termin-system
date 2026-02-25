const twilio = require("twilio");

// Initialize Twilio client with credentials from environment
function getTwilioClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Send SMS via Twilio (or mock if MOCK_MESSAGING=true)
async function sendSMS(to, body) {
  if (String(process.env.MOCK_MESSAGING).toLowerCase() === "true") {
    console.log(`[MOCK SMS] To: ${to}, Message: ${body}`);
    return { sid: "MOCK-SMS", to, body };
  }
  
  const client = getTwilioClient();
  return client.messages.create({
    to,
    from: process.env.TWILIO_SMS_FROM,
    body,
  });
}

// Send WhatsApp message via Twilio (or mock if MOCK_MESSAGING=true)
async function sendWhatsApp(toE164, body) {
  const to = toE164.startsWith("whatsapp:") ? toE164 : `whatsapp:${toE164}`;
  
  if (String(process.env.MOCK_MESSAGING).toLowerCase() === "true") {
    console.log(`[MOCK WhatsApp] To: ${to}, Message: ${body}`);
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
