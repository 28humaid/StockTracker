// app/(tabs)/app.jsx (or index.tsx)
import React, { useEffect, useState } from 'react';
import { ThemedView } from '@/src/components/themed-view';
import { ThemedText } from '@/src/components/themed-text';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '@/src/services/supabase';

export default function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        // Correct destructuring for Supabase v2
        const { data, error: sessionError } = await supabase.auth.getSession();

        // console.log('getSession response:', { data, sessionError }); // Debug log

        if (sessionError) {
          console.error('Session error:', sessionError);
          setErrorMsg('Session error: ' + sessionError.message);
          setLoading(false);
          return;
        }

        const session = data.session;

        if (!session?.user) {
          console.log('No active session/user');
          setLoading(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          setErrorMsg('Profile error: ' + profileError.message);
          setLoading(false);
          return;
        }

        console.log('Fetched profile role:', profileData?.role);
        setRole(profileData?.role || null);
      } catch (err) {
        console.error('Unexpected error in fetchRole:', err);
        setErrorMsg('Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (errorMsg) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ color: 'red' }}>
          Error
        </ThemedText>
        <ThemedText>{errorMsg}</ThemedText>
      </ThemedView>
    );
  }

  if (role === 'admin') {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Admin Dashboard</ThemedText>
        <ThemedText style={styles.info}>
          You are logged in as Administrator
        </ThemedText>
        {/* Add admin-specific content here later */}
      </ThemedView>
    );
  }

  if (role === 'technician') {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Technician Dashboard</ThemedText>
        <ThemedText style={styles.info}>
          Welcome! View and checkout available stock here.
        </ThemedText>
        {/* Add technician-specific content here later */}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText>No role assigned or not logged in</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  info: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
});