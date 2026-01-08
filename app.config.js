// app.config.js
import 'dotenv/config'; // This loads your .env file into process.env

export default {
  expo: {
    name: 'StockTrackPro',
    slug: 'StockTrackPro',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'stocktrackpro',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      'expo-barcode-scanner',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    // THIS IS THE IMPORTANT PART — exposes env variables to the app
    extra: {
      PROJECT_URL: process.env.PROJECT_URL,
      KEY: process.env.KEY,
    },
  },
};