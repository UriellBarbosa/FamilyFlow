import { supabase } from './supabase.js';

// ----------- Proteção de rota -----------
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) window.location.href = 'index.html';
}

checkAuth();

// ----------- Estado global do onboarding ----------
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

// ---------- Seleção de elementos ----------
const progressFill  = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const btnNext       = document.getElementById('btnNext');
const btnBack       = document.getElementById('btnBack');

// ---------- Função: atualizar barra de progresso ----------
function updateProgress() {
  const percent = (state.currentStep / state.totalSteps) * 100;
  progressFill.style.width = percent + '%';
  progressLabel.textContent = `Passo ${state.currentStep} de ${state.totalSteps}`;
}

// ------------ Função: navegar entre passos ---------
function goToStep(step) {
  document.getElementById(`step${state.currentStep}`).classList.add('hidden');
  state.currentStep = step;
  document.getElementById(`step${state.currentStep}`).classList.remove('hidden');
  updateProgress();

  btnBack.style.visibility = state.currentStep === 1 ? 'hidden' : 'visible';
  btnNext.textContent = state.currentStep === state.totalSteps ? 'Ir para o dashboard' : 'Continuar';

  // --------- Renderiza o resumo ao chegar no passo 4 ---------
  if (state.currentStep === state.totalSteps) renderSummary();
}

// ---------- Eventos de navegação entre passos ---------
btnBack.addEventListener('click', () => {
  if (state.currentStep > 1) goToStep(state.currentStep - 1);
});

btnNext.addEventListener('click', async () => {
  if (state.currentStep === 1 && !validateStep1()) return;
  if (state.currentStep === 2 && !validateStep2()) return;
  if (state.currentStep === 3 && !validateStep3()) return;

  if (state.currentStep < state.totalSteps) {
    goToStep(state.currentStep + 1);
  } else {
    await saveOnboarding();
  }
});

// --------- Inicialização do onboarding ---------
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

// ══════════════════════════════════════
// PASSO 2 — CATEGORIAS
// ══════════════════════════════════════

const suggestedCategories = document.getElementById('suggestedCategories');
const btnAddCategory      = document.getElementById('btnAddCategory');
const customCategoryForm  = document.getElementById('customCategoryForm');
const btnSaveCategory     = document.getElementById('btnSaveCategory');

// ---------------- Sugestões pré-definidas ----------------
const suggestions = [
  { name: 'Alimentação', type: 'expense', nature: 'variable', color: '#e07b54', icon: '🛒' },
  { name: 'Transporte',  type: 'expense', nature: 'variable', color: '#5b8dd9', icon: '🚗' },
  { name: 'Saúde',       type: 'expense', nature: 'variable', color: '#4caf7d', icon: '🏥' },
  { name: 'Educação',    type: 'expense', nature: 'fixed',    color: '#9b6dcc', icon: '📚' },
  { name: 'Lazer',       type: 'expense', nature: 'variable', color: '#f0b429', icon: '🎉' },
  { name: 'Moradia',     type: 'expense', nature: 'fixed',    color: '#e05c5c', icon: '🏠' },
  { name: 'Vestuário',   type: 'expense', nature: 'variable', color: '#e8a0bf', icon: '👗' },
  { name: 'Assinaturas', type: 'expense', nature: 'fixed',    color: '#4db8b8', icon: '📱' },
  { name: 'Salário',     type: 'income',  nature: 'fixed',    color: '#4caf7d', icon: '💼' },
  { name: 'Renda extra', type: 'income',  nature: 'variable', color: '#f0b429', icon: '💰' },
];

// -------------- Função: renderizar sugestões ----------------
function renderSuggestions() {
  suggestedCategories.innerHTML = '';

  suggestions.forEach((cat, index) => {
    const chip = document.createElement('button');
          chip.type = 'button';
          chip.classList.add('category-chip');
          chip.dataset.index = index;
    const natureLabel = cat.nature === 'fixed' ? 'Fixa' : 'Variável';
          chip.innerHTML = `
          <span>${cat.icon}</span>
          ${cat.name}
          <small>${natureLabel}</small>
        `;
          chip.style.setProperty('--chip-color', cat.color);

    chip.addEventListener('click', () => toggleSuggestion(chip, cat));
    suggestedCategories.appendChild(chip);
  });
}

