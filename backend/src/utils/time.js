const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

function nowTz() {
  const tz = process.env.APP_TIMEZONE || "Europe/Zurich";
  return dayjs().tz(tz);
}

function parseDbDateTime(dbDateTimeStr) {
  const tz = process.env.APP_TIMEZONE || "Europe/Zurich";
  // DB stores local DATETIME (no tz). Treat it as tz-local.
  return dayjs.tz(dbDateTimeStr, tz);
}

module.exports = { nowTz, parseDbDateTime };
