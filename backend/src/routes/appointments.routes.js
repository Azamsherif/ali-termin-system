const express = require("express");
const { z } = require("zod");
const auth = require("../middleware/auth");
const { getPool } = require("../config/db");

const router = express.Router();
router.use(auth);

const AppointmentCreate = z.object({
  client_name: z.string().min(1),
  phone: z.string().min(5),
  client_language: z.enum(["de","fr","it"]).default("de"),
  appointment_datetime: z.string().min(10), // "YYYY-MM-DD HH:mm:ss" or ISO string
});

router.post("/", async (req, res) => {
  const parsed = AppointmentCreate.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });

  const pool = getPool();
  const { client_name, phone, client_language, appointment_datetime } = parsed.data;

  const [result] = await pool.execute(
    `INSERT INTO appointments (user_id, client_name, phone, client_language, appointment_datetime)
     VALUES (:user_id, :client_name, :phone, :client_language, :appointment_datetime)`,
    {
      user_id: req.user.id,
      client_name,
      phone,
      client_language,
      appointment_datetime: appointment_datetime.replace("T"," ").slice(0,19),
    }
  );

  res.json({ message: "Created", id: result.insertId });
});

router.get("/", async (req, res) => {
  const { from, to, status } = req.query;
  const pool = getPool();

  let sql = "SELECT * FROM appointments WHERE user_id=:user_id";
  const params = { user_id: req.user.id };

  if (status) {
    sql += " AND status=:status";
    params.status = status;
  }
  if (from && to) {
    sql += " AND appointment_datetime BETWEEN :from AND :to";
    params.from = String(from).slice(0,19);
    params.to = String(to).slice(0,19);
  }

  sql += " ORDER BY appointment_datetime DESC LIMIT 500";

  const [rows] = await pool.execute(sql, params);
  res.json(rows);
});

const AppointmentUpdate = z.object({
  client_name: z.string().min(1).optional(),
  phone: z.string().min(5).optional(),
  client_language: z.enum(["de","fr","it"]).optional(),
  appointment_datetime: z.string().min(10).optional(),
  status: z.enum(["confirmed","cancelled"]).optional(),
});

router.put("/:id", async (req, res) => {
  const parsed = AppointmentUpdate.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const pool = getPool();
  const id = Number(req.params.id);
  const updates = parsed.data;

  const fields = [];
  const params = { id, user_id: req.user.id };

  for (const [k,v] of Object.entries(updates)) {
    fields.push(`${k}=:${k}`);
    params[k] = k === "appointment_datetime" ? String(v).replace("T"," ").slice(0,19) : v;
  }
  if (!fields.length) return res.json({ message: "No changes" });

  await pool.execute(
    `UPDATE appointments SET ${fields.join(", ")} WHERE id=:id AND user_id=:user_id`,
    params
  );
  res.json({ message: "Updated" });
});

router.delete("/:id", async (req, res) => {
  const pool = getPool();
  const id = Number(req.params.id);
  await pool.execute("DELETE FROM appointments WHERE id=:id AND user_id=:user_id", { id, user_id: req.user.id });
  res.json({ message: "Deleted" });
});

module.exports = router;
