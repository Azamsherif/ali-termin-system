const cron = require("node-cron");
const { getPool } = require("../config/db");
const { getTranslation, render } = require("../services/translation.service");
const { sendSMS, sendWhatsApp } = require("../services/messaging.service");
const { nowTz, parseDbDateTime } = require("../utils/time");

function buildCancelLink(appointmentId) {
  const base = process.env.PUBLIC_BASE_URL || "http://localhost:5000";
  return `${base.replace(/\/$/, "")}/cancel/${appointmentId}`;
}

async function logMessage({ userId, appointmentId, channel, messageType, phone, message, status, providerId, errorText, attempts, nextRetryAt }) {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO message_logs 
      (user_id, appointment_id, channel, message_type, phone, message, status, provider_id, error_text, attempts, next_retry_at)
     VALUES 
      (:user_id, :appointment_id, :channel, :message_type, :phone, :message, :status, :provider_id, :error_text, :attempts, :next_retry_at)`,
    {
      user_id: userId,
      appointment_id: appointmentId,
      channel,
      message_type: messageType,
      phone,
      message,
      status,
      provider_id: providerId || null,
      error_text: errorText || null,
      attempts: attempts ?? 0,
      next_retry_at: nextRetryAt || null,
    }
  );
}

async function runOnce() {
  const pool = getPool();
  const now = nowTz();

  const [rows] = await pool.execute(
    `SELECT 
        a.*, 
        u.company_name, 
        u.whatsapp_enabled,
        u.sms_quota
     FROM appointments a
     JOIN users u ON u.id = a.user_id
     WHERE a.status='confirmed'`
  );

  for (const appt of rows) {
    const apptTime = parseDbDateTime(appt.appointment_datetime);
    const diffHours = apptTime.diff(now, "hour", true);
    const lang = appt.client_language || "de";
    const tr = getTranslation(lang);

    const timeHHmm = apptTime.format("HH:mm");
    const cancelText = `Absagen: ${buildCancelLink(appt.id)}`;
    const msg24 = render(tr.reminder_24, { time: timeHHmm, company: appt.company_name, cancel: cancelText });
    const msg2 = render(tr.reminder_2, { time: timeHHmm, company: appt.company_name, cancel: "" });

    // 24h window: (23, 24]
    if (!appt.reminder_24_sent && diffHours <= 24 && diffHours > 23) {
      try {
        if (appt.sms_quota <= 0) throw new Error("SMS quota exceeded");
        const resp = await sendSMS(appt.phone, msg24);
        await pool.execute("UPDATE appointments SET reminder_24_sent=1 WHERE id=:id AND user_id=:user_id", { id: appt.id, user_id: appt.user_id });
        await pool.execute("UPDATE users SET sms_quota = GREATEST(sms_quota - 1, 0) WHERE id=:id", { id: appt.user_id });

        await logMessage({
          userId: appt.user_id,
          appointmentId: appt.id,
          channel: "sms",
          messageType: "reminder_24",
          phone: appt.phone,
          message: msg24,
          status: "sent",
          providerId: resp.sid,
          attempts: 1,
        });
      } catch (e) {
        await logMessage({
          userId: appt.user_id,
          appointmentId: appt.id,
          channel: "sms",
          messageType: "reminder_24",
          phone: appt.phone,
          message: msg24,
          status: "failed",
          errorText: String(e?.message || e),
          attempts: 1,
          nextRetryAt: now.add(15, "minute").format("YYYY-MM-DD HH:mm:ss"),
        });
      }
    }

    // 2h window: (1.5, 2]
    if (!appt.reminder_2_sent && diffHours <= 2 && diffHours > 1.5) {
      try {
        if (appt.sms_quota <= 0) throw new Error("SMS quota exceeded");
        const resp = await sendSMS(appt.phone, msg2);
        await pool.execute("UPDATE appointments SET reminder_2_sent=1 WHERE id=:id AND user_id=:user_id", { id: appt.id, user_id: appt.user_id });
        await pool.execute("UPDATE users SET sms_quota = GREATEST(sms_quota - 1, 0) WHERE id=:id", { id: appt.user_id });

        await logMessage({
          userId: appt.user_id,
          appointmentId: appt.id,
          channel: "sms",
          messageType: "reminder_2",
          phone: appt.phone,
          message: msg2,
          status: "sent",
          providerId: resp.sid,
          attempts: 1,
        });
      } catch (e) {
        await logMessage({
          userId: appt.user_id,
          appointmentId: appt.id,
          channel: "sms",
          messageType: "reminder_2",
          phone: appt.phone,
          message: msg2,
          status: "failed",
          errorText: String(e?.message || e),
          attempts: 1,
          nextRetryAt: now.add(15, "minute").format("YYYY-MM-DD HH:mm:ss"),
        });
      }
    }

    // Optional: WhatsApp (if enabled) - example: send only 24h reminder on WhatsApp too
    if (appt.whatsapp_enabled && !appt.whatsapp_sent && diffHours <= 24 && diffHours > 23) {
      try {
        const resp = await sendWhatsApp(appt.phone, msg24);
        await pool.execute("UPDATE appointments SET whatsapp_sent=1 WHERE id=:id AND user_id=:user_id", { id: appt.id, user_id: appt.user_id });

        await logMessage({
          userId: appt.user_id,
          appointmentId: appt.id,
          channel: "whatsapp",
          messageType: "reminder_24",
          phone: appt.phone,
          message: msg24,
          status: "sent",
          providerId: resp.sid,
          attempts: 1,
        });
      } catch (e) {
        await logMessage({
          userId: appt.user_id,
          appointmentId: appt.id,
          channel: "whatsapp",
          messageType: "reminder_24",
          phone: appt.phone,
          message: msg24,
          status: "failed",
          errorText: String(e?.message || e),
          attempts: 1,
          nextRetryAt: now.add(15, "minute").format("YYYY-MM-DD HH:mm:ss"),
        });
      }
    }
  }
}

function startReminderCron() {
  // Every 5 minutes
  cron.schedule("*/5 * * * *", () => {
    runOnce().catch((e) => console.error("reminder.cron error:", e));
  });
}

module.exports = { startReminderCron, runOnce };