// ---------------- Função: selecionar/deselecionar sugestão ----------------
function toggleSuggestion(chip, cat) {
  const exists = state.categories.findIndex(c => c.name === cat.name);

  if (exists >= 0) {
    state.categories.splice(exists, 1);
    chip.classList.remove('selected');
  } else {
    state.categories.push({ ...cat, custom: false });
    chip.classList.add('selected');
  }

  renderSelectedCategories();
}

// ---------------- Função: renderizar categorias selecionadas ----------------
function renderSelectedCategories() {
  const container = document.querySelector('#step2 #selectedCategories');
  if (!container) return;
  container.innerHTML = '';

  state.categories.forEach((cat, index) => {
    if (cat.custom) {
      const tag = document.createElement('div');
      tag.classList.add('category-chip', 'selected');
      tag.innerHTML = `
        <span style="color:${cat.color}">●</span>
        ${cat.name}
        <button class="btn-remove" data-index="${index}" type="button">✕</button>
      `;
      tag.querySelector('.btn-remove').addEventListener('click', () => {
        state.categories.splice(index, 1);
        renderSelectedCategories();
      });
      container.appendChild(tag);
    }
  });
}

// ----------------- Função: adicionar categoria personalizada -----------------
function saveCustomCategory() {
  const name   = document.getElementById('customCategoryName').value.trim();
  const type   = document.getElementById('customCategoryType').value;
  const nature = document.getElementById('customCategoryNature').value;
  const color  = document.getElementById('customCategoryColor').value;

  if (!name) {
    document.getElementById('errorStep2').textContent = 'Informe o nome da categoria.';
    document.getElementById('errorStep2').classList.add('show');
    return;
  }

  const exists = state.categories.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
  if (exists >= 0) {
    document.getElementById('errorStep2').textContent = 'Essa categoria já foi adicionada.';
    document.getElementById('errorStep2').classList.add('show');
    return;
  }

  document.getElementById('errorStep2').classList.remove('show');
  state.categories.push({ name, type, nature, color, icon: '📌', custom: true });

  // ----------- Limpa o formulário ---------------
  document.getElementById('customCategoryName').value = '';
  document.getElementById('customCategoryColor').value = '#2d4a3e';
  customCategoryForm.classList.add('hidden');

  renderSelectedCategories();
}

// ------------------- Eventos ------------------
btnAddCategory.addEventListener('click', () => {
  customCategoryForm.classList.remove('hidden');
  document.getElementById('customCategoryName').focus();
});

document.getElementById('btnCancelCategory').addEventListener('click', () => {
  customCategoryForm.classList.add('hidden');
  document.getElementById('customCategoryName').value = '';
  document.getElementById('customCategoryColor').value = '#2d4a3e';
  document.getElementById('errorStep2').classList.remove('show');
});

btnSaveCategory.addEventListener('click', saveCustomCategory);

// ----------------- Validação do passo 2 -----------------
function validateStep2() {
  const errorEl = document.getElementById('errorStep2');
  errorEl.classList.remove('show');

  if (state.categories.length === 0) {
    errorEl.textContent = 'Selecione ou crie ao menos uma categoria.';
    errorEl.classList.add('show');
    return false;
  }

  return true;
}

// ----------------- Inicializa as sugestões -----------------
renderSuggestions();

// ══════════════════════════════════════
// PASSO 3 — INTEGRANTES
// ══════════════════════════════════════

const optInviteLink   = document.getElementById('optInviteLink');
const optInviteEmail  = document.getElementById('optInviteEmail');
const optInviteManual = document.getElementById('optInviteManual');
const inviteLinkForm  = document.getElementById('inviteLinkForm');
const inviteEmailForm = document.getElementById('inviteEmailForm');
const inviteManualForm = document.getElementById('inviteManualForm');
const membersList     = document.getElementById('membersList');

