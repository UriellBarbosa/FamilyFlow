// ── Importa o cliente do Supabase via CDN ──
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ── Credenciais do projeto ──
// ATENÇÃO: substitua pelos valores do seu projeto no Supabase
const SUPABASE_URL = 'https://xjzdbtjbdncplxjrdopu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqemRidGpiZG5jcGx4anJkb3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTg4NTcsImV4cCI6MjA5MDYzNDg1N30.t4UZC5DRidC6klhOVXIdyFwsEzR-RBVbu_7ZGrP0JcI';

// ── Cria e exporta o cliente ──
// O objeto `supabase` será usado em todos os outros arquivos JS
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);