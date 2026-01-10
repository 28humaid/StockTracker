// app/(auth)/login.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '@/src/services/supabase';
import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import LanguageToggle from '@/src/components/LanguageToggle';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
  const { data, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !data.session?.user) {
    return;
  }

  await handleSuccessfulLogin(data.session.user.id);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(t('login.error.invalid'));
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      // console.error('Supabase login error:', error);
      // console.log('Error message:', error.message);
      // console.log('Error status:', error.status);
      let message = t('login.error.generic');
      if (error.message.includes('Invalid login credentials')) {
        message = t('login.error.invalid');
      } else if (error.message.includes('network')) {
        message = t('login.error.network');
      }
      Alert.alert(message);
      return;
    }

    if (data.user) {
      await handleSuccessfulLogin(data.user.id);
    }
  };

  const handleSuccessfulLogin = async (userId) => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      Alert.alert('Profile error. Contact admin.');
      await supabase.auth.signOut();
      return;
    }

    if (!profile?.role) {
      console.log('No role found for user:', userId);
      Alert.alert('No role assigned. Contact admin.');
      await supabase.auth.signOut();
      return;
    }
    router.replace('/(tabs)/');
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LanguageToggle />

        <View style={styles.formContainer}>
          <ThemedText type="title" style={styles.title}>
            StockTrack Pro
          </ThemedText>

          {/* Email Field */}
          <TextInput
            style={[
              styles.input,
              { borderColor: theme === 'light' ? '#ccc' : '#444' },
            ]}
            placeholder={t('login.emailPlaceholder')}
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          {/* Password Field with Eye Icon */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.passwordInput,
                { borderColor: theme === 'light' ? '#ccc' : '#444' },
              ]}
              placeholder={t('login.passwordPlaceholder')}
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={toggleShowPassword}
              disabled={loading}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={28}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.loginButtonText}>
                {t('login.loginButton')}
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    marginBottom: 60,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#000',
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  passwordInput: {
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 56, // Space for icon
    fontSize: 18,
    backgroundColor: '#fff',
    color: '#000',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 8,
    padding: 8,
  },
  loginButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#999',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});