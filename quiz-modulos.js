/* ============================================================
   EduIa — js/quiz-modulos.js
   Questionário FINAL de cada módulo: 8 perguntas objetivas sobre os 3 vídeos do módulo,
   com ênfase no Guia de Revisão (PDF). Para passar é preciso acertar no mínimo 5.
   Tudo é predefinido: sem IA e sem servidor. A correção é automática (no avaliacao.js).

   COMO EDITAR UMA PERGUNTA
   - enunciado: texto da pergunta
   - alternativas: sempre 4 opções (a ordem é embaralhada a cada tentativa)
   - correta: posição da alternativa certa dentro da lista (0 = primeira, 1 = segunda, 2 = terceira, 3 = quarta)
   - aula: número do vídeo (1 a 3) que o aluno deve rever se errar
   - explicacao: aparece na correção

   ATENÇÃO: o gabarito fica no navegador; quem abrir as ferramentas de desenvolvedor consegue ler.
   ============================================================ */

var NOTA_MINIMA_MODULO = 5;   // acertos mínimos para passar
var TOTAL_PERGUNTAS_MODULO = 8;

var QUIZ_MODULOS = {

  /* ---------------- MÓDULO 1 ---------------- */
  1: {
    pdf: 'pdf/guia-revisao-modulo-1.pdf',
    pdfNome: 'Guia de Revisão do Módulo 1 — Fundamentos da IA',
    questoes: [
      { aula: 1, enunciado: 'Qual alternativa descreve melhor o que é Inteligência Artificial?',
        alternativas: ['Máquinas conscientes que pensam e sentem como as pessoas.', 'Qualquer programa de computador, não importa o que ele faça.',
          'Sistemas de computador que executam tarefas associadas à inteligência humana, como reconhecer padrões e compreender a linguagem.', 'Robôs físicos que substituem completamente os professores.'],
        correta: 2, explicacao: 'IA reúne sistemas que realizam tarefas normalmente associadas à inteligência humana. Hoje esses sistemas não têm consciência nem sentimentos.' },
      { aula: 1, enunciado: 'Sobre a presença da IA na nossa rotina, é correto afirmar que:',
        alternativas: ['Ela só passou a existir com os chatbots atuais.', 'Ela já está no dia a dia há bastante tempo, como nas recomendações de vídeos e músicas, muitas vezes sem percebermos.',
          'Ela só é usada em laboratórios e grandes empresas.', 'Ela só funciona quando o usuário sabe programar.'],
        correta: 1, explicacao: 'A IA já aparece em recomendações, assistentes de voz, corretores de texto e filtros de spam, mesmo quando não notamos.' },
      { aula: 1, enunciado: 'O que mudou nos últimos anos em relação à Inteligência Artificial?',
        alternativas: ['O conceito de IA foi inventado agora.', 'A IA passou a ter consciência.', 'As ferramentas deixaram de precisar de dados.',
          'As ferramentas se popularizaram e ficaram muito mais fáceis de acessar, embora a ideia de IA seja antiga.'],
        correta: 3, explicacao: 'A ideia de IA existe há muito tempo. A novidade recente é a popularização e a facilidade de acesso às ferramentas.' },
      { aula: 2, enunciado: 'Na educação, o que faz um tutor inteligente?',
        alternativas: ['Responde às dúvidas dos alunos e ajuda no acompanhamento dos estudos.', 'Dá aula no lugar do professor, sem supervisão.',
          'Aplica provas e decide sozinho quem é aprovado.', 'Substitui o material didático da escola.'],
        correta: 0, explicacao: 'Tutores inteligentes tiram dúvidas dos alunos, inclusive sobre o andamento do curso, apoiando o estudo.' },
      { aula: 2, enunciado: 'O que caracteriza a aprendizagem personalizada com apoio de IA?',
        alternativas: ['Todos os alunos recebem exatamente o mesmo conteúdo, no mesmo ritmo.', 'O aluno escolhe qualquer conteúdo, sem acompanhamento.',
          'O sistema analisa o perfil do aluno para sugerir conteúdos e caminhos adequados a ele.', 'O professor deixa de participar do processo.'],
        correta: 2, explicacao: 'Na personalização, o sistema analisa o perfil do aluno (ritmo, dificuldades, interesses) para adaptar o que é oferecido.' },
      { aula: 3, enunciado: 'Uma professora recebe de um chatbot uma data histórica que parece errada. Qual é a melhor atitude?',
        alternativas: ['Usar a informação, pois a IA nunca erra.', 'Conferir a informação em fontes confiáveis antes de usar.',
          'Perguntar ao próprio chatbot “tem certeza?” e aceitar a resposta.', 'Parar de usar IA para sempre.'],
        correta: 1, explicacao: 'A IA pode errar com muita segurança. A verificação deve ser feita em fontes confiáveis, não na própria ferramenta.' },
      { aula: 3, enunciado: 'Qual é o cuidado correto com os dados dos alunos ao usar ferramentas de IA?',
        alternativas: ['Colar laudos e notas completas para a IA analisar melhor.', 'Informar o nome completo de todos os alunos para personalizar as respostas.',
          'Não há cuidado necessário, pois as ferramentas são sempre seguras.', 'Evitar inserir dados pessoais e conhecer a política de privacidade da ferramenta antes de usá-la.'],
        correta: 3, explicacao: 'Dados pessoais de alunos (nome completo, notas, laudos, fotos) não devem ser inseridos sem conhecer a política de privacidade.' },
      { aula: 2, enunciado: 'Qual afirmação sobre o papel da IA na educação está correta?',
        alternativas: ['Ela apoia o professor, que continua responsável pelas decisões pedagógicas.', 'Ela torna o professor desnecessário.',
          'Ela deve ser usada sem qualquer revisão, para economizar tempo.', 'Ela só serve para alunos que já sabem o conteúdo.'],
        correta: 0, explicacao: 'A IA é uma ferramenta de apoio: a decisão pedagógica continua sendo do professor.' }
    ]
  },

  /* ---------------- MÓDULO 2 ---------------- */
  2: {
    pdf: 'pdf/guia-revisao-modulo-2.pdf',
    pdfNome: 'Guia de Revisão do Módulo 2 — IA na prática docente',
    questoes: [
      { aula: 1, enunciado: 'Qual é o primeiro passo para usar a IA no planejamento de uma aula?',
        alternativas: ['Pedir um plano pronto sem dar nenhuma informação.', 'Definir o objetivo de aprendizagem: o que os alunos devem aprender.',
          'Escolher a ferramenta mais famosa.', 'Imprimir o plano que a IA gerar.'],
        correta: 1, explicacao: 'Tudo começa pelo objetivo de aprendizagem. Com ele definido, o pedido à IA fica mais claro e útil.' },
      { aula: 1, enunciado: 'Quais informações tornam um pedido (prompt) mais útil para planejar uma aula?',
        alternativas: ['Apenas a palavra “aula”.', 'Somente o nome do professor.', 'Apenas o horário de início da aula.',
          'Tema, ano ou nível da turma, tempo de aula, objetivo e perfil dos alunos.'],
        correta: 3, explicacao: 'Quanto mais contexto o professor informa, mais adequada será a proposta da IA.' },
      { aula: 1, enunciado: 'Ao receber um plano de aula gerado pela IA, o professor deve:',
        alternativas: ['Revisar e adaptar o plano à sua turma antes de usá-lo.', 'Aplicar exatamente como veio, sem ler.',
          'Descartar sempre, pois a IA nunca ajuda.', 'Enviar direto aos alunos como material oficial.'],
        correta: 0, explicacao: 'O plano da IA é um rascunho. A revisão e a adaptação feitas pelo professor são indispensáveis.' },
      { aula: 2, enunciado: 'Para que servem as ferramentas de IA voltadas a professores?',
        alternativas: ['Para substituir o julgamento do professor.', 'Para impedir que os alunos façam atividades.',
          'Para apoiar tarefas como planejar, redigir textos, montar quizzes e criar materiais.', 'Para trocar a escola por aulas totalmente automáticas.'],
        correta: 2, explicacao: 'As ferramentas apoiam o trabalho docente em várias tarefas, sem substituir o julgamento do professor.' },
      { aula: 2, enunciado: 'Qual NÃO é um bom critério para escolher uma ferramenta de IA para a escola?',
        alternativas: ['A finalidade pedagógica da ferramenta.', 'Ela ser a mais comentada nas redes sociais, mesmo sem conhecer seus termos de uso.',
          'A política de privacidade e os termos de uso.', 'A faixa etária permitida e o custo.'],
        correta: 1, explicacao: 'Popularidade, sozinha, não é critério. É preciso avaliar finalidade, privacidade, faixa etária e custo.' },
      { aula: 3, enunciado: 'Qual é a ordem correta do ciclo prático de uso da IA?',
        alternativas: ['Aplicar, escrever o prompt, definir o objetivo, refletir.', 'Refletir, aplicar, avaliar, definir o objetivo.',
          'Escrever o prompt, aplicar, esquecer, repetir.', 'Definir o objetivo, escrever o prompt, avaliar a resposta, adaptar à turma, aplicar e refletir.'],
        correta: 3, explicacao: 'O ciclo é: objetivo, prompt, avaliar, adaptar, aplicar e refletir para ajustar na próxima vez.' },
      { aula: 2, enunciado: 'Um professor quer usar uma ferramenta de IA com alunos de 11 anos. O que ele deve fazer antes de cadastrar os alunos?',
        alternativas: ['Ler os termos de uso e a política de privacidade e verificar a faixa etária permitida.', 'Cadastrar todos de uma vez para ganhar tempo.',
          'Usar a conta pessoal de um aluno mais velho.', 'Ignorar a idade mínima, pois é só uma sugestão.'],
        correta: 0, explicacao: 'Com menores de idade, é essencial conferir idade mínima e privacidade antes de cadastrar qualquer dado.' },
      { aula: 3, enunciado: 'A resposta da IA veio genérica e pouco adequada à turma. O que é mais indicado?',
        alternativas: ['Aceitar a resposta, pois a IA sabe mais que o professor.', 'Desistir de usar IA no planejamento.',
          'Refinar o pedido com mais contexto (nível, objetivo, exemplos) e pedir de novo.', 'Copiar a resposta e aplicar assim mesmo.'],
        correta: 2, explicacao: 'Refinar o prompt com mais detalhes costuma melhorar muito a resposta. Depois, é preciso avaliar e adaptar.' }
    ]
  },

  /* ---------------- MÓDULO 3 ---------------- */
  3: {
    pdf: 'pdf/guia-revisao-modulo-3.pdf',
    pdfNome: 'Guia de Revisão do Módulo 3 — Atividades, avaliação e ética',
    questoes: [
      { aula: 1, enunciado: 'Ao pedir uma atividade para a IA, quais informações ajudam a obter um bom resultado?',
        alternativas: ['Apenas o nome da disciplina.', 'Somente o número de questões.',
          'Objetivo de aprendizagem, ano ou nível, tipo de atividade e contexto dos alunos.', 'Nenhuma: a IA adivinha o que o professor precisa.'],
        correta: 2, explicacao: 'Objetivo, nível, tipo de atividade e contexto orientam a IA e deixam a atividade mais adequada.' },
      { aula: 1, enunciado: 'Além da atividade, o que vale a pena pedir à IA?',
        alternativas: ['O gabarito e os critérios de correção, que o professor deve conferir.', 'A nota final de cada aluno.',
          'Um texto para os alunos copiarem e entregarem.', 'Nada: o pedido deve ser sempre o mais curto possível.'],
        correta: 0, explicacao: 'Gabarito e critérios ajudam na correção, mas precisam ser conferidos pelo professor.' },
      { aula: 2, enunciado: 'Por que o professor deve resolver a atividade gerada pela IA antes de aplicá-la?',
        alternativas: ['Para ocupar o tempo de planejamento.', 'Porque a IA sempre acerta e isso é só uma formalidade.',
          'Para que os alunos copiem a resolução dele.', 'Para encontrar erros e ambiguidades antes que os alunos encontrem.'],
        correta: 3, explicacao: 'Resolver a atividade é uma forma prática de descobrir erros, enunciados ambíguos e problemas de nível.' },
      { aula: 2, enunciado: 'Qual alternativa lista critérios adequados para avaliar uma atividade gerada por IA?',
        alternativas: ['Cor do texto, tamanho da fonte e número de páginas.', 'Correção conceitual, alinhamento ao objetivo, clareza do enunciado e adequação ao nível da turma.',
          'Quantidade de palavras e uso de emojis.', 'Velocidade com que a IA respondeu.'],
        correta: 1, explicacao: 'Os critérios centrais são correção do conteúdo, alinhamento ao objetivo, clareza e adequação ao nível, além de vieses e acessibilidade.' },
      { aula: 2, enunciado: 'A atividade gerada tem um enunciado ambíguo. O que o professor pode fazer?',
        alternativas: ['Aplicar assim mesmo e explicar depois.', 'Culpar a IA caso os alunos errem.',
          'Ajustar o enunciado, pedir uma nova versão ou descartar a atividade.', 'Mandar os alunos adivinharem o que a questão quer dizer.'],
        correta: 2, explicacao: 'Diante de um problema, o professor pode ajustar, gerar de novo ou descartar a atividade.' },
      { aula: 3, enunciado: 'O que significa agir com transparência no uso da IA em sala?',
        alternativas: ['Declarar aos alunos quando a IA foi usada na criação de materiais.', 'Esconder o uso da IA para evitar perguntas.',
          'Usar IA somente à noite.', 'Pedir que os alunos nunca mencionem a IA.'],
        correta: 0, explicacao: 'Transparência é informar quando a IA foi usada, o que fortalece a confiança e a integridade acadêmica.' },
      { aula: 3, enunciado: 'Alguns alunos não têm internet nem dispositivos em casa. Qual é a atitude mais coerente com a equidade de acesso?',
        alternativas: ['Exigir que todos usem IA em casa.', 'Dar nota menor a quem não usou a ferramenta.',
          'Evitar qualquer atividade com tecnologia.', 'Usar a IA em sala ou no laboratório, ou oferecer uma alternativa equivalente.'],
        correta: 3, explicacao: 'A equidade pede que nenhum aluno seja prejudicado por falta de acesso: use a IA na escola ou ofereça alternativas.' },
      { aula: 3, enunciado: 'Quem responde pela avaliação final dos alunos quando a IA é usada como apoio?',
        alternativas: ['A ferramenta de IA.', 'O professor, que toma a decisão final.',
          'A empresa que criou a ferramenta.', 'Os próprios alunos, sem acompanhamento.'],
        correta: 1, explicacao: 'A decisão final e a responsabilidade pela avaliação continuam sendo do professor.' }
    ]
  }
};
