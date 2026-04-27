import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente faltando:', {
    VITE_SUPABASE_URL: supabaseUrl ? '✓' : '✗ FALTANDO',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '✓' : '✗ FALTANDO',
  });
  throw new Error(
    'Erro de configuração: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórios. ' +
    'Configure as variáveis de ambiente no Netlify.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
