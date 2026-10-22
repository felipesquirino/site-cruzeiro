/* ============================================================
   EduIa — perfil.js
   Mostra os dados do usuário e permite editar o nome.
   O nome atualizado é salvo no localStorage (sessão e cadastro).
   ============================================================ */

/* ---------- Mostrar os dados do usuário na tela ---------- */
function carregarPerfil(sessao) {
  // Primeira letra do nome para o avatar
  var primeiraLetra = sessao.nome.charAt(0).toUpperCase();
  document.getElementById('profile-avatar').textContent = primeiraLetra;

  document.getElementById('profile-nome').textContent = sessao.nome;
  document.getElementById('profile-nome-valor').textContent = sessao.nome;
  document.getElementById('profile-email-valor').textContent = sessao.email;

  // Preenche o campo de edição com o nome atual
  document.getElementById('novo-nome').value = sessao.nome;
}

/* ---------- Configurar a edição do nome ---------- */
function configurarEdicaoNome(sessao) {
  var form = document.getElementById('form-editar-nome');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var erro = document.getElementById('perfil-error');
    var sucesso = document.getElementById('perfil-success');
    erro.textContent = '';
    sucesso.textContent = '';

    var novoNome = document.getElementById('novo-nome').value.trim();

    if (!novoNome) {
      erro.textContent = 'O nome não pode ser vazio.';
      return;
    }

    // Atualiza a sessão (usuário logado)
    atualizarSessao(novoNome);

    // Atualiza o nome na lista de usuários cadastrados
    var usuarios = JSON.parse(localStorage.getItem('eduia_usuarios') || '[]');
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === sessao.email) {
        usuarios[i].nome = novoNome;
        break;
      }
    }
    localStorage.setItem('eduia_usuarios', JSON.stringify(usuarios));

    // Atualiza a tela
    carregarPerfil({ nome: novoNome, email: sessao.email });
    sucesso.textContent = 'Nome atualizado com sucesso!';
  });
}
