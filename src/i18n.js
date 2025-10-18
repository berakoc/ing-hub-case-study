import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const i18nInit = i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: 'en',
    supportedLngs: ['en', 'tr'],

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    ns: ['translations'],
    defaultNS: 'translations',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
