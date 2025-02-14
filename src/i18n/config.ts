import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from './eng/localisation.json';
import ukTranslation from './ukr/localisation.json';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      uk: { translation: ukTranslation }
    },
    lng: 'uk', // Початкова мова
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;