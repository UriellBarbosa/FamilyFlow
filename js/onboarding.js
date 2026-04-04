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
  if (state.currentStep === 1 && !validateStep1()) return;

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

// ══════════════════════════════════════
// PASSO 1 — RENDA FAMILIAR
// ══════════════════════════════════════

const optSingle      = document.getElementById('optSingle');
const optMultiple    = document.getElementById('optMultiple');
const singleIncome   = document.getElementById('singleIncome');
const multipleIncome = document.getElementById('multipleIncome');
const incomeList     = document.getElementById('incomeList');
const btnAddIncome   = document.getElementById('btnAddIncome');
const incomeTotal    = document.getElementById('incomeTotal');

// ------- Função: alternar entre renda única e múltipla -------
function toggleIncomeType(type) {
  state.income.type = type;

  if (type === 'single') {
    optSingle.classList.add('active');
    optMultiple.classList.remove('active');
    singleIncome.classList.remove('hidden');
    multipleIncome.classList.add('hidden');
  } else {
    optMultiple.classList.add('active');
    optSingle.classList.remove('active');
    multipleIncome.classList.remove('hidden');
    singleIncome.classList.add('hidden');

    // Adiciona o primeiro item se a lista estiver vazia
    if (state.income.multiple.length === 0) {
      addIncomeItem();
    }
  }
}

// ------- Função: adicionar item de renda -------
function addIncomeItem() {
  if (state.income.multiple.length >= 5) return;

  const index = state.income.multiple.length;
  state.income.multiple.push({ name: '', amount: 0 });

  const item = document.createElement('div');
  item.classList.add('income-item');
  item.dataset.index = index;
  item.innerHTML = `
    <input type="text" placeholder="Nome (ex: João)" data-field="name" data-index="${index}" />
    <input type="number" placeholder="R$ 0,00" min="0" data-field="amount" data-index="${index}" />
    <span class="income-percent" id="percent-${index}">0%</span>
    <button class="btn-remove" data-index="${index}" type="button">✕</button>
  `;

  incomeList.appendChild(item);
  updateIncomePercents();
}

// ------- Função: remover item de renda -------
function removeIncomeItem(index) {
  state.income.multiple.splice(index, 1);
  renderIncomeList();
}

// ------- Função: re-renderizar lista de renda -------
function renderIncomeList() {
  incomeList.innerHTML = '';
  const items = [...state.income.multiple];
  state.income.multiple = [];
  items.forEach(item => {
    addIncomeItem();
    const last = state.income.multiple.length - 1;
    state.income.multiple[last] = item;
  });
  updateIncomePercents();
}

// ------- Função: atualizar percentuais -------
function updateIncomePercents() {
  const total = state.income.multiple.reduce((sum, item) => sum + (item.amount || 0), 0);

  state.income.multiple.forEach((item, index) => {
    const percent = total > 0 ? Math.round((item.amount / total) * 100) : 0;
    const el = document.getElementById(`percent-${index}`);
    if (el) el.textContent = percent + '%';
  });

  if (total > 0) {
    incomeTotal.textContent = `Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    incomeTotal.classList.remove('hidden');
  } else {
    incomeTotal.classList.add('hidden');
  }
}

// ------- Eventos da lista de renda -------
incomeList.addEventListener('input', (e) => {
  const field = e.target.dataset.field;
  const index = parseInt(e.target.dataset.index);

  if (field === 'name') {
    state.income.multiple[index].name = e.target.value;
  }

  if (field === 'amount') {
    state.income.multiple[index].amount = parseFloat(e.target.value) || 0;
    updateIncomePercents();
  }
});

incomeList.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-remove')) {
    removeIncomeItem(parseInt(e.target.dataset.index));
  }
});

// ------- Eventos dos botões de tipo de renda --------
optSingle.addEventListener('click', () => toggleIncomeType('single'));
optMultiple.addEventListener('click', () => toggleIncomeType('multiple'));
btnAddIncome.addEventListener('click', addIncomeItem);

// ----------- Validação do passo 1 -------------
function validateStep1() {
  const errorEl = document.getElementById('errorStep1');
  errorEl.classList.remove('show');

  if (state.income.type === 'single') {
    const amount = parseFloat(document.getElementById('singleAmount').value);
    if (!amount || amount <= 0) {
      errorEl.textContent = 'Informe a renda mensal da família.';
      errorEl.classList.add('show');
      return false;
    }
    state.income.single = amount;
  } else {
    const filled = state.income.multiple.filter(i => i.name.trim() && i.amount > 0);
    if (filled.length === 0) {
      errorEl.textContent = 'Adicione ao menos uma pessoa com nome e valor.';
      errorEl.classList.add('show');
      return false;
    }
  }

  return true;
}