// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';

import i18n, { loadLanguage } from '@/src/i18n/i18n';
import { supabase } from '@/src/services/supabase'; // adjust path
import { useColorScheme } from '@/hooks/use-color-scheme';
import LanguageToggle from '@/src/components/LanguageToggle';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadLanguage();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const inAuthGroup = segments[0] === '(auth)';

        if (session && inAuthGroup) {
          router.replace('/(tabs)');
        } else if (!session && !inAuthGroup) {
          router.replace('/(auth)/login');
        }
      }
    );

    supabase.auth.getSession().then(({ data, error }) => {
  // console.log('Layout getSession:', { data, error });

  if (error) {
    console.error('Layout session error:', error);
    return;
  }

  const session = data.session;

  const inAuthGroup = segments[0] === '(auth)';
  if (!session && !inAuthGroup) {
    router.replace('/(auth)/login');
  } else if (session && inAuthGroup) {
    router.replace('/(tabs)');
  }
});

    return () => listener.subscription.unsubscribe();
  }, [segments]);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
        <LanguageToggle />
      </ThemeProvider>
    </I18nextProvider>
  );
}