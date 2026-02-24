require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const appointmentsRoutes = require("./routes/appointments.routes");
const messagesRoutes = require("./routes/messages.routes");
const publicRoutes = require("./routes/public.routes");

const { startReminderCron } = require("./cron/reminder.cron");
const { startRetryCron } = require("./cron/retry.cron");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => res.json({ ok: true, name: "Ali Termin System API" }));

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/messages", messagesRoutes);

app.use("/", publicRoutes);

startReminderCron();
startRetryCron();

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
  console.log(`Timezone: ${process.env.APP_TIMEZONE || "Europe/Zurich"}`);
  console.log(`MOCK_MESSAGING: ${process.env.MOCK_MESSAGING}`);
});
