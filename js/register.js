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

  if (!fullName) {
    showError('Preencha seu nome completo.');
    fullNameInput.focus();
    return false;
  }

  if (!familyName) {
    showError('Preencha o nome da família.');
    familyNameInput.focus();
    return false;
  }

  if (!email) {
    showError('Preencha seu e-mail.');
    emailInput.focus();
    return false;
  }

  if (!password) {
    showError('Preencha sua senha.');
    passwordInput.value = '';
    confirmPassInput.value = '';
    passwordInput.focus();
    return false;
  }

  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  showError('A senha não atende aos requisitos mínimos de segurança.');
  passwordInput.value = '';
  confirmPassInput.value = '';
  passwordInput.focus();
  return false;
}

  if (password !== confirmPass) {
    showError('As senhas não coincidem.');
    confirmPassInput.value = '';
    confirmPassInput.focus();
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

    if (!authData.user) {
  showError('Confirme seu e-mail antes de continuar.');
  btnRegister.disabled = false;
  btnRegister.textContent = 'Criar conta';
  return;
}

    const userId = authData.user.id;

    // 2. Cria família, perfil e assinatura via função segura
const { data: familyId, error: setupError } = await supabase
  .rpc('create_family_setup', {
    p_user_id:     userId,
    p_full_name:   fullNameInput.value.trim(),
    p_family_name: familyNameInput.value.trim()
  });

if (setupError) throw setupError;

    // 5. Redireciona para o onboarding
    window.location.href = 'onboarding.html'; // onboarding_step começa em 0 — será atualizado a cada passo concluído

  } catch (error) {
    console.error(error);

    const errorMap = {
      'email rate limit exceeded': {
        message: 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.',
        field: null
      },
      'User already registered': {
        message: 'Este e-mail já está cadastrado. Tente fazer login.',
        field: emailInput
      },
      'Password should be at least 6 characters': {
        message: 'A senha deve ter no mínimo 6 caracteres.',
        field: passwordInput
      },
      'Unable to validate email address: invalid format': {
        message: 'O e-mail informado não é válido.',
        field: emailInput
      },
    };

    const mapped = errorMap[error.message];

    if (mapped) {
      showError(mapped.message);
      if (mapped.field) {
        mapped.field.value = '';
        mapped.field.focus();
      }
    } else {
      showError('Erro ao criar conta. Tente novamente.');
    }
  } finally {
    btnRegister.disabled = false;
    btnRegister.textContent = 'Criar conta';
  }
}

// ── Eventos ──
btnRegister.addEventListener('click', register);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnRegister.click();

// ── Validação visual das regras de senha em tempo real ──
const ruleLength  = document.getElementById('rule-length');
const ruleUpper   = document.getElementById('rule-upper');
const ruleLower   = document.getElementById('rule-lower');
const ruleSpecial = document.getElementById('rule-special');

passwordInput.addEventListener('input', () => {
  const value = passwordInput.value;

  ruleLength.classList.toggle('valid', value.length >= 8);
  ruleUpper.classList.toggle('valid', /[A-Z]/.test(value));
  ruleLower.classList.toggle('valid', /[a-z]/.test(value));
  ruleSpecial.classList.toggle('valid', /[!@#$%^&*(),.?":{}|<>]/.test(value));
    });
});