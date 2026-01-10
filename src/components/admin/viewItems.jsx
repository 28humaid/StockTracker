// src/components/admin/addItems.jsx

import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/src/components/themed-view';
import { ThemedText } from '@/src/components/themed-text';
import { useTranslation } from 'react-i18next';
import { IconSymbol } from '@/src/components/ui/icon-symbol'; // if you have back icon

export default function ViewItems({ onBack }) {
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.container}>
      {/* Header with Back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={22} color="#007AFF" />
          <ThemedText style={styles.backText}>{t('common.back')}</ThemedText>
        </TouchableOpacity>

        {/* <ThemedText type="title">{t('screens.addItems')}</ThemedText> */}
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Here comes your real form in future */}
        <ThemedText style={styles.placeholderText}>
          {t('addItems.formComingSoon')}
        </ThemedText>

        {/* Example future large buttons style */}
        <TouchableOpacity style={styles.bigButton} activeOpacity={0.8}>
          <ThemedText style={styles.bigButtonText}>
            {t('common.scanBarcode')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bigButton} activeOpacity={0.8}>
          <ThemedText style={styles.bigButtonText}>
            {t('common.saveItem')}
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
    gap: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyItems:'center',
    gap: 1,
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
  placeholderText: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    marginVertical: 40,
    color: '#666',
  },
  bigButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  bigButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});