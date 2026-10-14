SUPORTE AOS PROFESSORES | UNIENSINO

Sistema de gerenciamento de chamados de suporte técnico e infraestrutura educacional.

O Suporte aos Professores — UniEnsino é uma aplicação web desenvolvida para centralizar e otimizar o registro, o acompanhamento e a resolução de solicitações relacionadas à infraestrutura e ao suporte técnico das salas de aula.

A plataforma permite que os professores registrem ocorrências de maneira simplificada, enquanto o Setor de Apoio dispõe de um painel administrativo para gerenciar atendimentos, acompanhar indicadores e exportar relatórios em Excel.

O sistema é organizado em dois módulos principais:

Portal do Professor: interface para registrar solicitações de suporte, informar a sala de aula, selecionar a categoria da ocorrência e descrever o problema.
Painel do Setor de Apoio: ambiente administrativo para consultar chamados, atualizar o status dos atendimentos e gerar relatórios periódicos.

A solução contempla ocorrências relacionadas a projetores, computadores, conexão com a internet, ar-condicionado, limpeza e outras necessidades da rotina escolar.

Funcionalidades
1. Portal do Professor
Registro de chamados: abertura de solicitações com categoria, identificação do professor, sala e descrição da ocorrência.
Seleção de categorias: interface visual para facilitar a classificação dos problemas.
Validação de campos: verificação dos dados obrigatórios antes do envio.
Confirmação de solicitação: retorno visual após o registro bem-sucedido.
Abertura simplificada de novos chamados: possibilidade de iniciar outra solicitação sem recarregar a página.
2. Painel do Setor de Apoio
Consulta de chamados: visualização dos registros disponibilizados pela API.
Detalhamento de ocorrências: consulta das informações de cada chamado.
Gerenciamento de atendimentos: alteração do status conforme o andamento da solicitação.
Controle de status: classificação dos chamados em:
Aberto
Em andamento
Resolvido
Identificação visual: utilização de cores para facilitar a leitura dos status.
Atualização da listagem: atualização dos dados após alterações nos atendimentos.
3. Relatórios gerenciais

O painel administrativo disponibiliza relatórios para auxiliar o acompanhamento das solicitações e a análise do volume de atendimentos.

Relatório	Período considerado
Diário	Dia atual
Semanal	Semana atual, de segunda-feira a domingo
Mensal	Mês atual

Os relatórios apresentam indicadores de atendimento, incluindo:

Total de chamados registrados no período;
Quantidade de chamados abertos;
Quantidade de chamados em andamento;
Quantidade de chamados resolvidos.
Exportação para Excel

Os relatórios podem ser exportados para arquivos no formato .xlsx, compatíveis com Microsoft Excel e outros programas de planilhas.

Cada arquivo contém duas planilhas:

Resumo: período analisado e indicadores quantitativos.
Chamados: detalhamento dos registros, incluindo identificador, data de criação, professor, sala, categoria, descrição e status.

Os arquivos são nomeados conforme o tipo de relatório e a data de geração, facilitando o arquivamento, a consulta e o compartilhamento das informações.

A geração das planilhas é realizada no navegador com a biblioteca SheetJS.

Tecnologias utilizadas
Frontend
Tecnologia	Finalidade
HTML5	Estruturação das interfaces
CSS3	Estilização das páginas
Tailwind CSS	Construção de interfaces responsivas no painel administrativo
JavaScript (ES6+)	Interatividade, validações e manipulação do DOM
Fetch API	Comunicação assíncrona com o servidor
SheetJS (XLSX)	Geração e exportação de planilhas Excel
Backend
Tecnologia	Finalidade
Node.js	Ambiente de execução JavaScript
Express.js	Servidor web e implementação da API REST
CORS	Configuração de acesso entre origens
File System (fs)	Leitura e gravação dos arquivos de dados
JSON	Formato de armazenamento dos chamados
Infraestrutura e versionamento
Render: hospedagem e execução do servidor.
GitHub: versionamento do código-fonte e gerenciamento das alterações.
npm: gerenciamento das dependências do projeto.
Arquitetura do projeto

A aplicação utiliza uma arquitetura cliente-servidor. O frontend realiza requisições HTTP para a API REST implementada em Node.js e Express. O backend processa as solicitações e utiliza um arquivo JSON para armazenar os chamados.

O fluxo básico de funcionamento é:

O professor preenche e envia um formulário de chamado.
O frontend encaminha os dados para a API.
O backend valida as informações e registra o chamado.
O Setor de Apoio consulta os registros e atualiza os status dos atendimentos.
A API disponibiliza os dados dos períodos selecionados para geração dos relatórios.
O painel utiliza esses dados para apresentar indicadores e exportar planilhas Excel.
Estrutura de diretórios
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


Principais arquivos e diretórios:

server.js: inicialização do servidor Express e definição das rotas da API.
package.json: configuração do projeto, scripts e dependências.
data_base/chamados.json: arquivo utilizado para armazenar os chamados.
public/pag_professor/: interface destinada aos professores.
public/: arquivos estáticos disponibilizados pela aplicação.
API REST

A API disponibiliza endpoints para consulta, criação, atualização e geração de relatórios.

Método	Endpoint	Descrição
GET	/api/health	Verifica a disponibilidade do servidor.
GET	/api/chamados	Retorna os chamados registrados.
POST	/api/chamados	Cria um novo chamado.
PUT	/api/chamados/:id	Atualiza o status de um chamado.
GET	/api/relatorios?tipo=diario	Retorna os dados do relatório diário.
GET	/api/relatorios?tipo=semanal	Retorna os dados do relatório semanal.
GET	/api/relatorios?tipo=mensal	Retorna os dados do relatório mensal.
Exemplo de utilização

Consulta dos chamados:

GET /api/chamados


Criação de um chamado:

POST /api/chamados
Content-Type: application/json

{
  "categoria": "Computador",
  "sala": "12",
  "professor": "Nome do Professor",
  "descricao": "Computador não está ligando."
}


Geração de relatório semanal:

GET /api/relatorios?tipo=semanal


Os endpoints de relatórios retornam dados em JSON. A interface administrativa utiliza essas informações para apresentar os indicadores e gerar os arquivos Excel.


Desenvolvedor

Emerson Castro
UniEnsino
