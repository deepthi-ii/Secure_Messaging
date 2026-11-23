import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = (url && key && !url.includes('YOUR_PROJECT')) ? createClient(url, key) : null;
export async function logEvent(event_type, details) {
  if (!supabase) return { stored:false };
  const { error } = await supabase.from('security_events').insert({event_type, details});
  if (error) console.warn('Supabase log failed:', error.message);
  return {stored:!error};
}
