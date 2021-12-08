import i18n from "i18next";
import { initReactI18next} from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./locales/en/translation.json";
import translationDE from "./locales/de/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  }
};

const getEnglishArticle = function (value, capitalize) {
  const vowels = ["a", "e", "i", "o", "u", "h"];
  let firstLetter = value.substring(0, 1).toLowerCase();
  let article;
  if (vowels.includes(firstLetter)) {
    article = capitalize ? "An" : "an";
  } else {
    article = capitalize ? "A" : "a";
  }
  return article;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "de",
    debug: true,
    interpolation: {
      escapeValue: false,
      format: function (value, format, lng) {
        if (lng !== "en")
          return value;
        if (!format.startsWith("en-handle-an"))
          return value;
        return getEnglishArticle(value, format.endsWith("capitalized")) + " " + value;
      }
    }
  }).catch(console.error);

export default i18n;
