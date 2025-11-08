import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        common: require('./locales/en/common.json'),
        auth: require('./locales/en/auth.json'),
        profile: require('./locales/en/profile.json'),
    },
    es: {
        common: require('./locales/es/common.json'),
        auth: require('./locales/es/auth.json'),
        profile: require('./locales/es/profile.json'),
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: Localization.getLocales()[0]?.languageCode || 'en', // Detecta el idioma del dispositivo
        fallbackLng: 'en',
        defaultNS: 'common', // Namespace por defecto
        interpolation: { escapeValue: false },
    });

export default i18n;