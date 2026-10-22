/* ============================================================
   EduIa — avaliacao.js
   Questionário FINAL do módulo (avaliacao.html?curso=N).
   - 8 perguntas objetivas sobre os 3 vídeos do módulo (js/quiz-modulos.js).
   - É preciso responder TODAS as perguntas para enviar (se faltar alguma, o site avisa quantas faltam).
   - Para passar é preciso acertar no mínimo 5 de 8. Aprovado = próximo módulo liberado.
   - Tentativas e resultados ficam no localStorage (apenas neste navegador).
   Requer: script.js, curso.js (regras e armazenamento) e quiz-modulos.js.
   ============================================================ */

function escaparHtml(txt) {
  return String(txt == null ? '' : txt).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ---------- Armazenamento local ---------- */
function salvarTentativaModulo(email, cursoId, resultado) {
  var reg = obterQuizModulo(email, cursoId);
  reg.tentativas.push({ data: new Date().toLocaleString('pt-BR'), acertos: resultado.acertos, aprovado: resultado.aprovado });
  reg.ultima = resultado;
  localStorage.setItem(chaveQuizModulo(email, cursoId), JSON.stringify(reg));
}

var AV = { sessao: null, curso: null, cfg: null, prova: null };
var LETRAS = ['A', 'B', 'C', 'D'];

function raizAv() { return document.getElementById('avaliacao-root'); }

function embaralhar(lista) {
  var a = lista.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function iniciarPaginaAvaliacao(sessao) {
  AV.sessao = sessao;
  var params = new URLSearchParams(window.location.search);
  AV.curso = obterCursoPorId(parseInt(params.get('curso')));
  AV.cfg = AV.curso && QUIZ_MODULOS[AV.curso.id];

  if (!AV.cfg) {
    raizAv().innerHTML = '<div class="alert alert-error">Questionário não encontrado. <a href="cursos.html">Voltar para os cursos</a></div>';
    return;
  }
  if (!todasAulasConcluidas(sessao.email, AV.curso)) {
    raizAv().innerHTML =
      '<div class="alert alert-info"><strong>Questionário bloqueado.</strong> Marque as ' + AV.curso.aulas.length + ' aulas do módulo como concluídas para liberá-lo. ' +
      '<a href="curso.html?id=' + AV.curso.id + '">Ir para o módulo</a></div>';
    return;
  }
  mostrarIntro();
}

function cabecalhoAv() {
  return '<div class="course-header">' +
    '<span class="module-tag">Módulo ' + AV.curso.id + '</span>' +
    '<h1>Questionário do Módulo ' + AV.curso.id + '</h1>' +
    '<p class="subtitle">' + escaparHtml(AV.curso.nome) + '</p></div>';
}

function mostrarIntro() {
  var reg = obterQuizModulo(AV.sessao.email, AV.curso.id);
  var aprovado = quizModuloAprovado(AV.sessao.email, AV.curso.id);
  var proximo = obterCursoPorId(AV.curso.id + 1);
  var html = cabecalhoAv() +
    '<div class="card">' +
      '<h3 class="mb-8">Como funciona</h3>' +
      '<ul class="quiz-lista">' +
        '<li>São <strong>' + TOTAL_PERGUNTAS_MODULO + ' perguntas</strong> sobre os 3 vídeos do módulo. O <a href="' + AV.cfg.pdf + '" target="_blank" rel="noopener">Guia de Revisão (PDF)</a> ajuda nas respostas.</li>' +
        '<li>Responda <strong>todas</strong> as perguntas para enviar. Se faltar alguma, o site avisa quantas faltam.</li>' +
        '<li>Para passar, é preciso acertar <strong>no mínimo ' + NOTA_MINIMA_MODULO + ' de ' + TOTAL_PERGUNTAS_MODULO + '</strong>.</li>' +
        '<li>' + (proximo ? 'Passando, o <strong>Módulo ' + proximo.id + '</strong> é liberado.' : 'Passando, você conclui a formação e libera o certificado e o plano de aula.') + ' Se não passar, você pode tentar quantas vezes quiser.</li>' +
        '<li>Tentativas até agora: ' + reg.tentativas.length + '.</li>' +
      '</ul>' +
      '<div class="quiz-acoes">' +
        '<button class="btn btn-primary" id="btn-iniciar">' + (reg.tentativas.length ? 'Refazer questionário' : 'Iniciar questionário') + '</button>' +
        '<a class="btn btn-outline" href="' + AV.cfg.pdf + '" target="_blank" rel="noopener">Abrir o Guia de Revisão</a>' +
        '<a class="btn btn-outline" href="curso.html?id=' + AV.curso.id + '">Voltar ao módulo</a>' +
      '</div>' +
    '</div>';
  raizAv().innerHTML = html;

  if (reg.ultima) {
    var box = document.createElement('div');
    box.className = 'mt-24';
    box.innerHTML = '<h2 class="mb-16">Último resultado</h2>' + htmlResultado(reg.ultima, false);
    raizAv().appendChild(box);
  }
  document.getElementById('btn-iniciar').addEventListener('click', carregarProva);
}

/* ---------- Prova: perguntas na ordem do banco, alternativas embaralhadas ---------- */
function carregarProva() {
  AV.prova = AV.cfg.questoes.map(function (q, i) {
    var ordem = embaralhar([0, 1, 2, 3]);                       // ordem nova das alternativas
    return {
      id: 'q' + (i + 1), aula: q.aula, enunciado: q.enunciado, explicacao: q.explicacao,
      alternativas: ordem.map(function (o) { return q.alternativas[o]; }),
      corretaPos: ordem.indexOf(q.correta)
    };
  });
  desenharProva();
}

function desenharProva() {
  var html = cabecalhoAv() + '<form id="quiz-form" novalidate>';
  AV.prova.forEach(function (q, i) {
    html += '<div class="card quiz-q" id="bloco-' + q.id + '">' +
      '<div class="quiz-q-topo"><span class="quiz-nivel">Pergunta ' + (i + 1) + ' de ' + AV.prova.length + '</span></div>' +
      '<h3 class="quiz-enun">' + escaparHtml(q.enunciado) + '</h3>';
    q.alternativas.forEach(function (alt, pos) {
      html += '<label class="quiz-alt"><input type="radio" name="' + q.id + '" value="' + pos + '" />' +
              '<span>' + LETRAS[pos] + ') ' + escaparHtml(alt) + '</span></label>';
    });
    html += '</div>';
  });
  html += '<div id="quiz-erro"></div>' +
    '<div class="quiz-acoes"><button type="submit" class="btn btn-primary" id="btn-enviar">Enviar respostas</button>' +
    '<a class="btn btn-outline" href="curso.html?id=' + AV.curso.id + '">Sair sem enviar</a></div></form>';
  raizAv().innerHTML = html;

  document.getElementById('quiz-form').addEventListener('submit', enviarRespostas);
  Array.prototype.forEach.call(document.querySelectorAll('.quiz-q input'), function (inp) {
    inp.addEventListener('change', function () { document.getElementById('bloco-' + inp.name).classList.remove('quiz-pendente'); });
  });
  window.scrollTo(0, 0);
}

/* ---------- Enviar (todas as perguntas são obrigatórias) ---------- */
function enviarRespostas(e) {
  e.preventDefault();
  var respostas = {}, faltam = [];
  AV.prova.forEach(function (q) {
    var marcado = document.querySelector('input[name="' + q.id + '"]:checked');
    respostas[q.id] = marcado ? parseInt(marcado.value) : null;
    document.getElementById('bloco-' + q.id).classList.toggle('quiz-pendente', !marcado);
    if (!marcado) faltam.push(q.id);
  });
  if (faltam.length) {
    var msg = faltam.length === 1 ? 'falta 1 pergunta' : 'faltam ' + faltam.length + ' perguntas';
    document.getElementById('quiz-erro').innerHTML = '<div class="alert alert-error mt-16">Responda todas as perguntas para concluir o questionário (' + msg + ').</div>';
    document.getElementById('bloco-' + faltam[0]).scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  var acertos = 0, revisar = [];
  var questoes = AV.prova.map(function (q) {
    var ok = respostas[q.id] === q.corretaPos;
    if (ok) acertos++; else if (revisar.indexOf(q.aula) === -1) revisar.push(q.aula);
    return { enunciado: q.enunciado, alternativas: q.alternativas, corretaPos: q.corretaPos, respostaPos: respostas[q.id],
             acertou: ok, explicacao: q.explicacao, aula: q.aula };
  });
  revisar.sort();
  var resultado = { curso: AV.curso.id, acertos: acertos, total: AV.prova.length, minimo: NOTA_MINIMA_MODULO,
                    aprovado: acertos >= NOTA_MINIMA_MODULO, revisar: revisar, questoes: questoes };
  salvarTentativaModulo(AV.sessao.email, AV.curso.id, resultado);
  raizAv().innerHTML = cabecalhoAv() + htmlResultado(resultado, true);
  var again = document.getElementById('btn-voltar-intro');
  if (again) again.addEventListener('click', mostrarIntro);
  window.scrollTo(0, 0);
}

/* ---------- Resultado ---------- */
function htmlResultado(r, comAcoes) {
  var pct = Math.round((r.acertos / r.total) * 100);
  var proximo = obterCursoPorId(AV.curso.id + 1);
  var html =
    '<div class="card quiz-resumo ' + (r.aprovado ? 'quiz-resumo-ok' : 'quiz-resumo-revisar') + '">' +
      '<div class="quiz-nota">' + r.acertos + '<small> / ' + r.total + ' acertos</small></div>' +
      '<div class="quiz-status">' + (r.aprovado ? '&#9989; Aprovado(a)!' : '&#128214; Você precisa de no mínimo ' + r.minimo + ' acertos. Revise o Guia e tente novamente.') + '</div>' +
      '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + pct + '%"></div></div>' +
    '</div>';

  if (comAcoes) {
    html += r.aprovado
      ? '<div class="alert alert-success mt-16"><strong>Parabéns!</strong> ' + (proximo ? 'O Módulo ' + proximo.id + ' foi liberado.' : 'Você concluiu os 3 módulos. Seu certificado e o plano de aula foram liberados.') + '</div>'
      : '<div class="alert alert-info mt-16">Não foi dessa vez. Releia o <a href="' + AV.cfg.pdf + '" target="_blank" rel="noopener">Guia de Revisão</a> e refaça o questionário quando quiser.</div>';
  }

  if (r.revisar.length) {
    html += '<div class="alert alert-info mt-16"><strong>Sugestão de revisão:</strong> reveja ' +
      r.revisar.map(function (n) { return 'o vídeo ' + n + ' (' + escaparHtml(AV.curso.aulas[n - 1].titulo) + ')'; }).join('; ') +
      '. <a href="curso.html?id=' + AV.curso.id + '">Voltar aos vídeos</a></div>';
  }

  html += '<h2 class="mt-24 mb-16">Correção detalhada</h2>';
  r.questoes.forEach(function (q, i) { html += htmlQuestaoResultado(q, i + 1); });

  if (comAcoes) {
    html += '<div class="quiz-acoes">' +
      '<a class="btn btn-primary" href="' + (r.aprovado && proximo ? 'curso.html?id=' + proximo.id : r.aprovado ? 'certificado.html' : 'curso.html?id=' + AV.curso.id) + '">' +
        (r.aprovado ? (proximo ? 'Ir para o Módulo ' + proximo.id : 'Ver certificado') : 'Voltar ao módulo') + '</a>' +
      (r.aprovado ? '' : '<button class="btn btn-outline" id="btn-voltar-intro">Refazer questionário</button>') +
      '</div>';
  }
  return html;
}

function htmlQuestaoResultado(q, num) {
  var html = '<div class="card quiz-q ' + (q.acertou ? 'quiz-ok' : 'quiz-erro') + '">' +
    '<div class="quiz-q-topo"><span class="quiz-nivel">Pergunta ' + num + '</span>' +
    '<span class="quiz-pts">' + (q.acertou ? 'Correta' : (q.respostaPos == null ? 'Não respondida' : 'Incorreta')) + '</span></div>' +
    '<h3 class="quiz-enun">' + escaparHtml(q.enunciado) + '</h3>';
  q.alternativas.forEach(function (alt, pos) {
    var marca = '', c = '';
    if (pos === q.corretaPos) { marca = ' &#10003; resposta correta'; c = 'quiz-alt-certa'; }
    if (pos === q.respostaPos && pos !== q.corretaPos) { marca = ' &#10007; sua resposta'; c = 'quiz-alt-errada'; }
    if (pos === q.respostaPos && pos === q.corretaPos) marca = ' &#10003; sua resposta (correta)';
    html += '<div class="quiz-alt-res ' + c + '">' + LETRAS[pos] + ') ' + escaparHtml(alt) + '<em>' + marca + '</em></div>';
  });
  html += '<p class="quiz-expl"><strong>Explicação:</strong> ' + escaparHtml(q.explicacao) + '</p>';
  return html + '</div>';
}
