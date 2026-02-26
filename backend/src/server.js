require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth.routes");
const appointmentsRoutes = require("./routes/appointments.routes");
const messagesRoutes = require("./routes/messages.routes");
const settingsRoutes = require("./routes/settings.routes");
const publicRoutes = require("./routes/public.routes");

// Import cron jobs
const { startReminderCron } = require("./cron/reminder.cron");
const { startRetryCron } = require("./cron/retry.cron");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health check endpoint
app.get("/health", (req, res) => res.json({ ok: true, name: "Ali Termin System API" }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/settings", settingsRoutes);

// Public routes (appointment cancellation)
app.use("/", publicRoutes);

// Start cron jobs for automated reminders and retries
startReminderCron();
startRetryCron();

// Start server
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`✅ API running on http://localhost:${port}`);
  console.log(`⏰ Timezone: ${process.env.APP_TIMEZONE || "Europe/Zurich"}`);
  console.log(`📧 Mock messaging: ${process.env.MOCK_MESSAGING}`);
});
