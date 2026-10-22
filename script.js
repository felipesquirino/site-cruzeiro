/* ============================================================
   EduIa — script.js
   Funções compartilhadas entre todas as páginas:
   - Verificar se o usuário está logado
   - Montar a barra de navegação
   - Fazer logout
   - Obter dados do usuário
   ============================================================ */

const CHAVE_SESSAO = 'eduia_sessao';

/* ---------- Obter usuário logado ---------- */
function obterSessao() {
  const dados = localStorage.getItem(CHAVE_SESSAO);
  return dados ? JSON.parse(dados) : null;
}

/* ---------- Verificar login — redireciona se não estiver logado ---------- */
function exigirLogin() {
  const sessao = obterSessao();
  if (!sessao) {
    window.location.href = 'index.html';
    return null;
  }
  return sessao;
}

/* ---------- Atualizar nome no localStorage da sessão ---------- */
function atualizarSessao(novoNome) {
  const sessao = obterSessao();
  if (sessao) {
    sessao.nome = novoNome;
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  }
}

/* ---------- Logout — limpa apenas a sessão ---------- */
function logout() {
  localStorage.removeItem(CHAVE_SESSAO);
  window.location.href = 'index.html';
}

/* ---------- Montar a barra de navegação ---------- */
function montarNavbar(paginaAtual) {
  const links = [
    { href: 'inicio.html',      label: 'Início',      key: 'inicio' },
    { href: 'cursos.html',      label: 'Cursos',       key: 'cursos' },
    { href: 'certificado.html', label: 'Certificados', key: 'certificados' },
    { href: 'plano-aula.html',  label: 'Plano de Aula', key: 'plano' },
    { href: 'perfil.html',      label: 'Perfil',       key: 'perfil' },
  ];

  // Cria os itens do menu
  var itens = links.map(function (l) {
    var classe = l.key === paginaAtual ? 'active' : '';
    return '<li><a href="' + l.href + '" class="' + classe + '">' + l.label + '</a></li>';
  }).join('');

  // Adiciona o botão Sair
  itens += '<li><a href="#" class="nav-sair" id="nav-sair">Sair</a></li>';

  var navbar =
    '<nav class="navbar">' +
      '<div class="navbar-inner">' +
        '<a href="inicio.html" class="navbar-brand">' +
          '<img src="img/logo.svg" alt="EduIa" />' +
          '<span>EduIa</span>' +
        '</a>' +
        '<button class="nav-toggle" id="nav-toggle" aria-label="Menu">&#9776;</button>' +
        '<ul class="navbar-links" id="navbar-links">' +
          itens +
        '</ul>' +
      '</div>' +
    '</nav>';

  var container = document.getElementById('navbar');
  if (container) {
    container.innerHTML = navbar;

    // Botão Sair
    var btnSair = document.getElementById('nav-sair');
    if (btnSair) btnSair.addEventListener('click', function (e) {
      e.preventDefault();
      logout();
    });

    // Menu mobile
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('navbar-links');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.classList.toggle('open');
      });
    }
  }
}

/* ---------- Inicialização comum a todas as páginas internas ---------- */
function initPagina(paginaAtual) {
  var sessao = exigirLogin();
  if (!sessao) return null;
  montarNavbar(paginaAtual);
  return sessao;
}
