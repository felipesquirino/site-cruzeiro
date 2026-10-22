/* ============================================================
   EduIa — curso.js
   Controla as aulas, o progresso e a conclusão dos cursos.
   Usa localStorage para salvar quais aulas foram concluídas.
   ============================================================ */

/* ---------- Lista de cursos (dados fixos) ----------
   Para trocar um vídeo: cole o link normal do YouTube em "video" (https://youtu.be/ID ou https://www.youtube.com/watch?v=ID)
   e ajuste "duracao" (em minutos) — a carga horária do certificado é a soma das durações. */
var CURSOS = [
  {
    id: 1,
    nome: 'Introdução à Inteligência Artificial na Educação',
    descricao: 'Conheça os conceitos básicos de Inteligência Artificial e suas possibilidades no contexto educacional.',
    aulas: [
      { titulo: 'O que é Inteligência Artificial?', video: 'https://youtu.be/p33lQqS1PnY', duracao: 12 },
      { titulo: 'Inteligência Artificial na Educação', video: 'https://youtu.be/VA10vefYQSI', duracao: 15 },
      { titulo: 'Cuidados no uso da Inteligência Artificial', video: 'https://youtu.be/xUtd63-jToU', duracao: 10 }
    ]
  },
  {
    id: 2,
    nome: 'IA Aplicada ao Ensino',
    descricao: 'Conheça formas de utilizar a Inteligência Artificial no planejamento e nas atividades educacionais.',
    aulas: [
      { titulo: 'IA no planejamento de aulas', video: 'https://youtu.be/DQbueJcbD3c', duracao: 14 },
      { titulo: 'Ferramentas de IA para professores', video: 'https://youtu.be/COLE_AQUI_O_ID_DO_VIDEO', duracao: 18 },
      { titulo: 'Aplicando a IA na prática', video: 'https://youtu.be/jgWLntXzDOU', duracao: 20 }
    ]
  },
  {
    id: 3,
    nome: 'Criação de Atividades com IA',
    descricao: 'Aprenda possibilidades de utilização da IA para criar atividades para seus alunos.',
    aulas: [
      { titulo: 'Criando atividades com IA', video: 'https://youtu.be/_cT0fcoCa94', duracao: 16 },
      { titulo: 'Avaliação de atividades geradas por IA', video: 'https://youtu.be/GsNPs7xPa58', duracao: 12 },
      { titulo: 'Boas práticas e ética', video: 'https://youtu.be/M275xXuqP2Y', duracao: 15 }
    ]
  }
];

/* ---------- Carga horária calculada pela duração (em minutos) das aulas ---------- */
function calcularCargaHoraria(curso) {
  var total = 0;
  curso.aulas.forEach(function (a) { total += a.duracao || 0; });
  var h = Math.floor(total / 60);
  var m = total % 60;
  if (h === 0) return m + ' minutos';
  if (m === 0) return h + (h === 1 ? ' hora' : ' horas');
  return h + 'h ' + m + 'min';
}

/* ---------- Carga horária total (soma dos 3 módulos) ---------- */
function calcularCargaHorariaTotal() {
  var total = 0;
  CURSOS.forEach(function (curso) {
    curso.aulas.forEach(function (a) { total += a.duracao || 0; });
  });
  var h = Math.floor(total / 60);
  var m = total % 60;
  if (h === 0) return m + ' minutos';
  if (m === 0) return h + (h === 1 ? ' hora' : ' horas');
  return h + 'h ' + m + 'min';
}

/* ---------- Player de vídeo (YouTube) ----------
   Erro 153 do YouTube = a página não enviou o endereço de origem (Referer). Correções aplicadas:
   (1) meta "referrer" no <head> de curso.html e referrerpolicy no iframe;
   (2) parâmetros origin e widget_referrer na URL do player (identificam o site);
   (3) a API do player avisa quando há erro: nesse caso o vídeo é trocado por um botão
       "Assistir no YouTube", então o aluno nunca fica com o player quebrado;
   (4) abrindo o .html direto do computador (file://) o YouTube nunca aceita o player:
       mostramos o botão desde o início. */
