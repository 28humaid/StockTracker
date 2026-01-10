// src/components/admin/AddUser.tsx
import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/src/components/themed-view';
import { ThemedText } from '@/src/components/themed-text';
import { useTranslation } from 'react-i18next';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import CreateUserForm from './createUserForm'


export default function AddUser({ onBack }) {
  const { t } = useTranslation();
  const [view, setView] = useState('buttons');
  const [selectedRole, setSelectedRole] = useState(null);

  if (view === 'form' && selectedRole) {
    return (
      <CreateUserForm
        role={selectedRole}
        onBack={() => {
          setView('buttons');
          setSelectedRole(null);
        }}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={22} color="#007AFF" />
          <ThemedText style={styles.backText}>{t('common.back')}</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* <ThemedText type="title" style={styles.title}>
          {t('admin.userManagement.title')}
        </ThemedText> */}

        <TouchableOpacity
          style={styles.bigButton}
          activeOpacity={0.8}
          onPress={() => {
            setSelectedRole('admin');
            setView('form');
          }}
        >
          <ThemedText style={styles.bigButtonText}>
            {t('common.createAdmin')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bigButton}
          activeOpacity={0.8}
          onPress={() => {
            setSelectedRole('technician');
            setView('form');
          }}
        >
          <ThemedText style={styles.bigButtonText}>
            {t('common.createTechnician')}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: "30%",
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
    marginBottom: 32,
    textAlign: 'center',
  },
  bigButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  bigButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});