const cron = require("node-cron");
const { getPool } = require("../config/db");
const { sendSMS, sendWhatsApp } = require("../services/messaging.service");
const { nowTz } = require("../utils/time");

async function runOnce() {
  const pool = getPool();
  const now = nowTz();

  const [rows] = await pool.execute(
    `SELECT * FROM message_logs 
     WHERE status='failed' 
       AND (next_retry_at IS NULL OR next_retry_at <= :now)
       AND attempts < 5
     ORDER BY created_at ASC
     LIMIT 50`,
    { now: now.format("YYYY-MM-DD HH:mm:ss") }
  );

  for (const msg of rows) {
    try {
      let resp;
      if (msg.channel === "whatsapp") resp = await sendWhatsApp(msg.phone, msg.message);
      else resp = await sendSMS(msg.phone, msg.message);

      await pool.execute(
        `UPDATE message_logs 
         SET status='sent', provider_id=:provider_id, error_text=NULL, attempts=attempts+1, next_retry_at=NULL
         WHERE id=:id`,
        { id: msg.id, provider_id: resp.sid }
      );
    } catch (e) {
      const attempts = (msg.attempts || 0) + 1;
      const next = now.add(15, "minute").format("YYYY-MM-DD HH:mm:ss");
      await pool.execute(
        `UPDATE message_logs 
         SET error_text=:err, attempts=:attempts, next_retry_at=:next_retry_at
         WHERE id=:id`,
        { id: msg.id, err: String(e?.message || e), attempts, next_retry_at: next }
      );
    }
  }
}

function startRetryCron() {
  cron.schedule("*/15 * * * *", () => {
    runOnce().catch((e) => console.error("retry.cron error:", e));
  });
}

module.exports = { startRetryCron, runOnce };
