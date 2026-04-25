
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing! Please check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Connection Validation Helper
export const validateConnection = async () => {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`[Supabase] Connection Successful. Profiles found: ${count}`);
    return true;
  } catch (err) {
    console.error('[Supabase] Connection Failed:', err);
    return false;
  }
};
