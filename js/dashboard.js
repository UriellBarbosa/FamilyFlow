import { supabase } from './supabase.js';

// ── Verifica se o usuário está autenticado ──
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = 'index.html';
  }
}

checkAuth();