# SUPORTE AOS PROFESSORES - UNIENSINO

Sistema web completo desenvolvido para a instituição UniEnsino, estruturado para otimizar o fluxo de abertura, gerenciamento e resolução de chamados de suporte técnico e infraestrutura em salas de aula (projetores, computadores, rede, ar-condicionado e limpeza).

O projeto conta com suporte multi-campus (unidades Neoville e Hauer) operando de forma independente, dividido entre o ambiente dedicado aos docentes (para solicitações rápidas) e os Painéis de Apoio / Dashboards voltados para a equipe gerenciar o status dos chamados em tempo real e exportar relatórios.

## Funcionalidades Principais

### Módulo do Professor
- **Seleção de Campus:** Escolha da unidade correspondente antes de registrar a solicitação.
- **Categorização Visual:** Botões interativos para seleção rápida do tipo de ocorrência (Projetor, Computador, Internet, Ar-condicionado, Limpeza, Outro).
- **Identificação Ágil:** Coleta simplificada do nome do docente e do número da sala de aula.
- **Validação em Tempo Real:** Bloqueio de envios incompletos e alertas orientativos visuais.
- **Feedback Imediato:** Confirmação detalhada com opção de abrir novos chamados instantaneamente.

### Painel do Setor de Apoio (Dashboards - Neoville e Hauer)
- **Listagem Dinâmica:** Tabela em tempo real integrada com o backend para consulta de todos os chamados registrados por unidade.
- **Gestão de Status:** Modais interativos para alternar o estado do atendimento entre Aberto, Em andamento e Resolvido.
- **Identificação Visual por Badges:** Cores intuitivas que facilitam a priorização e visualização rápida do andamento dos chamados.
- **Exportação de Relatórios:** Opção de exportação direta de dados estatísticos (diário, semanal e mensal) formatados para Excel (.csv).

## Tecnologias Utilizadas

### Frontend:
- HTML5 (Estruturação semântica)
- CSS3 (Design responsivo e estilização customizada)
- Tailwind CSS (Estilização moderna via CDN nos painéis administrativos)
- JavaScript (ES6+) (Manipulação do DOM, requisições assíncronas via fetch, controle de modais e exportação de planilhas)

### Backend:
- Node.js com Express (Servidor RESTful API)
- CORS (Gerenciamento de permissões de acesso)
- File System (fs) (Persistência leve de dados baseada em JSON separada por campus)

├── data_base/
│   ├── chamados_neoville.json # Armazenamento local dos chamados do campus Neoville
│   └── chamados_hauer.json    # Armazenamento local dos chamados do campus Hauer
├── public/
│   ├── pag_professor/         # Interface e scripts de envio dos Professores
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   ├── pag_apoio_neoville/    # Painel administrativo do campus Neoville
│   │   └── index.html
│   └── pag_apoio_hauer/       # Painel administrativo do campus Hauer
│       └── index.html
├── server.js                  # Servidor principal com rotas Express e API REST multi-campus
└── README.md                  # Documentação do projeto
