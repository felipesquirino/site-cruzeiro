/* ============================================================
   EduIa — certificado.js
   Mostra o certificado final da formação.
   Só é liberado quando os 3 módulos estiverem concluídos.
   ============================================================ */

function carregarCertificado(sessao) {
  var divErro = document.getElementById('cert-error');
  var divConteudo = document.getElementById('cert-content');

  // Se ainda faltam módulos, mostra o andamento de cada um
  if (!todosModulosConcluidos(sessao.email)) {
    var itens = CURSOS.map(function (curso) {
      var feitas = obterAulasConcluidas(sessao.email, curso.id).length;
      var ok = moduloConcluido(sessao.email, curso);      // aulas + questionários
      return '<li>' + (ok ? '&#9989; ' : '&#9203; ') + '<strong>Módulo ' + curso.id + '</strong> — ' + curso.nome +
             ' (' + feitas + '/' + curso.aulas.length + ' aulas) ' +
             (ok ? '' : '<a href="curso.html?id=' + curso.id + '">Acessar</a>') + '</li>';
    }).join('');
    divErro.className = '';
    divErro.innerHTML =
      '<div class="alert alert-info">' +
        '<strong>Seu certificado será liberado ao concluir os 3 módulos.</strong>' +
        '<ul class="modulos-status">' + itens + '</ul>' +
      '</div>';
    return;
  }

  // Tudo concluído — mostra o certificado
  divConteudo.className = '';
  document.getElementById('cert-nome').textContent = sessao.nome;

  // Lista os 3 módulos no certificado
  document.getElementById('cert-modulos').innerHTML = CURSOS.map(function (curso) {
    return '<li><span class="cert-mod-num">Módulo ' + curso.id + '</span>' + curso.nome + '</li>';
  }).join('');

  // Data de conclusão (do último módulo)
  var ultimo = CURSOS[CURSOS.length - 1];
  var data = localStorage.getItem('eduia_concluido_' + sessao.email + '_' + ultimo.id);
  document.getElementById('cert-data').textContent = data || new Date().toLocaleDateString('pt-BR');

  // Carga horária = soma de todas as aulas dos 3 módulos
  document.getElementById('cert-carga').textContent = calcularCargaHorariaTotal();
}

/* ---------- Logo embutida (evita bloqueio de imagem ao gerar o PDF) ---------- */
var LOGO_DATA_URI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMmE2Y2M0O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxNjNmODA7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjIyIiBmaWxsPSJ1cmwoI2dyYWQpIi8+CiAgPHRleHQgeD0iNTAiIHk9IjQ0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkludGVyLCBTZWdvZSBVSSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgZm9udC13ZWlnaHQ9IjgwMCI+RWR1PC90ZXh0PgogIDx0ZXh0IHg9IjUwIiB5PSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FkYzhlYiIgZm9udC1mYW1pbHk9IkludGVyLCBTZWdvZSBVSSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgZm9udC13ZWlnaHQ9IjgwMCI+SWE8L3RleHQ+Cjwvc3ZnPgo=';

/* ---------- Gerar PDF e salvar automaticamente ---------- */
function gerarPDF() {
  var original = document.querySelector('.certificate');
  var btn = document.getElementById('btn-pdf');
  if (!original || typeof html2pdf === 'undefined') {
    alert('Não foi possível carregar o gerador de PDF. Verifique sua conexão com a internet.');
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Gerando PDF...';

  // Clona o certificado em tamanho fixo (A4 paisagem) fora da tela
  // O palco fica no canto (0,0) atrás da página: fora da tela o html2canvas desloca/corta o conteúdo
  var palco = document.createElement('div');
  palco.style.cssText = 'position:absolute;left:0;top:0;width:1123px;height:794px;overflow:hidden;z-index:-1;pointer-events:none;';
  var clone = original.cloneNode(true);
  clone.classList.add('cert-pdf');
  palco.appendChild(clone);
  document.body.appendChild(palco);

  var nome = document.getElementById('cert-nome').textContent.trim().replace(/\s+/g, '-');
  var opcoes = {
    margin: 0,
    filename: 'certificado-' + nome + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    // windowWidth/scroll fixos: o PDF não depende do tamanho da janela nem da rolagem (evita o layout "mobile" no PDF)
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', x: 0, y: 0, scrollX: 0, scrollY: 0, windowWidth: 1123, windowHeight: 794 },
    jsPDF: { unit: 'px', format: [1123, 794], orientation: 'landscape', hotfixes: ['px_scaling'] }
  };

  html2pdf().set(opcoes).from(clone).save().then(function () {
    document.body.removeChild(palco);
    btn.disabled = false;
    btn.innerHTML = '&#128196; Gerar PDF';
  }).catch(function () {
    document.body.removeChild(palco);
    btn.disabled = false;
    btn.innerHTML = '&#128196; Gerar PDF';
    alert('Erro ao gerar o PDF. Tente novamente.');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.cert-logo').forEach(function (img) { img.src = LOGO_DATA_URI; });
});
