import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated'; // Required for animations
import i18n, { loadLanguage } from '../src/i18n/i18n'; // ← Import i18n and load function
import LanguageToggle from '../src/components/LanguageToggle';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react'; // ← Add for language loading

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load saved/device language on app start
  useEffect(() => {
    loadLanguage();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
        <LanguageToggle/>
      </ThemeProvider>
    </I18nextProvider>
  );
}