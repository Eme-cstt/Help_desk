const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// Render define a porta por variável de ambiente.
// Localmente, o servidor utilizará a porta 3000.
const PORT = process.env.PORT || 3000;

// Caminhos do projeto
const publicDirectory = path.join(__dirname, "public");
const imagesDirectory = path.join(publicDirectory, "imagens");

const databaseDirectory = path.join(__dirname, "data_base");
const databasePath = path.join(databaseDirectory, "chamados.json");

// Middlewares
app.use(cors());
app.use(express.json());

// Frontend: HTML, CSS, JavaScript e demais arquivos públicos
app.use(express.static(publicDirectory));

// Imagens disponíveis em /imagens/nome-do-arquivo.png
app.use("/imagens", express.static(imagesDirectory));

// Preparar o arquivo JSON sem apagar dados existentes
function prepararBanco() {
    if (!fs.existsSync(databaseDirectory)) {
        fs.mkdirSync(databaseDirectory, { recursive: true });
    }

    if (!fs.existsSync(databasePath)) {
        fs.writeFileSync(databasePath, "[]", "utf8");
        console.log("Arquivo chamados.json criado.");
    }
}

prepararBanco();

// Página inicial
app.get("/", (req, res) => {
    res.sendFile(
        path.join(publicDirectory, "pag_professor", "index.html")
    );
});

// Ler chamados
function lerChamados() {
    const dados = fs.readFileSync(databasePath, "utf8");

    if (!dados.trim()) {
        return [];
    }

    const chamados = JSON.parse(dados);

    if (!Array.isArray(chamados)) {
        throw new Error("O banco de chamados precisa conter uma lista.");
    }

    return chamados;
}

// Salvar chamados
function salvarChamados(chamados) {
    fs.writeFileSync(
        databasePath,
        JSON.stringify(chamados, null, 4),
        "utf8"
    );
}

// Verificar se a API está funcionando
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        mensagem: "Help Desk funcionando."
    });
});

// Listar chamados
app.get("/api/chamados", (req, res) => {
    try {
        res.json(lerChamados());
    } catch (erro) {
        console.error("Erro ao ler chamados:", erro);
        res.status(500).json({
            erro: "Erro ao ler os chamados."
        });
    }
});

// Criar chamado
app.post("/api/chamados", (req, res) => {
    try {
        const { categoria, sala, professor, descricao } = req.body;

        if (
            !categoria ||
            !sala ||
            !professor ||
            !descricao
        ) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios."
            });
        }

        const chamados = lerChamados();

        // Evitar depender da posição do último chamado no arquivo
        const novoId = chamados.reduce(
            (maiorId, chamado) => Math.max(maiorId, Number(chamado.id) || 0),
            0
        ) + 1;

        const novoChamado = {
            id: novoId,
            categoria,
            sala,
            professor,
            descricao,
            status: "Aberto",
            createdAt: new Date().toISOString()
        };

        chamados.push(novoChamado);
        salvarChamados(chamados);

        res.status(201).json(novoChamado);
    } catch (erro) {
        console.error("Erro ao criar chamado:", erro);
        res.status(500).json({
            erro: "Erro ao criar chamado."
        });
    }
});

// Atualizar status do chamado
app.put("/api/chamados/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID do chamado inválido."
            });
        }

        if (typeof status !== "string" || !status.trim()) {
            return res.status(400).json({
                erro: "O campo status é obrigatório."
            });
        }

        const chamados = lerChamados();
        const index = chamados.findIndex(
            chamado => Number(chamado.id) === id
        );

        if (index === -1) {
            return res.status(404).json({
                erro: "Chamado não encontrado."
            });
        }

        chamados[index].status = status.trim();
        salvarChamados(chamados);

        res.json({
            mensagem: "Status atualizado com sucesso!",
            chamado: chamados[index]
        });
    } catch (erro) {
        console.error("Erro ao atualizar status:", erro);
        res.status(500).json({
            erro: "Erro ao atualizar status do chamado."
        });
    }
});

// Rota não encontrada
app.use((req, res) => {
    res.status(404).json({
        erro: "Rota não encontrada."
    });
});

// Inicializar o servidor uma única vez
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Help Desk iniciado na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});