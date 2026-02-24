const fs = require("fs");
const path = require("path");

const cache = new Map();

function getTranslation(lang) {
  const safe = (lang || "de").toLowerCase();
  const key = ["de", "fr", "it"].includes(safe) ? safe : "de";

  if (cache.has(key)) return cache.get(key);

  const filePath = path.join(__dirname, "..", "locales", `${key}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  cache.set(key, data);
  return data;
}

function render(template, vars) {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{{${k}}}`, String(v ?? ""));
  }
  return out.replaceAll("  ", " ").trim();
}

module.exports = { getTranslation, render };
