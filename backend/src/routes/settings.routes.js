const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { sendSMS, sendWhatsApp } = require("../services/messaging.service");

// All routes require authentication
router.use(auth);

// POST /api/settings/test-sms - Send test SMS
router.post("/test-sms", async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    // Send test message
    const message = "🎉 Twilio Test erfolgreich! Ihre SMS-Integration funktioniert.";
    const result = await sendSMS(phone, message);
    
    console.log(`✅ Test SMS sent to ${phone}:`, result);
    
    res.json({
      success: true,
      message: `Test SMS erfolgreich gesendet an ${phone}!`,
      messageId: result.sid || result.id,
    });
  } catch (error) {
    console.error("❌ Test SMS error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Fehler beim SMS-Versand",
    });
  }
});

// POST /api/settings/test-whatsapp - Send test WhatsApp
router.post("/test-whatsapp", async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    // Send test WhatsApp message
    const message = "🎉 Twilio WhatsApp Test erfolgreich! Ihre Integration funktioniert.";
    const result = await sendWhatsApp(phone, message);
    
    console.log(`✅ Test WhatsApp sent to ${phone}:`, result);
    
    res.json({
      success: true,
      message: `Test WhatsApp erfolgreich gesendet an ${phone}!`,
      messageId: result.sid || result.id,
    });
  } catch (error) {
    console.error("❌ Test WhatsApp error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Fehler beim WhatsApp-Versand",
    });
  }
});

module.exports = router;