function idYoutube(url) {
  // aceita youtu.be/ID, youtube.com/watch?v=ID e youtube.com/embed/ID
  var m = /(?:youtu\.be\/|\/embed\/|[?&]v=)([\w-]{6,})/.exec(url || '');
  return m ? m[1] : '';
}

function htmlCartaoYoutube(id, texto) {
  return '<a class="video-externo" href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener noreferrer" ' +
         'style="background-image:url(https://i.ytimg.com/vi/' + id + '/hqdefault.jpg)"><span>' + texto + '</span></a>';
}

function htmlPlayerVideo(aula, numeroAula) {
  var id = idYoutube(aula.video);
  if (id.indexOf('COLE_AQUI') === 0) return '<div class="video-externo" style="background:#102e5e"><span>Vídeo ainda não configurado.<br>Troque o link em js/curso.js.</span></div>';
  if (!id) return '<iframe src="' + aula.video + '" title="Aula ' + numeroAula + '" allowfullscreen></iframe>';
  var origem = window.location.origin;
  if (window.location.protocol === 'file:' || !origem || origem === 'null') return htmlCartaoYoutube(id, '&#9654; Assistir no YouTube');
  var src = 'https://www.youtube.com/embed/' + id + '?enablejsapi=1&rel=0&origin=' + encodeURIComponent(origem) +
            '&widget_referrer=' + encodeURIComponent(origem);
  return '<iframe id="yt-player-' + numeroAula + '" data-yt-id="' + id + '" src="' + src + '" title="Aula ' + numeroAula + '" loading="lazy" ' +
         'referrerpolicy="strict-origin-when-cross-origin" ' +
         'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
}

function htmlAvisoVideo(aula) {
  var id = idYoutube(aula.video);
  if (!id || id.indexOf('COLE_AQUI') === 0) return '';
  var link = '<a href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener noreferrer">Assistir no YouTube</a>';
  if (window.location.protocol === 'file:') {
    return '<p class="video-aviso">Você abriu o arquivo direto no computador, e nesse modo o YouTube não permite o player aqui. ' +
           'Abra o site por um endereço http (Live Server ou o site publicado) para assistir dentro da plataforma, ou ' + link + '.</p>';
  }
  return '<p class="video-aviso">O vídeo não carregou? ' + link + '.</p>';
}

/* Liga a API do YouTube aos players já exibidos para detectar erros (ex.: 153) e mostrar a alternativa */
function prepararPlayersYoutube() {
  var players = document.querySelectorAll('iframe[data-yt-id]');
  if (!players.length) return;

  function ligar() {
    Array.prototype.forEach.call(document.querySelectorAll('iframe[data-yt-id]'), function (iframe) {
      if (iframe.getAttribute('data-yt-ligado')) return;
      iframe.setAttribute('data-yt-ligado', '1');
      try {
        new window.YT.Player(iframe.id, { events: { onError: function () {
          var caixa = iframe.parentNode;
          if (caixa && !caixa.querySelector('.video-externo')) {
            caixa.insertAdjacentHTML('beforeend', htmlCartaoYoutube(iframe.getAttribute('data-yt-id'), 'O player não pôde ser exibido aqui.<br>&#9654; Assistir no YouTube'));
          }
        } } });
      } catch (e) { /* sem API: o link abaixo do vídeo continua disponível */ }
    });
  }

  if (window.YT && window.YT.Player) { ligar(); return; }
  var anterior = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = function () { if (typeof anterior === 'function') anterior(); ligar(); };
  if (!document.getElementById('yt-iframe-api')) {
    var sc = document.createElement('script');
    sc.id = 'yt-iframe-api'; sc.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(sc);
  }
}

/* ---------- Chave do localStorage para aulas concluídas ---------- */
function chaveProgresso(email, cursoId) {
  return 'eduia_progresso_' + email + '_' + cursoId;
}

/* ---------- Obter aulas concluídas de um curso ---------- */
function obterAulasConcluidas(email, cursoId) {
  var dados = localStorage.getItem(chaveProgresso(email, cursoId));
  return dados ? JSON.parse(dados) : [];
}

