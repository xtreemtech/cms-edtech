import { createClient } from '@supabase/supabase-js';

// Load Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in the environment variables.');
}

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
