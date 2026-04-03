// ------- IMPORTAÇÃO DO SUPABASE -------
import { supabase } from './supabase.js';

// ------- SELEÇÃO DOS ELEMENTOS DA PÁGINA ---------
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const errorMsg = document.getElementById('errorMsg');

// ------- FUNÇÃO QUE EXIBE MENSAGEM DE ERRO -------
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
}

// ------- FUNÇÃO QUE OCULTA MENSAGEM DE ERRO -------
function hideError() {
    errorMsg.classList.remove('show');
}

// ------- FUNÇÃO QUE VALIDA OS CAMPOS DO FORMULÁRIO -------
function validateFields() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showError('Preencha e-mail e senha para continuar.');
        return false;
    }

    return true;
}

// ------- EVENTO: CLIQUE NO BOTÃO DE LOGIN -------
btnLogin.addEventListener('click', async () => {
    hideError();

    const isValid = validateFields();
    if (!isValid) return;

    // autenticação com o supabase
    btnLogin.disabled = true;
    btnLogin.textContent = 'Entrando...';

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.value.trim(),
        password: passwordInput.value
    });

    if (error) throw error;

    window.location.href = 'dashboard.html';

    } catch (error) {
    showError('E-mail ou senha incorretos. Tente novamente.');
    } finally {
    btnLogin.disabled = false;
    btnLogin.textContent = 'Entrar';
}
});

// ------- EVENTO: TECLA ENTER ACIONA O LOGIN -------
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnLogin.click();
});