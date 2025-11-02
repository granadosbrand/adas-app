const API_BASE_URL = process.env.API_BASE_URL || 'http://10.0.2.2:3000';
// Package / bundle identifiers required by `expo prebuild`.
// Prefer setting these via environment variables for CI/builds.
const ANDROID_PACKAGE = process.env.ANDROID_PACKAGE || process.env.EXPO_ANDROID_PACKAGE || 'com.anonymous.navigationapp';
const IOS_BUNDLE = process.env.IOS_BUNDLE_IDENTIFIER || process.env.EXPO_IOS_BUNDLE_IDENTIFIER || 'com.anonymous.navigationapp';

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
      supportsTablet: true,
      // Bundle identifier used when prebuilding iOS native project
      bundleIdentifier: IOS_BUNDLE,
    },
    android: {
      // Package name used when prebuilding Android native project
      package: ANDROID_PACKAGE,
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
      // También exponemos los ids por si los necesitas en JS (opcional)
      ANDROID_PACKAGE: ANDROID_PACKAGE,
      IOS_BUNDLE_IDENTIFIER: IOS_BUNDLE,
      // En producción podrías tener:
      // API_BASE_URL: process.env.API_BASE_URL,
      // ENVIRONMENT: process.env.NODE_ENV || 'development',
    }
  }
};