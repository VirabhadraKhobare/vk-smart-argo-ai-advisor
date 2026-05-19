import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonEn from "./locales/common_en.json";

const supportedLanguages = [
  "en",
  "hi",
  "mr",
  "kn",
  "ta",
  "te",
  "ml",
  "gu",
  "pa",
  "bn",
  "or",
  "ur",
  "as",
  "kok",
  "sa",
  "mni",
  "ne",
  "bho",
  "hry",
  "raj",
];

const sharedResources = {
  common: commonEn,
  translation: commonEn,
};

const resources = supportedLanguages.reduce((accumulator, languageCode) => {
  accumulator[languageCode] = sharedResources;
  return accumulator;
}, {});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    defaultNS: "translation",
    ns: ["translation", "common"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
