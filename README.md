#  Suporte aos Professores | UNIENSINO

## Sobre o Projeto

O **Suporte aos Professores — UniEnsino** é uma aplicação web desenvolvida para otimizar, centralizar e acelerar a resolução de incidentes nas salas de aula. 

A plataforma conecta diretamente os docentes ao **Setor de Apoio**, reduzindo o tempo de inatividade em sala de aula e permitindo uma gestão eficiente da infraestrutura escolar (projetores, computadores, conectividade, ar-condicionado, limpeza, etc.).

---

## Módulos do Sistema

| Módulo | Público-Alvo | Descrição Principais |
| :--- | :--- | :--- |
| **Portal do Professor** | Docentes | Interface simplificada para abertura ágil de chamados por sala e categoria. |
| **Painel do Setor de Apoio** | Equipe Técnica | Dashboard administrativo para gestão de status, filtros e exportação de relatórios. |

---

## Funcionalidades

### 1. Portal do Professor
- **Abertura de Chamados:** Registro rápido com dados do professor, sala, categoria e descrição do problema.
- **Categorização Visual:** Interface intuitiva para classificação imediata de incidentes.
- **Validação Automática:** Verificação de campos obrigatórios antes do envio.
- **Fluxo Contínuo:** Possibilidade de abrir novos chamados sem necessidade de recarregar a página.

### 2. Painel do Setor de Apoio
- **Gestão em Tempo Real:** Visualização dinâmica dos chamados ativos consumidos via API.
- **Controle de Status:**
  - 🔴 **Aberto**
  - 🟡 **Em andamento**
  - 🟢 **Resolvido**
- **Identificação Visual:** Tags de cores para facilitar a triagem rápida dos incidentes.

### 3. Relatórios Gerenciais & Exportação
- **Métricas por Período:** Relatórios consolidados **Diários**, **Semanais** (segunda a domingo) e **Mensais**.
- **Indicadores Quantitativos:** Total de chamados, abertos, em andamento e resolvidos.
- **Exportação Excel (`.xlsx`):** Gerada diretamente no navegador via **SheetJS**, contendo duas abas:
  - `Resumo`: Período e métricas consolidadas.
  - `Chamados`: Tabela detalhada de cada ocorrência.

---

## Tecnologias Utilizadas

### Frontend
- **HTML5 & CSS3:** Estrutura base e estilização customizada.
- **Tailwind CSS:** Design responsivo e moderno no painel administrativo.
- **JavaScript (ES6+):** Lógica do cliente, manipulação do DOM e validações.
- **Fetch API:** Comunicação assíncrona com os endpoints.
- **SheetJS (XLSX):** Processamento e geração dos relatórios Excel no client-side.

### Backend
- **Node.js & Express.js:** Servidor web e construção da API REST.
- **CORS:** Controle e segurança no acesso entre origens.
- **File System (fs) & JSON:** Persistência de dados em arquivo plano.

### Infraestrutura & Ferramentas
- **Render:** Hospedagem da aplicação web e API.
- **GitHub:** Versionamento e controle de código.
- **npm:** Gerenciador de pacotes.

---

##  Arquitetura do Projeto

A solução adota uma arquitetura Cliente-Servidor (REST):

help_desk/
├── data_base/
│   └── chamados.json          # Arquivo JSON que fica salvo os chamados
├── public/
│   ├── pag_professor/
│   │   ├── index.html         # Portal do Professor
│   │   ├── style.css
│   │   └── script.js
│   └── pag_apoio/            
|       |__ index.html         # Portal apoio
├── server.js                  # Ponto de entrada da aplicação e API REST
├── package.json               # Dependências e scripts do projeto
└── README.md                  # Documentação do projeto