/* ---------- Salvar aulas concluídas ---------- */
function salvarAulasConcluidas(email, cursoId, lista) {
  localStorage.setItem(chaveProgresso(email, cursoId), JSON.stringify(lista));
}

/* ============================================================
   Questionário do módulo e bloqueio de fases (v8)
   ============================================================
   Regras:
   - Dentro do módulo, o vídeo seguinte só abre depois que o anterior for marcado como concluído.
   - Depois de marcar os 3 vídeos, o aluno recebe o Guia de Revisão (PDF) e, logo em seguida, o questionário do módulo.
   - O questionário tem 8 perguntas e é preciso acertar no mínimo 5 (veja js/quiz-modulos.js).
   - O próximo módulo só é liberado com o questionário do módulo anterior aprovado. */
function chaveQuizModulo(email, cursoId) {
  return 'eduia_quiz_modulo_' + email + '_' + cursoId;
}
function obterQuizModulo(email, cursoId) {
  try {
    return JSON.parse(localStorage.getItem(chaveQuizModulo(email, cursoId))) || { tentativas: [], ultima: null };
  } catch (e) { return { tentativas: [], ultima: null }; }
}
function quizModuloAprovado(email, cursoId) {
  return obterQuizModulo(email, cursoId).tentativas.some(function (t) { return t.aprovado; });
}
/* Todos os vídeos do módulo marcados como concluídos? (libera o Guia de Revisão e o questionário) */
function todasAulasConcluidas(email, curso) {
  var feitas = obterAulasConcluidas(email, curso.id);
  return curso.aulas.every(function (a, i) { return feitas.indexOf(i + 1) !== -1; });
}
/* A aula 1 está sempre liberada; as demais exigem apenas a aula anterior marcada como concluída */
function aulaLiberada(email, cursoId, numeroAula) {
  if (numeroAula <= 1) return true;
  return obterAulasConcluidas(email, cursoId).indexOf(numeroAula - 1) !== -1;
}

/* ---------- Verifica se um módulo está 100% concluído (3 vídeos + questionário aprovado) ---------- */
function moduloConcluido(email, curso) {
  return todasAulasConcluidas(email, curso) && quizModuloAprovado(email, curso.id);
}

/* ---------- Verifica se os 3 módulos estão concluídos ---------- */
function todosModulosConcluidos(email) {
  return CURSOS.every(function (curso) { return moduloConcluido(email, curso); });
}

/* ---------- Obter um curso pelo ID ---------- */
function obterCursoPorId(id) {
  return CURSOS.find(function (c) { return c.id === id; });
}

