import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '../i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageToggle = () => {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    AsyncStorage.setItem('language', lng);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, i18n.language === 'en' ? styles.active : null]}
        onPress={() => changeLanguage('en')}
      >
        <Text style={styles.text}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, i18n.language === 'hi' ? styles.active : null]}
        onPress={() => changeLanguage('hi')}
      >
        <Text style={styles.text}>हिंदी</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', position: 'absolute', top: 10, right: 10 },
  button: { padding: 10, borderRadius: 5, marginLeft: 5 },
  active: { backgroundColor: '#007AFF' },
  text: { color: '#FFF', fontSize: 16 },
});

export default LanguageToggle;