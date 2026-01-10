import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/src/components/themed-view';
import { ThemedText } from '@/src/components/themed-text';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/services/supabase';

export default function LogoutScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const handleCancel = () => {
    router.replace('/(tabs)/');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        {t('common.confirmLogout')}
      </ThemedText>

      <ThemedText style={styles.message}>
        {t('common.logoutMessage')}
      </ThemedText>

      <ThemedView style={styles.actions}>
        <Pressable style={styles.cancelBtn} onPress={handleCancel}>
          <ThemedText>{t('common.no')}</ThemedText>
        </Pressable>

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <ThemedText style={styles.logoutText}>
            {t('common.yes')}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: 'red',
    fontWeight: '600',
  },
});
