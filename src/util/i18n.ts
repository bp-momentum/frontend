import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "../locales/en/translation.json";
import translationDE from "../locales/de/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
};

const indefiniteArticle = function (phrase: string) {
  // Getting the first word
  const match = /\w+/.exec(phrase);
  if (!match) return "an";
  const word = match[0];
  const l_word = word.toLowerCase();

  // Specific start of words that should be preceded by 'an'
  const alt_cases = ["honest", "hour", "hono"];
  for (const i in alt_cases) {
    if (l_word.indexOf(alt_cases[i]) === 0) return "an";
  }

  // Single letter word which should be preceded by 'an'
  if (l_word.length === 1) {
    if ("aedhilmnorsx".indexOf(l_word) >= 0) return "an";
    else return "a";
  }

  // Capital words which should likely be preceded by 'an'
  if (
    word.match(
      /(?!FJO|[HLMNS]Y.|RY[EO]|SQU|(F[LR]?|[HL]|MN?|N|RH?|S[CHKLMNPTVW]?|X(YL)?)[AEIOU])[FHLMNRSX][A-Z]/
    )
  ) {
    return "an";
  }

  // Special cases where a word that begins with a vowel should be preceded by 'a'
  const regexes = [
    /^e[uw]/,
    /^onc?e\b/,
    /^uni([^nmd]|mo)/,
    /^u[bcfhjkqrst][aeiou]/,
  ];
  for (const i in regexes) {
    if (l_word.match(regexes[i])) return "a";
  }

  // Special capital words (UK, UN)
  if (word.match(/^U[NK][AIEO]/)) {
    return "a";
  } else if (word === word.toUpperCase()) {
    if ("aedhilmnorsx".indexOf(l_word[0]) >= 0) return "an";
    else return "a";
  }

  // Basic method of words that begin with a vowel being preceded by 'an'
  if ("aeiou".indexOf(l_word[0]) >= 0) return "an";

  // Instances where y followed by specific letters is preceded by 'an'
  if (l_word.match(/^y(b[lor]|cl[ea]|fere|gg|p[ios]|rou|tt)/)) return "an";

  return "a";
};

const getEnglishArticle = function (value: string, capitalize: boolean) {
  const article = indefiniteArticle(value);
  if (article.length === 1) {
    return capitalize ? article.toUpperCase() : article;
  }
  return capitalize
    ? article.substring(0, 1).toUpperCase() + article.substring(1)
    : article;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "de",
    debug: false,
    interpolation: {
      escapeValue: false,
      format: function (value, format, lng) {
        if (format === undefined) return;
        if (lng !== "en") return value;
        if (!format.startsWith("en-handle-an")) return value;
        return (
          getEnglishArticle(value, format.endsWith("capitalized")) + " " + value
        );
      },
    },
  })
  .catch(console.error);

export default i18n;
