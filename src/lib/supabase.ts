import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'your_anon_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
