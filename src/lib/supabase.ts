import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtucibryvhegheqplejv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dWNpYnJ5dmhlZ2hlcXBsZWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NjIzNTMsImV4cCI6MjA4NzMzODM1M30.PXdaiF2mfu_umyF_fmK1_2Z-JUf8iQSGK12GqbjWNuQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
