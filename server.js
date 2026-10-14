const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// Render define as rotas
// O servidor utilizará a porta 3000.
const PORT = process.env.PORT || 3000;

// Caminhos do projeto
const publicDirectory = path.join(__dirname, "public");
const imagesDirectory = path.join(publicDirectory, "imagens");

const databaseDirectory = path.join(__dirname, "data_base");
const databasePath = path.join(databaseDirectory, "chamados.json");

// Middlewares(Ponte do projeto)
app.use(cors());
app.use(express.json());

// Arquivos publicos
app.use(express.static(publicDirectory));

// Imagem da logo
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

// Lendo chamados
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

// Salvando chamados
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

// Lista chamados
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

        if (!categoria || !sala || !professor || !descricao) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios."
            });
        }

        const chamados = lerChamados();

        // Gerarando ID automaticamente
        const novoId = chamados.reduce(
            (maiorId, chamado) =>
                Math.max(maiorId, Number(chamado.id) || 0),
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

// Atualizando status do chamado
app.put("/api/chamados/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID do chamado inválido."
            });
        }

        const statusPermitidos = [
            "Aberto",
            "Em andamento",
            "Resolvido"
        ];

        if (
            typeof status !== "string" ||
            !statusPermitidos.includes(status.trim())
        ) {
            return res.status(400).json({
                erro: "Status inválido. Use Aberto, Em andamento ou Resolvido."
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

// GERANDO RELATÓRIOS DIÁRIOS, SEMANAIS E MENSAIS
// GET /api/relatorios?tipo=diario
// GET /api/relatorios?tipo=semanal
// GET /api/relatorios?tipo=mensal

app.get("/api/relatorios", (req, res) => {
    try {
        const { tipo } = req.query;

        const tiposPermitidos = [
            "diario",
            "semanal",
            "mensal"
        ];

        if (!tiposPermitidos.includes(tipo)) {
            return res.status(400).json({
                erro: "Tipo inválido. Use diario, semanal ou mensal."
            });
        }

        const chamados = lerChamados();
        const agora = new Date();

        let inicio;
        let fim;

        if (tipo === "diario") {
            inicio = new Date(agora);
            inicio.setHours(0, 0, 0, 0);

            fim = new Date(agora);
            fim.setHours(23, 59, 59, 999);

        } else if (tipo === "semanal") {
            inicio = new Date(agora);
            inicio.setHours(0, 0, 0, 0);

            const diaSemana = inicio.getDay();
            const diasDesdeSegunda = (diaSemana + 6) % 7;

            inicio.setDate(
                inicio.getDate() - diasDesdeSegunda
            );

            fim = new Date(inicio);
            fim.setDate(fim.getDate() + 7);
            fim.setMilliseconds(-1);

        } else {
            inicio = new Date(
                agora.getFullYear(),
                agora.getMonth(),
                1,
                0, 0, 0, 0
            );

            fim = new Date(
                agora.getFullYear(),
                agora.getMonth() + 1,
                1,
                0, 0, 0, 0
            );

            fim.setMilliseconds(-1);
        }

        // Filtrando chamados pelo período de criação
        const dados = chamados.filter(chamado => {
            if (!chamado.createdAt) {
                return false;
            }

            const data = new Date(chamado.createdAt);

            if (Number.isNaN(data.getTime())) {
                return false;
            }

            return data >= inicio && data <= fim;
        });

        // Estatísticas por status
        const abertos = dados.filter(
            chamado => chamado.status === "Aberto"
        ).length;

        const emAndamento = dados.filter(
            chamado => chamado.status === "Em andamento"
        ).length;

        const resolvidos = dados.filter(
            chamado => chamado.status === "Resolvido"
        ).length;

        // Resposta do relatório ao ser chamado
        res.json({
            tipo,
            periodo: {
                inicio: inicio.toISOString(),
                fim: fim.toISOString()
            },
            totalChamados: dados.length,
            chamadosAbertos: abertos,
            chamadosEmAndamento: emAndamento,
            chamadosConcluidos: resolvidos,
            dados
        });

    } catch (erro) {
        console.error("Erro ao gerar relatório:", erro);

        res.status(500).json({
            erro: "Erro ao gerar relatório."
        });
    }
});

// Mensagem caso a rota não seja encontrada

app.use((req, res) => {
    res.status(404).json({
        erro: "Rota não encontrada."
    });
});

// Inicializando o servidor uma única vez
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Help Desk iniciado na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});
