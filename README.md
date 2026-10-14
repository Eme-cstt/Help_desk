SUPORTE AOS PROFESSORES — UNIENSINO
Sistema web de apoio aos professores desenvolvido para a instituição UniEnsino, com o objetivo de otimizar a abertura, o gerenciamento e a resolução de chamados relacionados à infraestrutura e ao suporte técnico das salas de aula, incluindo projetores, computadores, internet, ar-condicionado, limpeza e outras ocorrências.

O sistema é dividido em dois módulos principais: uma interface para os professores registrarem solicitações de suporte e um painel administrativo para o Setor de Apoio acompanhar, gerenciar e gerar relatórios dos chamados.

Funcionalidades principais
1. Módulo do Professor
- Categorização visual: seleção interativa do tipo de ocorrência por meio de categorias.
- Identificação simplificada: preenchimento do nome do professor e da sala de aula.
- Validação de formulários: verificação dos campos obrigatórios antes do envio.
- Abertura de chamados: registro de ocorrências com categoria, sala, professor e descrição.
- Confirmação de envio: exibição de uma mensagem de sucesso após o registro.
- Abertura de novas solicitações: possibilidade de registrar outro chamado sem recarregar a página.
2. Painel do Setor de Apoio
- Listagem de chamados: visualização dos chamados registrados no sistema.
- Atualização de dados: consulta dos chamados disponíveis na API.
- Gerenciamento de chamados: visualização dos detalhes de cada ocorrência.
- Controle de status: atualização do atendimento para:
Aberto;
Em andamento;
Resolvido.
Identificação visual: utilização de cores para facilitar a identificação dos status.
Atualização dinâmica: atualização da listagem após alterações no atendimento.
3. Sistema de Relatórios
O painel administrativo possui uma funcionalidade de geração de relatórios que permite acompanhar os chamados por diferentes períodos.

Relatório diário: chamados criados no dia atual.
Relatório semanal: chamados criados na semana atual, de segunda-feira a domingo.
Relatório mensal: chamados criados no mês atual.
Resumo estatístico: apresentação do total de chamados, chamados abertos, em andamento e resolvidos.
Exportação para Excel: geração e download de arquivos no formato .xlsx.
Planilha de resumo: apresenta o período analisado e os indicadores do relatório.
Planilha de detalhamento: reúne os dados individuais dos chamados, incluindo ID, data de criação, professor, sala, categoria, descrição e status.
Os arquivos são gerados com nomes que identificam o período e a data de geração, facilitando o armazenamento, a consulta e o compartilhamento dos relatórios pelo Setor de Apoio.
A exportação utiliza a biblioteca SheetJS, carregada por CDN no navegador.

Tecnologias utilizadas
Frontend
HTML5: estruturação das páginas.
CSS3: estilização das interfaces.
Tailwind CSS: criação de componentes visuais responsivos no painel administrativo.
JavaScript (ES6+): manipulação do DOM, validações, eventos e requisições assíncronas.
Fetch API: comunicação com o backend.
SheetJS (XLSX): criação e exportação de planilhas Excel.
Backend
Node.js: ambiente de execução JavaScript no servidor.
Express.js: criação do servidor web e das rotas da API REST.
CORS: configuração de acesso entre origens.
File System (fs): leitura e gravação dos dados em arquivos JSON.
Armazenamento
JSON: armazenamento dos chamados no arquivo chamados.json.
Hospedagem e versionamento
Render: hospedagem do servidor e disponibilização da aplicação.
GitHub: versionamento do código-fonte e gerenciamento das alterações.
Estrutura do projeto
help_desk/
├── data_base/
│   └── chamados.json
├── public/
│   ├── pag_professor/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   └── ... 
├── server.js
├── package.json
└── README.md

Método	Endpoint	Descrição
GET	/api/health	Verifica se o servidor está funcionando.
GET	/api/chamados	Lista os chamados registrados.
POST	/api/chamados	Registra um novo chamado.

Endpoints da API
PUT	/api/chamados/:id	Atualiza o status de um chamado.
GET	/api/relatorios?tipo=diario	Gera os dados do relatório diário.
GET	/api/relatorios?tipo=semanal	Gera os dados do relatório semanal.
GET	/api/relatorios?tipo=mensal	Gera os dados do relatório mensal.
Os endpoints de relatórios retornam dados em JSON, que são utilizados pelo painel administrativo para apresentar as estatísticas e gerar os arquivos Excel.

Publicação no Render
O projeto pode ser hospedado no Render utilizando o repositório do GitHub.

Configuração básica do serviço:

Runtime: Node.js.
Build Command: npm install.
Start Command: npm start.
O servidor utiliza a variável de ambiente PORT disponibilizada pelo Render.

Desenvolvedor
Emerson Castro — UniEnsino

Projeto desenvolvido para auxiliar o gerenciamento das solicitações dos professores e melhorar o acompanhamento dos atendimentos pelo Setor de Apoio.
