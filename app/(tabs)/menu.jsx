// app/(tabs)/menu.tsx    ← or wherever your MenuScreen lives
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View } from 'react-native';
import { ThemedView } from '@/src/components/themed-view';
import { ThemedText } from '@/src/components/themed-text';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/src/services/supabase';

// Import all screens/components you want to show
import AddUser from '../../src/components/admin/addUser'
import AddItems from '../../src/components/admin/addItems'
import ViewUsers from '../../src/components/admin/viewUsers';
import ViewItems from '../../src/components/admin/viewItems';
import InstallItems from '../../src/components/technician/installItems';
import PickItems from '../../src/components/technician/pickItems';

export default function MenuScreen() {
  const { t } = useTranslation();
  
  const [role, setRole] = useState(null);
  const [activeAdminScreen, setActiveAdminScreen] = useState(null);
  const [activeTechnicianScreen, setActiveTechnicianScreen] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      setRole(data?.role || null);
    };

    fetchRole();
  }, []);

  // Reset view when going back to menu
  const showMenu = () => {
    setActiveAdminScreen(null);
    setActiveTechnicianScreen(null);
  };

  // ── Admin Menu ────────────────────────────────────────
  const adminOptions = [
    { 
      title: t('menu.addUser'), 
      key: 'add-user',
      component: <AddUser onBack={showMenu} />
    },
    { 
      title: t('menu.addItems'), 
      key: 'add-items',
      component: <AddItems onBack={showMenu} />
    },
    { 
      title: t('menu.viewUsers'), 
      key: 'view-users',
      component: <ViewUsers onBack={showMenu} />
    },
    { 
      title: t('menu.viewItems'), 
      key: 'view-items',
      component: <ViewItems onBack={showMenu} />
    },
  ];

  // ── Technician Menu ───────────────────────────────────
  const technicianOptions = [
    { title: t('menu.pickItems'),    key: 'pick-items',    component: <PickItems onBack={showMenu} /> },
    { title: t('menu.installItems'), key: 'install-items', component: <InstallItems onBack={showMenu} /> },
  ];

  const options = role === 'admin' ? adminOptions : technicianOptions;

  // Determine what to show
  const isShowingSubScreen = !!activeAdminScreen || !!activeTechnicianScreen;

  return (
    <ThemedView style={styles.container}>
      {/* Main Menu */}
      {!isShowingSubScreen && (
        <>
          <ThemedText type="title" style={{ marginBottom: 24 }}>
            {t('common.menu')}
          </ThemedText>

          <ScrollView contentContainerStyle={styles.buttonContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={styles.button}
                onPress={() => {
                  if (role === 'admin') {
                    setActiveAdminScreen(option.key);
                  } else {
                    setActiveTechnicianScreen(option.key);
                  }
                }}
              >
                <ThemedText style={styles.buttonText}>
                  {option.title}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {/* Sub-screens (overlaid) */}
      {isShowingSubScreen && (
        <View style={StyleSheet.absoluteFill}>
          {role === 'admin' && activeAdminScreen && (
            <>
              {activeAdminScreen === 'add-user' && adminOptions[0].component}
              {activeAdminScreen === 'add-items' && adminOptions[1].component}
              {activeAdminScreen === 'view-users' && adminOptions[2].component}
              {activeAdminScreen === 'view-items' && adminOptions[3].component}
            </>
          )}

          {role === 'technician' && activeTechnicianScreen && (
            <>
              {activeTechnicianScreen === 'pick-items' && technicianOptions[0].component}
              {activeTechnicianScreen === 'install-items' && technicianOptions[1].component}
            </>
          )}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:'30%'
  },
  buttonContainer: {
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 24,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});