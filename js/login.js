/* ============================================================
   EduIa — login.js
   Controla o cadastro e o login de usuários usando localStorage.
   ============================================================ */

/* ---------- Chaves usadas no localStorage ---------- */
const CHAVE_USUARIOS = 'eduia_usuarios';      // lista de usuários cadastrados
// CHAVE_SESSAO já é declarada em script.js — reutilizada aqui

/* ---------- Funções auxiliares de localStorage ---------- */

// Lê a lista de usuários cadastrados
function obterUsuarios() {
  const dados = localStorage.getItem(CHAVE_USUARIOS);
  return dados ? JSON.parse(dados) : [];
}

// Salva a lista de usuários
function salvarUsuarios(usuarios) {
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

// Salva a sessão do usuário logado (apenas nome e e-mail)
function salvarSessao(nome, email) {
  const sessao = { nome, email };
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

/* ---------- Cadastro ---------- */
function configurarCadastro() {
  const form = document.getElementById('cadastro-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const erro = document.getElementById('cadastro-error');
    erro.textContent = '';

    const nome      = document.getElementById('nome').value.trim();
    const email     = document.getElementById('email').value.trim().toLowerCase();
    const senha     = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmar').value;

    // Validações simples
    if (!nome || !email || !senha || !confirmar) {
      erro.textContent = 'Preencha todos os campos.';
      return;
    }
    if (senha.length < 4) {
      erro.textContent = 'A senha deve ter pelo menos 4 caracteres.';
      return;
    }
    if (senha !== confirmar) {
      erro.textContent = 'As senhas não coincidem.';
      return;
    }

    // Verifica se o e-mail já está cadastrado
    const usuarios = obterUsuarios();
    if (usuarios.some(function (u) { return u.email === email; })) {
      erro.textContent = 'Este e-mail já está cadastrado.';
      return;
    }

    // Adiciona o novo usuário e salva
    usuarios.push({ nome: nome, email: email, senha: senha });
    salvarUsuarios(usuarios);

    // Volta para a tela de login para entrar com os dados recém-cadastrados
    window.location.href = 'index.html?cadastro=ok&email=' + encodeURIComponent(email);
  });
}

/* ---------- Login ---------- */
function configurarLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const erro = document.getElementById('login-error');
    erro.textContent = '';

    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
      erro.textContent = 'Preencha e-mail e senha.';
      return;
    }

    // Procura o usuário na lista
    const usuarios = obterUsuarios();
    const usuario = usuarios.find(function (u) {
      return u.email === email && u.senha === senha;
    });

    if (!usuario) {
      erro.textContent = 'E-mail ou senha incorretos.';
      return;
    }

    // Salva a sessão e vai para a página inicial
    salvarSessao(usuario.nome, usuario.email);
    window.location.href = 'inicio.html';
  });
}

/* ---------- Inicializa quando a página carrega ---------- */
function mostrarAvisoCadastro() {
  var params = new URLSearchParams(window.location.search);
  var aviso = document.getElementById('cadastro-ok');
  if (!aviso || params.get('cadastro') !== 'ok') return;
  aviso.classList.remove('hidden');
  var campoEmail = document.getElementById('email');
  if (campoEmail && params.get('email')) campoEmail.value = params.get('email');
  var campoSenha = document.getElementById('senha');
  if (campoSenha) campoSenha.focus();
}

document.addEventListener('DOMContentLoaded', function () {
  mostrarAvisoCadastro();
  configurarCadastro();
  configurarLogin();
});
