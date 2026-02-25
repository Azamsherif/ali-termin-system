import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";

const resources = {
  de: { translation: de },
  fr: { translation: fr },
  it: { translation: it },
};

// Load saved language or default to German
const saved = localStorage.getItem("lang") || "de";

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: saved,
  fallbackLng: "de",
  interpolation: { escapeValue: false },
});

export default i18n;
