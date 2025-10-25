import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY;

let supabaseClient;
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_url_here')) {
  console.warn('Supabase not configured. Please set up your Supabase project in .env and app.json.');
  // Create a dummy client to avoid errors, but it won't work
  supabaseClient = createClient('https://dummy.supabase.co', 'dummy-key');
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;