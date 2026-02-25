const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

// Get current time in app timezone (default: Europe/Zurich)
function nowTz() {
  const tz = process.env.APP_TIMEZONE || "Europe/Zurich";
  return dayjs().tz(tz);
}

// Parse datetime string from database as timezone-aware
function parseDbDateTime(dbDateTimeStr) {
  const tz = process.env.APP_TIMEZONE || "Europe/Zurich";
  // DB stores local DATETIME (no timezone), treat as timezone-local
  return dayjs.tz(dbDateTimeStr, tz);
}

module.exports = { nowTz, parseDbDateTime };
