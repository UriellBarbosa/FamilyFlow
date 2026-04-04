import { supabase } from './supabase.js';

// ── Seleção dos elementos ──
const fullNameInput     = document.getElementById('fullName');
const familyNameInput   = document.getElementById('familyName');
const emailInput        = document.getElementById('email');
const passwordInput     = document.getElementById('password');
const confirmPassInput  = document.getElementById('confirmPassword');
const btnRegister       = document.getElementById('btnRegister');
const errorMsg          = document.getElementById('errorMsg');

// ── Função: exibir erro ──
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add('show');
}

// ── Função: ocultar erro ──
function hideError() {
  errorMsg.classList.remove('show');
}

// ── Função: validar campos ──
function validateFields() {
  const fullName    = fullNameInput.value.trim();
  const familyName  = familyNameInput.value.trim();
  const email       = emailInput.value.trim();
  const password    = passwordInput.value;
  const confirmPass = confirmPassInput.value;

  if (!fullName || !familyName || !email || !password || !confirmPass) {
    showError('Preencha todos os campos para continuar.');
    return false;
  }

  if (password.length < 6) {
    showError('A senha deve ter no mínimo 6 caracteres.');
    return false;
  }

  if (password !== confirmPass) {
    showError('As senhas não coincidem.');
    return false;
  }

  return true;
}

// ── Função: cadastrar usuário e família ──
async function register() {
  hideError();

  if (!validateFields()) return;

  btnRegister.disabled = true;
  btnRegister.textContent = 'Criando conta...';

  try {
    // 1. Cria o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailInput.value.trim(),
      password: passwordInput.value
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // 2. Cria a família
    const { data: familyData, error: familyError } = await supabase
      .from('families')
      .insert({ name: familyNameInput.value.trim() })
      .select()
      .single();

    if (familyError) throw familyError;

    const familyId = familyData.id;

    // 3. Cria o perfil do usuário como admin
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        family_id: familyId,
        full_name: fullNameInput.value.trim(),
        role: 'admin'
      });

    if (profileError) throw profileError;

    // 4. Cria a assinatura em período de teste
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({ family_id: familyId });

    if (subError) throw subError;

    // 5. Redireciona para o onboarding
    window.location.href = 'onboarding.html';

  } catch (error) {
    showError('Erro ao criar conta. Tente novamente.');
    console.error(error);
  } finally {
    btnRegister.disabled = false;
    btnRegister.textContent = 'Criar conta';
  }
}

// ── Eventos ──
btnRegister.addEventListener('click', register);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnRegister.click();

});