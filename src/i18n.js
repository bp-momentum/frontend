import i18n from "i18next";
import { initReactI18next} from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./locales/en/translation.json";

const resources = {
  en: {
    translation: translationEN,
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    }
  }).catch(console.error);

export default i18n;
