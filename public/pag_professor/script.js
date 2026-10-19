// ENDEREÇO DA API
const API_URL = "/api";

// CATEGORIA E CAMPUS SELECIONADOS
let categoriaSelecionada = null;
let campusSelecionado = null;

// ELEMENTOS
const botoesCategoria = document.querySelectorAll(".category");
const botoesCampus = document.querySelectorAll(".campus-option");
const submitButton = document.getElementById("submitButton");
const newTicketButton = document.getElementById("newTicketButton");

// SELECIONAR CATEGORIA (Apenas entre as categorias)
botoesCategoria.forEach((botao) => {
    botao.addEventListener("click", () => {
        categoriaSelecionada = botao.dataset.category;

        console.log("Categoria:", categoriaSelecionada);

        // Remover seleção apenas das outras categorias
        botoesCategoria.forEach((item) => {
            item.classList.remove("selecionada");
        });

        // Selecionar botão atual
        botao.classList.add("selecionada");
    });
});

// SELECIONAR CAMPUS (Apenas entre os campi, mantendo a categoria intacta)
botoesCampus.forEach((botao) => {
    botao.addEventListener("click", () => {
        campusSelecionado = botao.dataset.campus;

        console.log("Campus:", campusSelecionado);

        // Remover seleção apenas dos outros botões de campus
        botoesCampus.forEach((item) => {
            item.classList.remove("selecionada");
        });

        // Selecionar botão atual
        botao.classList.add("selecionada");
    });
});

// ABRIR CHAMADO
submitButton.addEventListener("click", abrirChamado);

async function abrirChamado() {
    const sala = document.getElementById("sala").value.trim();
    const professor = document.getElementById("professor").value.trim();
    const descricao = document.getElementById("description").value.trim();

    // VALIDAÇÕES
    if (!campusSelecionado) {
        alert("Por favor, selecione um campus.");
        return;
    }

    if (!categoriaSelecionada) {
        alert("Selecione uma categoria.");
        return;
    }

    if (!sala) {
        alert("Informe sua sala.");
        return;
    }

    if (!professor) {
        alert("Informe seu nome.");
        return;
    }

    if (!descricao) {
        alert("Descreva o problema.");
        return;
    }

    // ALTERNANDO BOTÃO
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    try {
        // Define a rota específica para o campus selecionado
        const endpoint = `${API_URL}/${campusSelecionado}/chamados`;

        const resposta = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                categoria: categoriaSelecionada,
                sala: sala,
                professor: professor,
                descricao: descricao
            })
        });

        const chamado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                chamado.erro || "Erro ao criar chamado."
            );
        }

        // SUCESSO
        serverMostrarSucesso(chamado);

    } catch (erro) {
        console.error("Erro ao abrir chamado:", erro);

        alert(
            "Não foi possível abrir o chamado. Verifique sua conexão e tente novamente."
        );

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Abrir chamado";
    }
}

// MOSTRAR MENSAGEM DE SUCESSO
function serverMostrarSucesso(chamado) {
    document.getElementById("modalCategory").textContent =
        chamado.categoria;

    document.getElementById("modalDescription").textContent =
        chamado.descricao;

    document.getElementById("successModal").classList.remove("hidden");
}

// NOVO CHAMADO
newTicketButton.addEventListener("click", () => {
    document.getElementById("successModal").classList.add("hidden");

    document.getElementById("sala").value = "";
    document.getElementById("professor").value = "";
    document.getElementById("description").value = "";

    categoriaSelecionada = null;
    campusSelecionado = null;

    botoesCategoria.forEach((botao) => {
        botao.classList.remove("selecionada");
    });

    botoesCampus.forEach((botao) => {
        botao.classList.remove("selecionada");
    });
});