// ----------------- Função: esconder todos os formulários de convite -----------------
function hideAllInviteForms() {
  inviteLinkForm.classList.add('hidden');
  inviteEmailForm.classList.add('hidden');
  inviteManualForm.classList.add('hidden');
  optInviteLink.classList.remove('active');
  optInviteEmail.classList.remove('active');
  optInviteManual.classList.remove('active');
}

// ----------------- Função: gerar link de convite -----------------
async function generateInviteLink() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data: familyId, error: familyError } = await supabase
    .rpc('get_my_family_id');

  if (familyError || !familyId) return;

  // ----------- Cria o convite no banco -----------
  const { data: token, error } = await supabase
    .rpc('create_invite');

  if (error || !token) return;

const link = `${window.location.origin}/register.html?invite=${token}`;
document.getElementById('inviteLinkText').textContent = link;
}

// ----------------- Função: copiar link -----------------
document.getElementById('btnCopyLink').addEventListener('click', () => {
  const link = document.getElementById('inviteLinkText').textContent;
  navigator.clipboard.writeText(link);
  document.getElementById('btnCopyLink').textContent = 'Copiado!';
  setTimeout(() => {
    document.getElementById('btnCopyLink').textContent = 'Copiar';
  }, 2000);
});

// ----------------- Função: enviar convite por e-mail -----------------
document.getElementById('btnSendInvite').addEventListener('click', async () => {
  const name    = document.getElementById('inviteEmailName').value.trim();
  const email   = document.getElementById('inviteEmail').value.trim();
  const errorEl = document.getElementById('errorStep3');

  if (!name || !email) {
    errorEl.textContent = 'Preencha nome e e-mail do integrante.';
    errorEl.classList.add('show');
    return;
  }

  errorEl.classList.remove('show');

  const { error } = await supabase
    .rpc('create_invite', { p_email: email });

  if (error) {
    errorEl.textContent = 'Erro ao enviar convite. Tente novamente.';
    errorEl.classList.add('show');
    return;
  }

  state.members.push({ name, email, role: 'member', method: 'email' });
  document.getElementById('inviteEmailName').value = '';
  document.getElementById('inviteEmail').value = '';
  renderMembersList();
});

// ----------------- Função: cadastrar manualmente -----------------
document.getElementById('btnSaveManual').addEventListener('click', () => {
  console.log('manualName:', document.getElementById('manualName'));
  console.log('manualEmail:', document.getElementById('manualEmail'));
  console.log('manualIsAdmin:', document.getElementById('manualIsAdmin'));
  console.log('errorStep3:', document.getElementById('errorStep3'));
  const name    = document.getElementById('manualName').value.trim();
  const email   = document.getElementById('manualEmail').value.trim();
  const isAdmin = document.getElementById('manualIsAdmin').checked;
  const errorEl = document.getElementById('errorStep3');

if (!name || !email) {
  errorEl.textContent = 'Preencha nome e e-mail do integrante.';
  errorEl.classList.add('show');
  return;
}

errorEl.classList.remove('show');
state.members.push({ name, email, role: isAdmin ? 'admin' : 'member', method: 'manual' });
document.getElementById('manualName').value = '';
document.getElementById('manualEmail').value = '';
document.getElementById('manualIsAdmin').checked = false;
renderMembersList();
});

// ----------------- Função: renderizar lista de membros -----------------
function renderMembersList() {
  membersList.innerHTML = '';

  state.members.forEach((member, index) => {
    const initials = member.name
      ? member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : '?';

    const item = document.createElement('div');
    item.classList.add('member-item');
    const roleLabel = member.role === 'admin' ? '👑 Admin' : '👤 Membro';
    item.innerHTML = `
      <div class="member-avatar">${initials}</div>
        <div style="flex:1">
          <div class="member-name">${member.name || '—'}</div>
          <div class="member-email">${member.email} · ${roleLabel}</div>
        </div>
      <button class="btn-remove" data-index="${index}" type="button">✕</button>
    `;
    item.querySelector('.btn-remove').addEventListener('click', () => {
      state.members.splice(index, 1);
      renderMembersList();
    });
    membersList.appendChild(item);
  });
}

