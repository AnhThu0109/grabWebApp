// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Function to dynamically import language files
const importAll = (r) => r.keys().map(r);
const locales = importAll(require.context("./locales", false, /\.json$/));

const resources = locales.reduce((acc, file) => {
  const langKey = file.languageKey; // Extract language key from the file
  acc[langKey] = { translation: file };
  return acc;
}, {});

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

export default i18n;
