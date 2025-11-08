import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        common: require('./locales/en/common.json'),
        auth: require('./locales/en/auth.json'),
        profile: require('./locales/en/profile.json'),
        home: require('./locales/en/home.json'),
        advances: require('./locales/en/advances.json'),
        drawer: require('./locales/en/drawer.json'),
        historial: require('./locales/en/historial.json'),
        asistente: require('./locales/en/asistente.json'),
        relapseModal: require('./locales/en/relapseModal.json'),
        logout: require('./locales/en/logout.json'),
    },
    es: {
        common: require('./locales/es/common.json'),
        auth: require('./locales/es/auth.json'),
        profile: require('./locales/es/profile.json'),
        home: require('./locales/es/home.json'),
        advances: require('./locales/es/advances.json'),
        drawer: require('./locales/es/drawer.json'),
        historial: require('./locales/es/historial.json'),
        asistente: require('./locales/es/asistente.json'),
        relapseModal: require('./locales/es/relapseModal.json'),
        logout: require('./locales/es/logout.json'),
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