// ----------------- Eventos das opções de convite -----------------
optInviteLink.addEventListener('click', () => {
  hideAllInviteForms();
  optInviteLink.classList.add('active');
  inviteLinkForm.classList.remove('hidden');
  generateInviteLink();
});

optInviteEmail.addEventListener('click', () => {
  hideAllInviteForms();
  optInviteEmail.classList.add('active');
  inviteEmailForm.classList.remove('hidden');
});

optInviteManual.addEventListener('click', () => {
  hideAllInviteForms();
  optInviteManual.classList.add('active');
  inviteManualForm.classList.remove('hidden');
});

// ----------------- Validação do passo 3 (opcional — pode pular) -----------------
function validateStep3() {
  return true;
}

// ══════════════════════════════════════
// PASSO 4 — TUDO PRONTO
// ══════════════════════════════════════

// --------- Função: montar resumo do onboarding -----------
function renderSummary() {
  const summary = document.getElementById('onboardingSummary');
  summary.innerHTML = '';

  // --------- Resumo da renda ---------
  let incomeValue = '';
  if (state.income.type === 'single') {
    incomeValue = `R$ ${state.income.single.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  } else {
    const total = state.income.multiple.reduce((sum, i) => sum + (i.amount || 0), 0);
    incomeValue = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} — ${state.income.multiple.length} pessoa(s)`;
  }

  // --------- Resumo das categorias ---------
  const totalCats   = state.categories.length;
  const fixedCats   = state.categories.filter(c => c.nature === 'fixed').length;
  const varCats     = state.categories.filter(c => c.nature === 'variable').length;
  const catsValue   = `${totalCats} categoria(s) — ${fixedCats} fixa(s), ${varCats} variável(is)`;

  // --------- Resumo dos integrantes ---------
  const totalMembers = state.members.length;
  const membersValue = totalMembers > 0
    ? `${totalMembers} integrante(s) adicionado(s)`
    : 'Nenhum integrante adicionado ainda';

  const items = [
    { icon: '💰', label: 'Renda familiar',  value: incomeValue   },
    { icon: '🗂️', label: 'Categorias',      value: catsValue     },
    { icon: '👨‍👩‍👧‍👦', label: 'Integrantes',    value: membersValue  },
  ];

  items.forEach(item => {
    const el = document.createElement('div');
    el.classList.add('summary-item');
    el.innerHTML = `
      <div class="summary-icon">${item.icon}</div>
      <div>
        <div class="summary-label">${item.label}</div>
        <div class="summary-value">${item.value}</div>
      </div>
    `;
    summary.appendChild(el);
  });
}

// ----------- Função: salvar onboarding no banco e redirecionar para dashboard -----------
async function saveOnboarding() {
  btnNext.disabled = true;
  btnNext.textContent = 'Salvando...';

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session.user.id;

    const { data: familyId } = await supabase.rpc('get_my_family_id');

    // 1. Salva as categorias personalizadas (as pré-definidas já existem no banco, então só precisamos salvar as customizadas)
    if (state.categories.length > 0) {
    const categoriesToInsert = state.categories.map(cat => ({
      name:   cat.name,
      type:   cat.type,
      nature: cat.nature,
      color:  cat.color
    }));

    const { error: catError } = await supabase
      .rpc('save_categories', { p_categories: categoriesToInsert });

    if (catError) throw catError;
    }

    // 2. Salva a renda no perfil do usuário (usamos o campo onboarding_data para armazenar temporariamente os dados do onboarding, que serão migrados para as tabelas definitivas no backend)
    /*const incomeData = state.income.type === 'single'
      ? { income_type: 'single', income_total: state.income.single }
      : { income_type: 'multiple', income_total: state.income.multiple.reduce((s, i) => s + i.amount, 0) };*/

    // 3. Marca o onboarding como concluído atualizando o campo onboarding_step para 4 (que indica que o usuário completou todos os passos)
    const { error: profileError } = await supabase
      .rpc('complete_onboarding');

    if (profileError) throw profileError;

    window.location.href = 'dashboard.html';

    } catch (error) {
    console.error(error);
    btnNext.textContent = 'Ir para o dashboard';
    btnNext.disabled = false;
  }
}