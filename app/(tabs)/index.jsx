// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { ThemedView } from '@/src/components/themed-view';
import { ThemedText } from '@/src/components/themed-text';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { supabase } from '@/src/services/supabase';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();
  
  const [userData, setUserData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session?.user) {
          setErrorMsg(t('auth.noActiveSession'));
          return;
        }

        // Fetch profile (role + full_name)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        if (!profile) {
          setErrorMsg(t('profile.notFound'));
          return;
        }

        setUserData({
          fullName: profile.full_name || t('common.guest'),
          role: profile.role,
        });
      } catch (err) {
        console.error('Profile fetch failed:', err);
        setErrorMsg(err.message || t('common.unexpectedError'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={{ marginTop: 16 }}>
          {t('common.loading')}
        </ThemedText>
      </ThemedView>
    );
  }

  if (errorMsg) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ color: 'red' }}>
          {t('common.error')}
        </ThemedText>
        <ThemedText style={{ marginTop: 12, textAlign: 'center' }}>
          {errorMsg}
        </ThemedText>
      </ThemedView>
    );
  }

  if (!userData?.role) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>{t('profile.noRoleAssigned')}</ThemedText>
      </ThemedView>
    );
  }

  const isAdmin = userData.role === 'admin';
  const roleDisplay = isAdmin ? t('roles.admin') : t('roles.technician');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.welcomeContainer}>
        <ThemedText type="title" style={styles.welcomeText}>
          {t('common.welcome')}
        </ThemedText>
        <ThemedText type="title" style={styles.welcomeText}>
          {userData.fullName}!
        </ThemedText>

        <ThemedText style={styles.roleText}>
          {t('auth.loggedInAs')}: <ThemedText type="defaultSemiBold">{roleDisplay}</ThemedText>
        </ThemedText>
      </View>

      {/* Dashboard content placeholder */}
      {isAdmin ? (
        <ThemedText style={styles.info}>
          {t('dashboard.admin.welcomeMessage')}
        </ThemedText>
      ) : (
        <ThemedText style={styles.info}>
          {t('dashboard.technician.welcomeMessage')}
        </ThemedText>
      )}
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
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 32,
    textAlign:'center',
    marginBottom: 8,
  },
  roleText: {
    fontSize: 18,
    opacity: 0.8,
  },
  info: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 12,
  },
});