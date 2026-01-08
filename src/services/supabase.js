import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// Replace with your Supabase URL and Anon Key from dashboard
const supabaseUrl = 'https://ulwyxgvedleytkrgsksc.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.KEY;

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