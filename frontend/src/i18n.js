/**
 * i18n Configuration — react-i18next
 *
 * 🌍 OUTDAR is i18n-ready from day one.
 *    - English (en) is fully populated
 *    - French (fr) and Arabic (ar) have empty templates ready
 *    - Add translations later without touching component code
 */

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import frCommon from "./locales/fr/common.json";
import arCommon from "./locales/ar/common.json";

const resources = {
  en: {
    common: enCommon,
  },
  fr: {
    common: frCommon,
  },
  ar: {
    common: arCommon,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "outdar_lang",
    },
  });

// RTL support for Arabic
i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});

export default i18n;
