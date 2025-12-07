import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../public/locales/en/translation.json";
import ru from "../public/locales/ru/translation.json";
import uz from "../public/locales/uz/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uz: { translation: uz },
    },
  });

export default i18n;
