const express = require("express");
const ExcelJS = require("exceljs");
const auth = require("../middleware/auth");
const { getPool } = require("../config/db");
const { sendSMS, sendWhatsApp } = require("../services/messaging.service");

const router = express.Router();
router.use(auth);

router.get("/", async (req, res) => {
  const { status, channel } = req.query;
  const pool = getPool();

  let sql = "SELECT * FROM message_logs WHERE user_id=:user_id";
  const params = { user_id: req.user.id };

  if (status) { sql += " AND status=:status"; params.status = status; }
  if (channel) { sql += " AND channel=:channel"; params.channel = channel; }

  sql += " ORDER BY created_at DESC LIMIT 1000";

  const [rows] = await pool.execute(sql, params);
  res.json(rows);
});

router.post("/resend/:id", async (req, res) => {
  const pool = getPool();
  const id = Number(req.params.id);

  const [rows] = await pool.execute(
    "SELECT * FROM message_logs WHERE id=:id AND user_id=:user_id LIMIT 1",
    { id, user_id: req.user.id }
  );
  if (!rows.length) return res.status(404).json({ message: "Not found" });

  const msg = rows[0];

  try {
    const resp = msg.channel === "whatsapp"
      ? await sendWhatsApp(msg.phone, msg.message)
      : await sendSMS(msg.phone, msg.message);

    await pool.execute(
      "UPDATE message_logs SET status='sent', provider_id=:provider_id, error_text=NULL, attempts=attempts+1, next_retry_at=NULL WHERE id=:id",
      { id, provider_id: resp.sid }
    );
    res.json({ message: "Resent" });
  } catch (e) {
    await pool.execute(
      "UPDATE message_logs SET status='failed', error_text=:err, attempts=attempts+1, next_retry_at=DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE id=:id",
      { id, err: String(e?.message || e) }
    );
    res.status(500).json({ message: "Resend failed" });
  }
});

router.get("/export/appointments", async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM appointments WHERE user_id=:user_id ORDER BY appointment_datetime DESC",
    { user_id: req.user.id }
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Appointments");

  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Client", key: "client_name", width: 25 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Language", key: "client_language", width: 10 },
    { header: "DateTime", key: "appointment_datetime", width: 22 },
    { header: "Status", key: "status", width: 12 },
    { header: "24h Sent", key: "reminder_24_sent", width: 10 },
    { header: "2h Sent", key: "reminder_2_sent", width: 10 },
    { header: "Created", key: "created_at", width: 22 },
  ];

  rows.forEach(r => sheet.addRow(r));

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=appointments.xlsx");
  await workbook.xlsx.write(res);
  res.end();
});

router.get("/export/messages", async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM message_logs WHERE user_id=:user_id ORDER BY created_at DESC",
    { user_id: req.user.id }
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Messages");

  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Channel", key: "channel", width: 10 },
    { header: "Type", key: "message_type", width: 14 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Status", key: "status", width: 10 },
    { header: "Attempts", key: "attempts", width: 10 },
    { header: "Provider ID", key: "provider_id", width: 22 },
    { header: "Next Retry", key: "next_retry_at", width: 22 },
    { header: "Created", key: "created_at", width: 22 },
    { header: "Message", key: "message", width: 80 },
    { header: "Error", key: "error_text", width: 40 },
  ];

  rows.forEach(r => sheet.addRow(r));

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=messages.xlsx");
  await workbook.xlsx.write(res);
  res.end();
});

module.exports = router;
