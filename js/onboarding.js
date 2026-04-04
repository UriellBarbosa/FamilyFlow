import { supabase } from './supabase.js';

// ── Proteção de rota ──
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) window.location.href = 'index.html';
}

checkAuth();

// ── Estado global do onboarding ──
const state = {
  currentStep: 1,
  totalSteps: 4,
  income: {
    type: 'single',   // 'single' ou 'multiple'
    single: 0,
    multiple: []      // [{ name, amount }]
  },
  categories: [],     // [{ name, type, color, custom }]
  members: []         // [{ name, email, method }]
};

// ── Seleção de elementos ──
const progressFill  = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const btnNext       = document.getElementById('btnNext');
const btnBack       = document.getElementById('btnBack');

// ── Função: atualizar barra de progresso ──
function updateProgress() {
  const percent = (state.currentStep / state.totalSteps) * 100;
  progressFill.style.width = percent + '%';
  progressLabel.textContent = `Passo ${state.currentStep} de ${state.totalSteps}`;
}

// ── Função: navegar entre passos ──
function goToStep(step) {
  document.getElementById(`step${state.currentStep}`).classList.add('hidden');
  state.currentStep = step;
  document.getElementById(`step${state.currentStep}`).classList.remove('hidden');
  updateProgress();

  // Esconde o botão Voltar no primeiro passo
  btnBack.style.visibility = state.currentStep === 1 ? 'hidden' : 'visible';

  // Muda o texto do botão no último passo
  btnNext.textContent = state.currentStep === state.totalSteps ? 'Ir para o dashboard' : 'Continuar';
}

// ── Eventos de navegação ──
btnNext.addEventListener('click', () => {
  if (state.currentStep < state.totalSteps) {
    goToStep(state.currentStep + 1);
  } else {
    window.location.href = 'dashboard.html';
  }
});

btnBack.addEventListener('click', () => {
  if (state.currentStep > 1) goToStep(state.currentStep - 1);
});

// ── Inicialização ──
updateProgress();
btnBack.style.visibility = 'hidden';