# EduIa — Plataforma para Formação de Professores com IA (v8)

Site 100% estático (HTML, CSS e JavaScript): **sem API, sem chave, sem servidor e sem limites de uso**.
Abra pelo Live Server do VS Code ou publique em qualquer hospedagem estática (GitHub Pages, Vercel, Netlify).

## O que a v8 muda
1. **Questionário por módulo (não mais por vídeo):** 8 perguntas sobre os 3 vídeos do módulo (`js/quiz-modulos.js`). Para passar é preciso **acertar no mínimo 5**.
   Se faltar responder alguma, o envio é recusado com o aviso de quantas perguntas faltam.
2. **Guia de Revisão (PDF)** de cada módulo, logo após o 3º vídeo e antes do questionário: `pdf/guia-revisao-modulo-1.pdf`, `-2.pdf` e `-3.pdf`
   (mesmas cores do site e rodapé da plataforma). As perguntas dão ênfase aos pontos do Guia.
3. **Bloqueios:**
   - O vídeo seguinte só abre depois que o anterior for marcado como concluído.
   - Guia + questionário abrem quando os 3 vídeos do módulo estão marcados como concluídos.
   - O próximo módulo só abre com o questionário do módulo anterior aprovado (5 de 8 ou mais).
   - O certificado e o plano de aula exigem os 3 módulos concluídos.
4. **Vídeos atualizados** com os links da formação (`js/curso.js`).

## Pontos de atenção
- **Revise o Guia (PDF) e as perguntas com os vídeos.** Eles foram escritos a partir dos temas dos vídeos e, quando possível, da descrição de cada um; confira se o conteúdo bate com o que os vídeos dizem.
- **Vídeo 2 do Módulo 2 (Ferramentas de IA para professores):** em `js/curso.js`, troque `COLE_AQUI_O_ID_DO_VIDEO` pelo código do vídeo (a parte do link entre `youtu.be/` e `?si=`).
- **Durações das aulas** (`duracao` em `js/curso.js`, usadas na carga horária do certificado) ainda são as antigas: ajuste para a duração real de cada vídeo.
- Para editar uma pergunta: `js/quiz-modulos.js` (`correta` = posição da alternativa certa: 0 a 3; a ordem é embaralhada a cada tentativa).
- Como tudo roda no navegador, o gabarito pode ser lido pelas ferramentas do navegador e os resultados ficam no `localStorage`.

## Como usar
- VS Code → extensão **Live Server** → “Go Live” (abre em `http://127.0.0.1:5500`). Não precisa instalar Node.
- Fluxo: cadastro/login → módulo → assistir → “Marcar aula como concluída” (próximo vídeo abre) → após o 3º vídeo: ler o Guia de Revisão (PDF) → responder o questionário (8 perguntas, mínimo 5 acertos) → próximo módulo liberado.

## Arquivos desta versão
Alterados: `js/curso.js`, `js/avaliacao.js`, `js/base-conhecimento.js`, `curso.html`, `avaliacao.html`, `css/style.css` (seção v8 no final).
Novos: `js/quiz-modulos.js`, `pdf/guia-revisao-modulo-1.pdf`, `pdf/guia-revisao-modulo-2.pdf`, `pdf/guia-revisao-modulo-3.pdf`.
Removido: `js/banco-questoes.js` (questionário por vídeo).