/* ---------- Carregar a página do curso ---------- */
function carregarCurso(email) {
  // Pega o parâmetro "id" da URL
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id'));
  var curso = obterCursoPorId(id);

  if (!curso) {
    document.getElementById('course-header').innerHTML =
      '<div class="alert alert-error">Curso não encontrado. <a href="cursos.html">Voltar para a lista de cursos</a></div>';
    return;
  }

  // Módulo bloqueado: o módulo anterior precisa estar concluído (3 vídeos + questionário aprovado)
  var anterior = obterCursoPorId(curso.id - 1);
  if (anterior && !moduloConcluido(email, anterior)) {
    document.getElementById('course-header').innerHTML =
      '<span class="module-tag">Módulo ' + curso.id + '</span>' +
      '<h1>' + curso.nome + '</h1>' +
      '<div class="alert alert-info mt-16"><strong>Módulo bloqueado.</strong> Conclua as aulas e seja aprovado(a) no questionário do Módulo ' + anterior.id +
      ' para liberar este módulo. <a href="curso.html?id=' + anterior.id + '">Ir para o Módulo ' + anterior.id + '</a></div>';
    document.getElementById('lessons-container').innerHTML = '';
    return;
  }

  // Monta o cabeçalho do curso
  var concluidas = obterAulasConcluidas(email, curso.id);
  var progresso = Math.round((concluidas.length / curso.aulas.length) * 100);

  document.getElementById('course-header').innerHTML =
    '<span class="module-tag">Módulo ' + curso.id + '</span>' +
    '<h1>' + curso.nome + '</h1>' +
    '<p class="subtitle mb-24">' + curso.descricao + '</p>' +
    '<div class="course-progress-wrap">' +
      '<div class="course-progress-bar">' +
        '<div class="course-progress-fill" id="progress-fill" style="width:' + progresso + '%"></div>' +
      '</div>' +
      '<p class="course-progress-label" id="progress-label">' + concluidas.length + ' de ' + curso.aulas.length + ' aulas concluídas (' + progresso + '%)</p>' +
    '</div>';

  // Monta a lista de aulas
  var html = '';
  curso.aulas.forEach(function (aula, index) {
    var numeroAula = index + 1;
    var concluida = concluidas.indexOf(numeroAula) !== -1;

    // Aula bloqueada: a aula anterior precisa estar marcada como concluída
    if (!aulaLiberada(email, curso.id, numeroAula)) {
      html +=
        '<div class="lesson lesson-locked" id="lesson-' + numeroAula + '">' +
          '<div class="lesson-header">' +
            '<div class="lesson-title"><span class="lesson-number">&#128274;</span><span>Aula ' + numeroAula + ' — ' + aula.titulo + '</span></div>' +
            '<span class="lesson-lock-tag">Bloqueada</span>' +
          '</div>' +
          '<p class="lesson-lock-msg">Marque a Aula ' + (numeroAula - 1) + ' como concluída para liberar esta aula.</p>' +
        '</div>';
      return;
    }
    var classeDone = concluida ? 'done' : '';
    var textoBotao = concluida ? 'Aula concluída' : 'Marcar aula como concluída';
    var classeBotao = concluida ? 'btn-success' : 'btn-primary';

    html +=
      '<div class="lesson" id="lesson-' + numeroAula + '">' +
        '<div class="lesson-header" onclick="alternarAula(' + numeroAula + ')">' +
          '<div class="lesson-title">' +
            '<span class="lesson-number ' + classeDone + '">' + numeroAula + '</span>' +
            '<span>Aula ' + numeroAula + ' — ' + aula.titulo + '</span>' +
          '</div>' +
          '<span class="lesson-toggle">&#9662;</span>' +
        '</div>' +
        '<div class="lesson-body">' +
          '<div class="lesson-video">' + htmlPlayerVideo(aula, numeroAula) + '</div>' +
          htmlAvisoVideo(aula) +
          '<button class="btn ' + classeBotao + ' lesson-done-btn" id="btn-aula-' + numeroAula + '" onclick="marcarAula(' + numeroAula + ')">' + textoBotao + '</button>' +
        '</div>' +
      '</div>';
  });
  html += htmlFimDoModulo(email, curso);
  document.getElementById('lessons-container').innerHTML = html;
  prepararPlayersYoutube();

  // Verifica se o curso foi concluído
  verificarConclusao(email, curso);
}

