import Constants from 'expo-constants';

interface EnvConfig {
    API_BASE_URL: string;
}

/**
 * Configuración de variables de entorno para Expo
 * Lee desde expo-constants.extra que se configura en app.config.js
 */
const getEnvVars = (): EnvConfig => {
    // expo-constants lee el 'extra' de app.config.js
    const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:8080';

    return {
        API_BASE_URL: apiBaseUrl,
    };
};

export default getEnvVars();