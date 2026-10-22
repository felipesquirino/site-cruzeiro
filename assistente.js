/* ============================================================
   EduIa — assistente.js
   Assistente de Estudos: botão flutuante + painel de conversa DENTRO do site.
   - Responde a partir de uma base de conhecimento predefinida (js/base-conhecimento.js).
     Não usa API, chave, internet nem tem limite de uso. NÃO é IA generativa.
   - Para perguntas livres, há atalhos que abrem ChatGPT, Claude ou Gemini em nova aba
     (sites oficiais não podem ser exibidos dentro de outros sites), com a pergunta já copiada.
   - O histórico da conversa fica em sessionStorage (dura enquanto a aba estiver aberta).
   Requer: script.js (obterSessao), curso.js (obterCursoPorId) e base-conhecimento.js.
   ============================================================ */
(function () {
  var MAX_HISTORICO = 30;
  var sessao = typeof obterSessao === 'function' ? obterSessao() : null;
  if (!sessao) return;

  var chaveHist = 'eduia_assistente_' + sessao.email;
  var historico = [];
  try { historico = JSON.parse(sessionStorage.getItem(chaveHist) || '[]'); } catch (e) { historico = []; }

  var params = new URLSearchParams(window.location.search);
  var cursoAtual = /curso\.html$/.test(window.location.pathname) ? obterCursoPorId(parseInt(params.get('id'))) : null;

  /* ---------- Busca na base ---------- */
  function normalizar(txt) {
    return ' ' + String(txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  }

  function buscar(pergunta) {
    var q = normalizar(pergunta);
    var pontuados = [];
    BASE_CONHECIMENTO.forEach(function (item) {
      var pontos = 0;
      item.k.forEach(function (kw) {
        var palavras = kw.trim().split(' ').length;
        if (q.indexOf(' ' + kw + ' ') !== -1) pontos += 2 + palavras;           // frase inteira presente
        else if (palavras === 1 && kw.length >= 6 && q.indexOf(kw) !== -1) pontos += 1;  // parte de outra palavra (plural, etc.)
      });
      if (pontos >= 3) pontuados.push({ item: item, pontos: pontos });
    });
    pontuados.sort(function (a, b) { return b.pontos - a.pontos; });
    return pontuados;
  }

  var SAUDACOES = [' oi ', ' ola ', ' bom dia ', ' boa tarde ', ' boa noite ', ' ajuda ', ' help '];
  function ehSaudacao(pergunta) {
    var q = normalizar(pergunta);
    return q.split(' ').filter(Boolean).length <= 3 && SAUDACOES.some(function (s) { return q.indexOf(s) !== -1; });
  }

  /* ---------- Interface ---------- */
  var raiz = document.createElement('div');
  raiz.innerHTML =
    '<button class="tutor-fab no-print" id="tutor-fab" aria-label="Abrir o Assistente de Estudos">&#128214; <span>Assistente</span></button>' +
    '<section class="tutor-panel hidden no-print" id="tutor-panel" role="dialog" aria-label="Assistente de Estudos">' +
      '<header class="tutor-head">' +
        '<div><strong>Assistente de Estudos</strong><small>Respostas prontas &middot; sem limites</small></div>' +
        '<div class="tutor-head-actions">' +
          '<button type="button" id="tutor-limpar" title="Limpar conversa" aria-label="Limpar conversa">&#128465;</button>' +
          '<button type="button" id="tutor-fechar" title="Fechar" aria-label="Fechar">&#10005;</button>' +
        '</div>' +
      '</header>' +
      '<div class="tutor-msgs" id="tutor-msgs" aria-live="polite"></div>' +
      '<form class="tutor-form" id="tutor-form">' +
        '<textarea id="tutor-input" rows="1" maxlength="300" placeholder="Digite sua dúvida sobre o curso..."></textarea>' +
        '<button type="submit" class="btn btn-primary" id="tutor-enviar">Enviar</button>' +
      '</form>' +
      '<div class="tutor-externo">' +
        '<span>Pergunta livre? Abrir em uma IA:</span>' +
        '<button type="button" data-ia="chatgpt">ChatGPT</button>' +
        '<button type="button" data-ia="claude">Claude</button>' +
        '<button type="button" data-ia="gemini">Gemini</button>' +
      '</div>' +
    '</section>';
  document.body.appendChild(raiz);

  var fab = document.getElementById('tutor-fab');
  var painel = document.getElementById('tutor-panel');
  var lista = document.getElementById('tutor-msgs');
  var form = document.getElementById('tutor-form');
  var campo = document.getElementById('tutor-input');

  function salvar() {
    historico = historico.slice(-MAX_HISTORICO);
    try { sessionStorage.setItem(chaveHist, JSON.stringify(historico)); } catch (e) { /* ignora */ }
  }
  function rolar() { lista.scrollTop = lista.scrollHeight; }

  function linkAula(a) {
    var curso = a && obterCursoPorId(a[0]);
    var aula = curso && curso.aulas[a[1] - 1];
    if (!aula) return '';
    return '<br><a href="curso.html?id=' + curso.id + '" class="tutor-link">&#128216; Módulo ' + curso.id + ' &middot; Aula ' + a[1] + ' — ' + escaparTexto(aula.titulo) + '</a>';
  }
  function escaparTexto(t) {
    return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function adicionar(papel, texto, extra, classe) {
    var div = document.createElement('div');
    div.className = 'tutor-msg tutor-' + papel + (classe ? ' ' + classe : '');
    div.innerHTML = escaparTexto(texto).replace(/\n/g, '<br>') + (extra || '');
    lista.appendChild(div);
    rolar();
    return div;
  }

  function sugestoes() {
    var box = document.createElement('div');
    box.className = 'tutor-chips';
    SUGESTOES_ASSISTENTE.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tutor-chip'; b.textContent = s;
      b.addEventListener('click', function () { perguntar(s); });
      box.appendChild(b);
    });
    lista.appendChild(box);
    rolar();
  }

  function desenhar() {
    lista.innerHTML = '';
    var nome = sessao.nome.split(' ')[0];
    adicionar('assistant', 'Olá, ' + nome + '! Sou o Assistente de Estudos. Respondo dúvidas sobre o conteúdo do curso com base em materiais prontos (não sou uma IA generativa, então não tenho limites de uso). Escolha uma pergunta ou digite a sua:');
    sugestoes();
    historico.forEach(function (m) { adicionar(m.role, m.texto, m.role === 'assistant' ? linkAula(m.aula) : ''); });
  }

  function responder(pergunta) {
    if (ehSaudacao(pergunta)) return { texto: 'Olá! Posso explicar conceitos do curso, como escrever bons prompts, cuidados com dados de alunos, criação de atividades e muito mais. É só perguntar.', aula: null };
    var achados = buscar(pergunta);
    if (!achados.length) {
      return { texto: 'Não encontrei essa dúvida na minha base de estudos. Tente reformular com outras palavras (ex.: “prompt”, “LGPD”, “viés”, “plano de aula”) ou use os botões abaixo para perguntar a uma IA.', aula: null };
    }
    var melhor = achados[0].item, texto = melhor.r;
    if (achados[1]) texto += '\n\nVeja também: “' + achados[1].item.t + '”.';
    return { texto: texto, aula: melhor.a || null };
  }

  function perguntar(texto) {
    texto = String(texto || '').trim().slice(0, 300);
    if (!texto) return;
    historico.push({ role: 'user', texto: texto });
    adicionar('user', texto);
    var r = responder(texto);
    historico.push({ role: 'assistant', texto: r.texto, aula: r.aula });
    adicionar('assistant', r.texto, linkAula(r.aula));
    salvar();
  }

  /* ---------- Atalho para IA externa ---------- */
  function ultimaPergunta() {
    for (var i = historico.length - 1; i >= 0; i--) if (historico[i].role === 'user') return historico[i].texto;
    return '';
  }
  function copiar(texto) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(texto).then(function () { return true; }, function () { return false; });
    try {
      var t = document.createElement('textarea'); t.value = texto; document.body.appendChild(t); t.select();
      var ok = document.execCommand('copy'); t.remove(); return Promise.resolve(ok);
    } catch (e) { return Promise.resolve(false); }
  }
  function abrirIAExterna(qual) {
    var pergunta = ultimaPergunta();
    var contexto = 'Sou professor(a) estudando o curso EduIa sobre Inteligência Artificial na educação' +
      (cursoAtual ? ' (módulo: ' + cursoAtual.nome + ')' : '') + '. Responda em português, de forma didática e com exemplos para a sala de aula.';
    var prompt = contexto + ' ' + (pergunta ? 'Minha dúvida: ' + pergunta : 'Quero tirar uma dúvida sobre o conteúdo do curso.');
    var q = encodeURIComponent(prompt.slice(0, 1500));
    var url = { chatgpt: 'https://chatgpt.com/?q=' + q, claude: 'https://claude.ai/new?q=' + q, gemini: 'https://gemini.google.com/app' }[qual];
    copiar(prompt).then(function (copiou) {
      adicionar('assistant', 'Abri o ' + { chatgpt: 'ChatGPT', claude: 'Claude', gemini: 'Gemini' }[qual] + ' em uma nova aba (o site oficial não pode ser exibido dentro desta página). ' +
        (copiou ? 'Copiei a sua pergunta: se a caixa de texto abrir vazia, cole com Ctrl+V.' : 'Se a caixa de texto abrir vazia, digite sua pergunta lá.') +
        ' O uso segue as regras e limites do plano de cada serviço.', '', 'tutor-info');
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* ---------- Eventos ---------- */
  function alternarPainel(abrir) {
    painel.classList.toggle('hidden', !abrir);
    fab.classList.toggle('hidden', abrir);
    if (abrir) { rolar(); campo.focus(); }
  }
  fab.addEventListener('click', function () { alternarPainel(true); });
  document.getElementById('tutor-fechar').addEventListener('click', function () { alternarPainel(false); });
  document.getElementById('tutor-limpar').addEventListener('click', function () { historico = []; salvar(); desenhar(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = campo.value.trim();
    if (!t) return;
    campo.value = '';
    perguntar(t);
  });
  campo.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });
  Array.prototype.forEach.call(painel.querySelectorAll('[data-ia]'), function (b) {
    b.addEventListener('click', function () { abrirIAExterna(b.getAttribute('data-ia')); });
  });

  desenhar();
})();
