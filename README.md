#  Suporte aos Professores — UniEnsino

Sistema web para abertura rápida de chamados de suporte técnico e de infraestrutura, desenvolvido especificamente para os professores e corpo docente da instituição **UniEnsino**.

A aplicação foi criada para agilizar a notificação de falhas tecnológicas ou operacionais em salas de aula (como problemas com projetores, computadores ou climatização), permitindo uma resposta ágil da equipe de suporte.

##  Funcionalidades

- Categorização Visual: Botões interativos com ícones para seleção rápida do tipo de problema (Projetor, Computador, Internet, Ar-condicionado, Limpeza, Outro).
- Identificação do Chamado: Coleta do nome do professor, número/identificação da sala de aula e detalhamento do problema.
- Validação de Dados em Tempo Real:
  - Impedimento de envio sem categoria selecionada ou sem descrição do problema.
  - Alertas interativos orientando o preenchimento correto dos campos.
- Contador Dinâmico de Caracteres:** Acompanhamento do limite de texto na descrição da solicitação.
- Modal de Confirmação: Pop-up de confirmação de abertura do chamado com exibição dos detalhes enviados.
- Reset do Formulário: Opção de abrir um novo chamado com apenas um clique, limpando as seleções e os campos de texto.

##  Tecnologias Utilizadas

- HTML5: Estruturação semântica com foco em acessibilidade e organização de formulários.
- CSS3: Estilização responsiva, layout modular e tratamento visual para estados de seleção.
- JavaScript (ES6+): Lógica do cliente, manipulação do DOM, gestão de eventos de clique e dinâmicas do modal.

##  Estrutura do Projeto

text
├── index.html       # Estrutura principal da página web
├── style.css        # Estilos, variáveis e responsividade
├── script.js        # Lógica de interatividade e manipulação do DOM
└── imagens/         # Recursos visuais e
logotipos
    └── logo.png

## Desenvolvedores

Emerson Castro — UniEnsino
