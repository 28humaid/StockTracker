import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// Replace with your Supabase URL and Anon Key from dashboard
const supabaseUrl = 'https://ulwyxgvedleytkrgsksc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsd3l4Z3ZlZGxleXRrcmdza3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NjM3ODksImV4cCI6MjA4MzMzOTc4OX0.8ceyimw3L7af6SW1AI7wMaJ7xBFD8aRfsMXC0WQYxz4'

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