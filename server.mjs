const express = require("express");
const fs = require("fs");
const path = require("path");// modelo do node para lidar com rotas
const cors = require('cors');
const app = express();

const PORT = 3000;

// Inicializando o cors
app.use(cors()); 
app.use(express.json());

// Configurando a pasta public como estastica
app.use(express.static(path.join(__dirname, 'public')));

// CAMINHO BANCO 
const databaseDirectory = path.join(
    __dirname,
    "data_base"
);

const databasePath = path.join(
    databaseDirectory,
    "chamados.json"
);


// CONFIGURAÇÂO BANCO DE DADOS
function prepararBanco() {

    // Criar pasta caso não exista
    if (!fs.existsSync(databaseDirectory)) {

        fs.mkdirSync(
            databaseDirectory,
            {
                recursive: true
            }
        );

        console.log(
            "Pasta data_base criada."
        );

    }


    // Criar arquivo caso não exista
    if (!fs.existsSync(databasePath)) {

        fs.writeFileSync(
            databasePath,
            "[]",
            "utf8"
        );

        console.log(
            "Arquivo chamados.json criado."
        );

    }

}


// Executar preparação
prepararBanco();


// Ponte Express
app.use(
    express.json()
);


// FRONTEND
app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


// IMAGENS
app.use(
    "/images",
    express.static(
        path.join(
            __dirname,
            "images"
        )
    )
);


// PÁGINA INICIAL
app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "pag_professor",
                "index.html"
            )
        );

    }
);


// LER CHAMADOS

function lerChamados() {

    try {

        const dados =
            fs.readFileSync(
                databasePath,
                "utf8"
            );


        // Caso o arquivo esteja vazio

        if (!dados.trim()) {

            return [];

        }


        const chamados =
            JSON.parse(dados);
        return chamados;

    } catch (erro) {

        console.error(
            "ERRO AO LER chamados.json:"
        );

        console.error(
            erro
        );

        throw erro;

    }

}


// SALVAR CHAMADOS

function salvarChamados(chamados) {

    fs.writeFileSync(
        databasePath,
        JSON.stringify(
            chamados,
            null,
            4
        ),
        "utf8"
    );

}


// LISTAR CHAMADOS

app.get(
    "/api/chamados",
    (req, res) => {

        try {

            const chamados =
                lerChamados();


            res.json(
                chamados
            );

        } catch (erro) {

            console.error(
                erro
            );


            res.status(500).json({

                erro:
                    "Erro ao ler os chamados."

            });

        }

    }
);


// CRIAR CHAMADO
app.post(
    "/api/chamados",
    (req, res) => {

        try {

            const {
                categoria,
                sala,
                professor,
                descricao
            } = req.body;


            // VALIDAÇÃO

            if (
                !categoria ||
                !sala ||
                !professor ||
                !descricao
            ) {

                return res.status(400).json({

                    erro:
                    "Todos os campos são obrigatórios."

                });

            }


            // LER CHAMADOS

            const chamados =
                lerChamados();


            // GERARANDO ID

            const novoId =
                chamados.length > 0
                    ? chamados[
                        chamados.length - 1
                    ].id + 1
                    : 1;


            // CRIANDO CHAMADO

            const novoChamado = {

                id: novoId,

                categoria:
                    categoria,

                sala:
                    sala,

                professor:
                    professor,

                descrição:
                    descricao,

                status:
                    "Aberto",

                createdAt:
                    new Date()
                        .toISOString()

            };


            // SALVANDO CHAMADO

            chamados.push(
                novoChamado
            );


            salvarChamados(
                chamados
            );

            // RESPOSTA AO CHAMADO

            res.status(201).json(
                novoChamado
            );

        } catch (erro) {

            console.error(
                "ERRO AO CRIAR CHAMADO:"
            );

            console.error(
                erro
            );


            res.status(500).json({

                erro:
                    "Erro ao criar chamado."

            });

        }

    }
);


// ATUALIZAR STATUS DO CHAMADO
app.put(
    "/api/chamados/:id",
    (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ erro: "O campo status é obrigatório." });
            }

            const chamados = lerChamados();
            const index = chamados.findIndex(c => c.id == id);

            if (index === -1) {
                return res.status(404).json({ erro: "Chamado não encontrado." });
            }

            // Atualiza apenas o status do chamado encontrado
            chamados[index].status = status;

            salvarChamados(chamados);

            res.json({
                mensagem: "Status atualizado com sucesso!",
                chamado: chamados[index]
            });

        } catch (erro) {
            console.error("ERRO AO ATUALIZAR STATUS:", erro);
            res.status(500).json({ erro: "Erro ao atualizar status do chamado." });
        }
    }
);

// INICIANDO SERVER

app.listen(
    PORT,
    () => {

        console.log(
            " SERVIDOR INICIADO COM SUCESSO"
        );
        console.log(
            ` http://localhost:${PORT}`
        );
        console.log(
            ` http://localhost:${PORT}/api/chamados`
        );
        console.log("");

    }
);