/* ---------- Fim do módulo: Guia de Revisão (PDF) + questionário ---------- */
function htmlFimDoModulo(email, curso) {
  var cfg = (typeof QUIZ_MODULOS !== 'undefined') ? QUIZ_MODULOS[curso.id] : null;
  if (!cfg) return '';
  var liberado = todasAulasConcluidas(email, curso);
  var reg = obterQuizModulo(email, curso.id);
  var aprovado = quizModuloAprovado(email, curso.id);

  if (!liberado) {
    return '<div class="lesson lesson-locked" id="fim-modulo">' +
      '<div class="lesson-header"><div class="lesson-title"><span class="lesson-number">&#128274;</span><span>Guia de Revisão e Questionário do Módulo ' + curso.id + '</span></div>' +
      '<span class="lesson-lock-tag">Bloqueado</span></div>' +
      '<p class="lesson-lock-msg">Marque as ' + curso.aulas.length + ' aulas como concluídas para liberar o Guia de Revisão (PDF) e o questionário do módulo.</p></div>';
  }

  var badge;
  if (aprovado) {
    var melhor = Math.max.apply(null, reg.tentativas.map(function (t) { return t.acertos; }));
    badge = '<span class="quiz-badge quiz-badge-ok">Aprovado(a) &middot; Melhor resultado: ' + melhor + ' de ' + TOTAL_PERGUNTAS_MODULO + ' acertos</span>';
  } else if (reg.tentativas.length) {
    var ult = reg.tentativas[reg.tentativas.length - 1];
    badge = '<span class="quiz-badge quiz-badge-revisar">Último resultado: ' + ult.acertos + ' de ' + TOTAL_PERGUNTAS_MODULO + ' acertos &middot; é preciso acertar no mínimo ' + NOTA_MINIMA_MODULO + '</span>';
  } else {
    badge = '<span class="quiz-badge quiz-badge-revisar">Acerte no mínimo ' + NOTA_MINIMA_MODULO + ' de ' + TOTAL_PERGUNTAS_MODULO + ' perguntas para liberar o próximo módulo</span>';
  }

  return '<div class="modulo-fim" id="fim-modulo">' +
    '<div class="card modulo-passo">' +
      '<span class="modulo-passo-num">1</span>' +
      '<div class="modulo-passo-txt">' +
        '<h3>&#128196; ' + cfg.pdfNome + '</h3>' +
        '<p class="muted">Resumo do que foi visto nos 3 vídeos. Leia antes de responder ao questionário: ele ajuda nas respostas.</p>' +
        '<div class="quiz-acoes" style="margin:12px 0 0">' +
          '<a class="btn btn-primary" href="' + cfg.pdf + '" target="_blank" rel="noopener">Abrir o PDF</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="card modulo-passo">' +
      '<span class="modulo-passo-num">2</span>' +
      '<div class="modulo-passo-txt">' +
        '<h3>&#128221; Questionário do Módulo ' + curso.id + '</h3>' +
        '<p class="muted">' + TOTAL_PERGUNTAS_MODULO + ' perguntas sobre os 3 vídeos. É preciso acertar no mínimo ' + NOTA_MINIMA_MODULO + ' para seguir adiante.</p>' +
        '<div class="avaliacao-area" style="border-top:0;margin-top:8px;padding-top:0;align-items:flex-start">' + badge +
          '<a class="btn btn-primary" href="avaliacao.html?curso=' + curso.id + '">' + (reg.tentativas.length ? 'Ver / refazer questionário' : 'Responder questionário') + '</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

/* ---------- Abrir/fechar aula (acordeão) ---------- */
function alternarAula(numero) {
  var lesson = document.getElementById('lesson-' + numero);
  if (lesson) lesson.classList.toggle('open');
}

/* ---------- Marcar aula como concluída ---------- */
function marcarAula(numero) {
  var sessao = obterSessao();
  if (!sessao) return;

  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id'));
  var curso = obterCursoPorId(id);
  if (!curso) return;

  var concluidas = obterAulasConcluidas(sessao.email, curso.id);

  if (concluidas.indexOf(numero) === -1) {
    // Marca como concluída
    concluidas.push(numero);
    salvarAulasConcluidas(sessao.email, curso.id, concluidas);
  } else {
    // Desmarca se clicar de novo
    concluidas = concluidas.filter(function (n) { return n !== numero; });
    salvarAulasConcluidas(sessao.email, curso.id, concluidas);
  }

  // Recarrega a página para atualizar a interface
  carregarCurso(sessao.email);
  // Mantém a aula aberta
  alternarAula(numero);
}

/* ---------- Verificar conclusão do curso ---------- */
function verificarConclusao(email, curso) {
  var completo = moduloConcluido(email, curso);       // aulas + questionários
  var div = document.getElementById('complete-message');

  if (completo) {
    // Salva a data de conclusão do módulo
    var chaveConclusao = 'eduia_concluido_' + email + '_' + curso.id;
    if (!localStorage.getItem(chaveConclusao)) {
      localStorage.setItem(chaveConclusao, new Date().toLocaleDateString('pt-BR'));
    }

    div.className = '';
    var ultimo = curso.id === CURSOS.length;
    if (!ultimo) {
      // Módulos 1 e 2: parabéns pelo módulo + botão para o próximo
      div.innerHTML =
        '<div class="course-complete-msg">' +
          '<h3>&#127881; Parabéns! Você concluiu o Módulo ' + curso.id + '!</h3>' +
          '<p>Você concluiu os 3 vídeos e foi aprovado(a) no questionário de \"' + curso.nome + '\". Continue sua jornada.</p>' +
          '<div class="course-complete-actions">' +
            '<a href="curso.html?id=' + (curso.id + 1) + '" class="btn btn-success">Seguir para o Módulo ' + (curso.id + 1) + ' &#10140;</a>' +
          '</div>' +
        '</div>';
    } else {
      // Módulo 3: parabéns especial pelo curso completo
      div.innerHTML =
        '<div class="course-final-msg">' +
          '<div class="final-emoji">&#127942;</div>' +
          '<h3>Parabéns! Você concluiu toda a formação!</h3>' +
          '<p>Você finalizou os 3 módulos da plataforma EduIa e agora está pronto(a) para levar a Inteligência Artificial para a sua sala de aula com segurança e criatividade. Seu certificado e o plano de aula já estão liberados.</p>' +
          '<div class="course-complete-actions">' +
            '<a href="certificado.html" class="btn btn-gold">&#127891; Gerar meu certificado</a>' +
            '<a href="plano-aula.html" class="btn btn-light">&#128221; Acessar plano de aula</a>' +
          '</div>' +
        '</div>';
    }
  } else {
    div.className = 'hidden';
    div.innerHTML = '';
  }
}

/* ---------- Mostrar curso em andamento na página inicial ---------- */
function mostrarCursoAndamento(email) {
  var div = document.getElementById('curso-andamento');
  if (!div) return;

  // Procura o primeiro curso que tenha progresso > 0 e < 100%
  var cursoEncontrado = null;
  var progressoEncontrado = 0;
  var aulasFeitas = 0;

  CURSOS.forEach(function (curso) {
    var concluidas = obterAulasConcluidas(email, curso.id);
    var pct = Math.round((concluidas.length / curso.aulas.length) * 100);
    if (pct > 0 && pct < 100 && !cursoEncontrado) {
      cursoEncontrado = curso;
      progressoEncontrado = pct;
      aulasFeitas = concluidas.length;
    }
  });

  // Se nenhum está em andamento, procura o próximo módulo que ainda não foi concluído
  if (!cursoEncontrado) {
    var proximo = CURSOS.filter(function (curso) { return !moduloConcluido(email, curso); })[0];
    if (!proximo) {
      div.innerHTML =
        '<div class="progress-card">' +
          '<div class="card-icon">&#127942;</div>' +
          '<div class="progress-bar-wrap">' +
            '<h3>Você concluiu toda a formação!</h3>' +
            '<p class="progress-text">Seu certificado e o plano de aula estão liberados.</p>' +
          '</div>' +
          '<a href="certificado.html" class="btn btn-primary">Ver certificado</a>' +
        '</div>';
      return;
    }
    div.innerHTML =
      '<div class="progress-card">' +
        '<div class="card-icon">&#128218;</div>' +
        '<div class="progress-bar-wrap">' +
          '<h3>Módulo ' + proximo.id + ' — ' + proximo.nome + '</h3>' +
          '<p class="progress-text">' + (proximo.id === 1 ? 'Você ainda não começou nenhum módulo. Que tal começar agora?' : 'Seu próximo módulo está esperando por você.') + '</p>' +
        '</div>' +
        '<a href="curso.html?id=' + proximo.id + '" class="btn btn-primary">' + (proximo.id === 1 ? 'Começar agora' : 'Continuar') + '</a>' +
      '</div>';
    return;
  }

  div.innerHTML =
    '<div class="progress-card">' +
      '<div class="card-icon">&#129302;</div>' +
      '<div class="progress-bar-wrap">' +
        '<h3>Módulo ' + cursoEncontrado.id + ' — ' + cursoEncontrado.nome + '</h3>' +
        '<p class="progress-text">' + aulasFeitas + ' de ' + cursoEncontrado.aulas.length + ' aulas concluídas</p>' +
        '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + progressoEncontrado + '%"></div></div>' +
      '</div>' +
      '<a href="curso.html?id=' + cursoEncontrado.id + '" class="btn btn-primary">Continuar</a>' +
    '</div>';
}
