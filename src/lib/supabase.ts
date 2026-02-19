import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// This "if" block prevents the app from crashing with a cryptic error
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("CRITICAL: Supabase URL or Key is missing. Check your environment settings.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);