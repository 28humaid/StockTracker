import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';
// console.log('Expo config:', Constants.expoConfig);
// console.log('Extra:', Constants.expoConfig?.extra);
const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig.extra;

// Safety check (will show error in console if missing)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key in .env file!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});