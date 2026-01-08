import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// English translations
const en = {
  translation: {
    login: 'Login',
    email: 'Email',
    password: 'Password',
    // Add more as we build (buttons, labels, etc.)
  },
};

// Hindi translations (natural + transliterated)
const hi = {
  translation: {
    login: 'लॉगिन',
    email: 'ईमेल',
    password: 'पासवर्ड',
    // Examples: camera: 'कैमरा', wire: 'वायर'
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources: { en, hi },
    lng: 'en', // Default English
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

// Load saved language
AsyncStorage.getItem('language').then((lang) => {
  if (lang) i18n.changeLanguage(lang);
});

export default i18n;