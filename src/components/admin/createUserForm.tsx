// src/components/admin/CreateUserForm.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ThemedView } from '@/src/components/themed-view';
import { ThemedText } from '@/src/components/themed-text';
import { useTranslation } from 'react-i18next';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { supabase } from '@/src/services/supabase'; // adjust path

type CreateUserFormProps = {
  role: 'admin' | 'technician';
  onBack: () => void;
};

export default function CreateUserForm({ role, onBack }: CreateUserFormProps) {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminConfirmed, setIsAdminConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation states (shown as red text below fields)
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Simple email validation regex (good enough for most cases)
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    let valid = true;

    // Reset previous errors
    setEmailError('');
    setPasswordError('');

    if (!fullName.trim()) {
      valid = false;
    }

    if (!email.trim()) {
      setEmailError(t('common.emailRequired'));
      valid = false;
    } else if (!isValidEmail(email.trim())) {
      setEmailError(t('common.invalidEmail'));
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError(t('common.passwordRequired'));
      valid = false;
    } else if (password.trim().length < 5) {
      setPasswordError(t('common.passwordMinLength', { min: 5 }));
      valid = false;
    }

    // For admin: checkbox must be checked
    if (role === 'admin' && !isAdminConfirmed) {
      valid = false;
    }

    return valid;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      Alert.alert(t('common.error'), t('common.formIncomplete'));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('admin-create-user', {
        body: {
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          role,
        },
      });

      if (error) throw error;

      Alert.alert(
        t('common.success'),
        `${t('admin.createUser.success')}\n\n${fullName.trim()}\n\n${t('admin.createUser.credentials')}\nEmail: ${email.trim()}\nPassword: ${password}`,
        [{ text: t('common.ok'), onPress: onBack }]
      );

      // Reset form
      setFullName('');
      setEmail('');
      setPassword('');
      setIsAdminConfirmed(false);
      setEmailError('');
      setPasswordError('');
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('admin.createUser.error'));
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = 
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    isValidEmail(email.trim()) &&
    password.trim().length >= 5 &&
    (role === 'technician' || isAdminConfirmed);

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={22} color="#007AFF" />
          <ThemedText style={styles.backText}>{t('common.back')}</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* <ThemedText type="title" style={styles.title}>
          {role === 'admin'
            ? t('admin.createUser.title.admin')
            : t('admin.createUser.title.technician')}
        </ThemedText> */}

        {/* Full Name */}
        <ThemedText style={styles.label}>{t('common.fullName')} *</ThemedText>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder={t('common.enterFullName')}
          autoCapitalize="words"
        />

        {/* Email */}
        <ThemedText style={styles.label}>{t('common.email')} *</ThemedText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="example@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {emailError ? (
          <ThemedText style={styles.errorText}>{emailError}</ThemedText>
        ) : null}

        {/* Password */}
        <ThemedText style={styles.label}>{t('common.password')} *</ThemedText>
        <ThemedText style={styles.passwordInstruction}>({t('common.passwordInstruction')}) </ThemedText>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder={t('common.enterPassword')}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <ThemedText style={styles.errorText}>{passwordError}</ThemedText>
        ) : null}

        {/* Admin confirmation */}
        {role === 'admin' && (
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setIsAdminConfirmed(!isAdminConfirmed)}
          >
            <MaterialIcons
              name={isAdminConfirmed ? 'check-box' : 'check-box-outline-blank'}
              size={28}
              color={isAdminConfirmed ? '#007AFF' : '#666'}
            />
            <ThemedText style={styles.checkboxText}>
              {t('admin.createUser.confirmAdmin')}
            </ThemedText>
          </TouchableOpacity>
        )}
        {/* WARNING */}
        {role === 'admin' && (
          <ThemedText style={styles.warning}>
            {t('admin.createUser.warning.admin')}
          </ThemedText>
        )}
        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { opacity: isFormValid && !loading ? 1 : 0.5 },
          ]}
          disabled={!isFormValid || loading}
          onPress={handleCreate}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={styles.submitText}>
              {t('common.create')}
            </ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

// Add these new styles at the bottom
const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    
    // paddingHorizontal: 16,
  },
  container: { 
    flex: 1,
    // paddingBottom:"10%" 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: "30%", // adjust if needed for safe area
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  warning: {
    color: '#d32f2f',
    fontSize: 16,
    // marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  passwordInstruction:{
    fontSize:14
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  checkboxText: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: "10%",
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
    paddingLeft: 4,
  },
});