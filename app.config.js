// Lee variables de entorno desde .env
// Este es el approach recomendado por Expo
const API_BASE_URL = process.env.API_BASE_URL || 'http://10.0.2.2:3000';

export default {
  expo: {
    name: "navigation-app",
    slug: "navigation-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "navigationapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-build-properties",
      "expo-font",
      "expo-web-browser"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // Exponemos variables de entorno a través de expo-constants
      API_BASE_URL: API_BASE_URL,
      // En producción podrías tener:
      // API_BASE_URL: process.env.API_BASE_URL,
      // ENVIRONMENT: process.env.NODE_ENV || 'development',
    }
  }
};