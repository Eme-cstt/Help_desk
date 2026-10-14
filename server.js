const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");
const cors = require("cors");

const app = express();

// O servidor utilizará a porta definida pelo Render ou 3000 localmente.
const PORT = process.env.PORT || 3000;

// Configuração do Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("ERRO CRÍTICO: As variáveis SUPABASE_URL e SUPABASE_KEY precisam estar configuradas.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Caminhos do projeto
const publicDirectory = path.join(__dirname, "public");
const imagesDirectory = path.join(publicDirectory, "imagens");

// Middlewares
app.use(cors());
app.use(express.json());

// Arquivos públicos
app.use(express.static(publicDirectory));
app.use("/imagens", express.static(imagesDirectory));

// Página inicial
app.get("/", (req, res) => {
    res.sendFile(
        path.join(publicDirectory, "pag_professor", "index.html")
    );
});

// Verificar se a API está funcionando
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        mensagem: "Help Desk funcionando com Supabase."
    });
});

// Lista chamados
app.get("/api/chamados", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("chamados")
            .select("*")
            .order("id", { ascending: false });

        if (error) throw error;

        // Mapeia created_at para createdAt para manter padrão do front-end se necessário
        const chamados = data.map(item => ({
            ...item,
            createdAt: item.created_at
        }));

        res.json(chamados);
    } catch (erro) {
        console.error("Erro ao ler chamados:", erro);
        res.status(500).json({
            erro: "Erro ao ler os chamados."
        });
    }
});

// Criar chamado
app.post("/api/chamados", async (req, res) => {
    try {
        const { categoria, sala, professor, descricao } = req.body;

        if (!categoria || !sala || !professor || !descricao) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios."
            });
        }

        const { data, error } = await supabase
            .from("chamados")
            .insert([
                {
                    categoria,
                    sala,
                    professor,
                    descricao,
                    status: "Aberto"
                }
            ])
            .select()
            .single();

        if (error) throw error;

        const novoChamado = {
            ...data,
            createdAt: data.created_at
        };

        res.status(201).json(novoChamado);
    } catch (erro) {
        console.error("Erro ao criar chamado:", erro);
        res.status(500).json({
            erro: "Erro ao criar chamado."
        });
    }
});

// Atualizando status do chamado
app.put("/api/chamados/:id", async (req, res) => {
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

        const { data, error } = await supabase
            .from("chamados")
            .update({ status: status.trim() })
            .eq("id", id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                erro: "Chamado não encontrado."
            });
        }

        const chamadoAtualizado = {
            ...data[0],
            createdAt: data[0].created_at
        };

        res.json({
            mensagem: "Status atualizado com sucesso!",
            chamado: chamadoAtualizado
        });
    } catch (erro) {
        console.error("Erro ao atualizar status:", erro);
        res.status(500).json({
            erro: "Erro ao atualizar status do chamado."
        });
    }
});

// GERANDO RELATÓRIOS DIÁRIOS, SEMANAIS E MENSAIS
app.get("/api/relatorios", async (req, res) => {
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

        // Consulta filtrada no Postgres via Supabase
        const { data, error } = await supabase
            .from("chamados")
            .select("*")
            .gte("created_at", inicio.toISOString())
            .lte("created_at", fim.toISOString());

        if (error) throw error;

        const dados = data.map(item => ({
            ...item,
            createdAt: item.created_at
        }));

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

// Rota 404
app.use((req, res) => {
    res.status(404).json({
        erro: "Rota não encontrada."
    });
});

// Inicializando o servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Help Desk iniciado na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});
