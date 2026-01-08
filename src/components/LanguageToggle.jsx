// src/components/LanguageToggle.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';

const LanguageToggle = () => {
  const { i18n: i18nInstance } = useTranslation();

  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
    // cacheUserLanguage is called automatically by our detector
  };

  const currentLang = i18nInstance.language || 'en';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, currentLang === 'en' && styles.active]}
        onPress={() => changeLanguage('en')}
      >
        <Text style={[styles.text, currentLang === 'en' && styles.activeText]}>
          EN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, currentLang === 'hi' && styles.active]}
        onPress={() => changeLanguage('hi')}
      >
        <Text style={[styles.text, currentLang === 'hi' && styles.activeText]}>
          हिंदी
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40, // Adjust based on your safe area / status bar
    right: 16,
    flexDirection: 'row',
    zIndex: 10,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginLeft: 8,
  },
  active: {
    backgroundColor: '#007AFF',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeText: {
    color: '#fff',
  },
});

export default LanguageToggle;