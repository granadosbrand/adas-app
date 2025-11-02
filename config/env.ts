import Constants from 'expo-constants';

interface EnvConfig {
    API_BASE_URL: string;
}

const getEnvVars = (): EnvConfig => {
    // Expo Constants lee del .env automáticamente en desarrollo
    const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL ||
        process.env.API_BASE_URL ||
        'http://localhost:3000';

    return {
        API_BASE_URL: apiBaseUrl,
    };
};

export default getEnvVars();
