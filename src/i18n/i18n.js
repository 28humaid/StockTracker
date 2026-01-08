import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the separate JSON files
import en from './locales/en.json';
import hi from './locales/hi.json';

// Resources now point to the external files
const resources = {
  en: { translation: en },
  hi: { translation: hi },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default fallback
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    compatibilityJSON: 'v3', // Required for React Native
  });

// Load saved language on app start
export const loadLanguage = async () => {
  try {
    const savedLang = await AsyncStorage.getItem('language');
    if (savedLang && resources[savedLang]) {
      await i18n.changeLanguage(savedLang);
      return savedLang;
    }

    // Fallback to device locale
    const deviceLocale = Localization.locale.split('-')[0];
    if (deviceLocale && resources[deviceLocale]) {
      await i18n.changeLanguage(deviceLocale);
      return deviceLocale;
    }

    // Final fallback
    await i18n.changeLanguage('en');
    return 'en';
  } catch (error) {
    console.warn('Failed to load language:', error);
    await i18n.changeLanguage('en');
    return 'en';
  }
};

export default i18n;