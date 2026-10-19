const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

const publicDirectory = path.join(__dirname, "public");
const imagesDirectory = path.join(publicDirectory, "imagens");
const databaseDirectory = path.join(__dirname, "data_base");

// Bancos de dados separados por campus
const dbNeovillePath = path.join(databaseDirectory, "chamados_neoville.json");
const dbHauerPath = path.join(databaseDirectory, "chamados_hauer.json");

app.use(cors());
app.use(express.json());
app.use(express.static(publicDirectory));
app.use("/imagens", express.static(imagesDirectory));

// Preparar os arquivos JSON para ambos os campus
function prepararBancos() {
    if (!fs.existsSync(databaseDirectory)) {
        fs.mkdirSync(databaseDirectory, { recursive: true });
    }

    if (!fs.existsSync(dbNeovillePath)) {
        fs.writeFileSync(dbNeovillePath, "[]", "utf8");
    }

    if (!fs.existsSync(dbHauerPath)) {
        fs.writeFileSync(dbHauerPath, "[]", "utf8");
    }
}

prepararBancos();

function lerChamados(campus) {
    const filePath = campus === "hauer" ? dbHauerPath : dbNeovillePath;
    if (!fs.existsSync(filePath)) return [];
    
    const dados = fs.readFileSync(filePath, "utf8");
    if (!dados.trim()) return [];

    const chamados = JSON.parse(dados);
    return Array.isArray(chamados) ? chamados : [];
}

function salvarChamados(campus, chamados) {
    const filePath = campus === "hauer" ? dbHauerPath : dbNeovillePath;
    fs.writeFileSync(filePath, JSON.stringify(chamados, null, 4), "utf8");
}

// Rotas da API para Neoville
app.get("/api/neoville/chamados", (req, res) => {
    try {
        res.json(lerChamados("neoville"));
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao ler chamados do Neoville." });
    }
});

app.post("/api/neoville/chamados", (req, res) => {
    try {
        const { categoria, sala, professor, descricao } = req.body;
        if (!categoria || !sala || !professor || !descricao) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }
        const chamados = lerChamados("neoville");
        const novoId = chamados.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) + 1;
        const novoChamado = { id: novoId, categoria, sala, professor, descricao, status: "Aberto", createdAt: new Date().toISOString() };
        
        chamados.push(novoChamado);
        salvarChamados("neoville", chamados);
        res.status(201).json(novoChamado);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao criar chamado." });
    }
});

app.put("/api/neoville/chamados/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const chamados = lerChamados("neoville");
        const index = chamados.findIndex(c => Number(c.id) === id);
        if (index === -1) return res.status(404).json({ erro: "Chamado não encontrado." });

        chamados[index].status = status.trim();
        salvarChamados("neoville", chamados);
        res.json({ mensagem: "Status atualizado com sucesso!", chamado: chamados[index] });
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao atualizar status." });
    }
});

app.get("/api/neoville/relatorios", (req, res) => {
    try {
        const { tipo } = req.query;
        const chamados = lerChamados("neoville");
        gerarDadosRelatorio(tipo, chamados, res);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao gerar relatório." });
    }
});

// Rotas da API para Hauer
app.get("/api/hauer/chamados", (req, res) => {
    try {
        res.json(lerChamados("hauer"));
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao ler chamados do Hauer." });
    }
});

app.post("/api/hauer/chamados", (req, res) => {
    try {
        const { categoria, sala, professor, descricao } = req.body;
        if (!categoria || !sala || !professor || !descricao) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }
        const chamados = lerChamados("hauer");
        const novoId = chamados.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) + 1;
        const novoChamado = { id: novoId, categoria, sala, professor, descricao, status: "Aberto", createdAt: new Date().toISOString() };
        
        chamados.push(novoChamado);
        salvarChamados("hauer", chamados);
        res.status(201).json(novoChamado);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao criar chamado." });
    }
});

app.put("/api/hauer/chamados/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const chamados = lerChamados("hauer");
        const index = chamados.findIndex(c => Number(c.id) === id);
        if (index === -1) return res.status(404).json({ erro: "Chamado não encontrado." });

        chamados[index].status = status.trim();
        salvarChamados("hauer", chamados);
        res.json({ mensagem: "Status atualizado com sucesso!", chamado: chamados[index] });
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao atualizar status." });
    }
});

app.get("/api/hauer/relatorios", (req, res) => {
    try {
        const { tipo } = req.query;
        const chamados = lerChamados("hauer");
        gerarDadosRelatorio(tipo, chamados, res);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao gerar relatório." });
    }
});

// Função auxiliar para estruturar relatórios
function gerarDadosRelatorio(tipo, chamados, res) {
    const agora = new Date();
    const chamadosFiltrados = chamados.filter(chamado => {
        if (!chamado.createdAt) return false;
        const dataChamado = new Date(chamado.createdAt);
        if (tipo === "diario") {
            return dataChamado.getDate() === agora.getDate() &&
                   dataChamado.getMonth() === agora.getMonth() &&
                   dataChamado.getFullYear() === agora.getFullYear();
        } else if (tipo === "semanal") {
            const umaSemanaAtras = new Date();
            umaSemanaAtras.setDate(agora.getDate() - 7);
            return dataChamado >= umaSemanaAtras && dataChamado <= agora;
        } else if (tipo === "mensal") {
            return dataChamado.getMonth() === agora.getMonth() &&
                   dataChamado.getFullYear() === agora.getFullYear();
        }
        return true;
    });

    const total = chamadosFiltrados.length;
    const abertos = chamadosFiltrados.filter(c => c.status === "Aberto").length;
    const concluidos = total - abertos;

    res.json({
        tipo: tipo || "geral",
        totalChamados: total,
        chamadosAbertos: abertos,
        chamadosConcluidos: concluidos,
        dados: chamadosFiltrados
    });
}

app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada." });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Help Desk multi-campus iniciado na porta ${PORT}`);
});