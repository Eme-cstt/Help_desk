 # SUPORTE AOS PROFESSORES - UNIENSINO

Sistema web completo desenvolvido para a instituição UniEnsino, estruturado para otimizar o fluxo de abertura, gerenciamento e resolução de chamados de suporte técnico e infraestrutura em salas de aula (projetores, computadores, rede, ar-condicionado e limpeza).

O projeto é dividido em um ambiente dedicado aos docentes (para solicitações rápidas) e um Painel de Apoio / Dashboard voltado para a do apoio gerenciar o status dos chamados em tempo real.

Funcionalidades Principais

 # Módulo do Professor

  Categorização Visual: Botões interativos com ícones para seleção rápida do tipo de ocorrência (Projetor, Computador, Internet, Ar-condicionado, Limpeza, Outro).
  
  - Identificação Ágil: Coleta simplificada do nome do docente e do número da sala de aula.
  
  - Validação em Tempo Real: Bloqueio de envios incompletos e alertas orientativos visuais.
  
  - Feedback Imediato: Modal de confirmação detalhado com opção de abrir novos chamados instantaneamente.

 # Painel do Setor de Apoio (Dashboard)

  - Listagem Dinâmica: Tabela em tempo real integrando com o backend para consulta de todos os chamados registrados.

  - Gestão de Status: Modais interativos para alternar o estado do atendimento entre Aberto, Em andamento e Resolvido.

  - Identificação Visual por Badges: Cores intuitivas que facilitam a priorização e visualização rápida do andamento dos chamados.

 # Tecnologias Utilizadas

Frontend:

  - HTML5 (Estruturação semântica)
  
  - CSS3 (Design responsivo e estilização customizada)
  
  - Tailwind CSS (Estilização moderna via CDN no painel administrativo)
  
  - JavaScript (ES6+) (Manipulação do DOM, requisições assíncronas via fetch e controle de modais)

Backend:

  - Node.js com Express (Servidor RESTful API)
  
  - CORS (Gerenciamento de permissões de acesso)
  
  - File System (fs) (Persistência leve de dados baseada em JSON)

Necessário Instalar as dependências:
  
  - npm install express cors

Estrutura Geral do Projeto

├── data_base/
│   └── chamados.json       # Armazenamento local dos chamados em JSON
├── public/
│   ├── pag_professor/      # Interface e scripts de envio do corpo docente
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   └── ...                 # Demais arquivos estáticos
├── server.mjs              # Servidor principal com rotas Express e API REST
└── README.md               # Documentação do projeto

Desenvolvedor

Emerson Castro — UniEnsino
