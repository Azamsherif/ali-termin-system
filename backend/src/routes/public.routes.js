const express = require("express");
const { getPool } = require("../config/db");
const { getTranslation } = require("../services/translation.service");

const router = express.Router();

// GET / - Welcome endpoint
router.get("/", (req, res) => {
  res.json({
    name: "Ali Termin System API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      appointments: "/api/appointments",
      messages: "/api/messages",
      cancel: "/cancel/:id"
    }
  });
});

// GET /cancel/:id - Public appointment cancellation endpoint
router.get("/cancel/:id", async (req, res) => {
  const pool = getPool();
  const id = Number(req.params.id);

  // Fetch appointment with company info
  const [rows] = await pool.execute(
    `SELECT a.*, u.company_name 
     FROM appointments a 
     JOIN users u ON u.id=a.user_id
     WHERE a.id=:id LIMIT 1`,
    { id }
  );

  if (!rows.length) return res.status(404).send("Not found");

  const appt = rows[0];
  const lang = appt.client_language || "de";
  const tr = getTranslation(lang);

  // Check if already cancelled
  if (appt.status === "cancelled") {
    return res.send(tr.cancel_already);
  }

  // Cancel appointment
  await pool.execute("UPDATE appointments SET status='cancelled' WHERE id=:id", { id });
  return res.send(tr.cancel_success);
});

module.exports = router;
