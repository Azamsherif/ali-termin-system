const express = require("express");
const { getPool } = require("../config/db");
const { getTranslation } = require("../services/translation.service");

const router = express.Router();

router.get("/cancel/:id", async (req, res) => {
  const pool = getPool();
  const id = Number(req.params.id);

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

  if (appt.status === "cancelled") {
    return res.send(tr.cancel_already);
  }

  await pool.execute("UPDATE appointments SET status='cancelled' WHERE id=:id", { id });
  return res.send(tr.cancel_success);
});

module.exports = router;
