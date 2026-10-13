// CATEGORIA SELECIONADA

let categoriaSelecionada = null;

// ELEMENTOS

const botoesCategoria =
    document.querySelectorAll(".category");

const submitButton =
    document.getElementById("submitButton");

const newTicketButton =
    document.getElementById("newTicketButton");

// SELECIONAR CATEGORIA

botoesCategoria.forEach((botao) => {

    botao.addEventListener("click", () => {

        categoriaSelecionada =
            botao.dataset.category;
        // Selecionando categoria
        console.log(
            "Categoria:",
            categoriaSelecionada
        );

        // Remover seleção anterior
        botoesCategoria.forEach((item) => {

            item.classList.remove(
                "selecionada"
            );

        });

        // Selecionar botão atual
        botao.classList.add(
            "selecionada"
        );

    });

});

// ABRIR CHAMADO

submitButton.addEventListener(
    "click",
    abrirChamado
);

async function abrirChamado() {

    const sala =
        document
            .getElementById("sala")
            .value
            .trim();

    const professor =
        document
            .getElementById("professor")
            .value
            .trim();

    const descricao =
        document
            .getElementById("description")
            .value
            .trim();

    // VALIDAÇÕES

    if (!categoriaSelecionada) {

        alert(
            "Selecione uma categoria."
        );

        return;
    }

    if (!sala) {

        alert(
            "Informe sua sala."
        );

        return;
    }

    if (!professor) {

        alert(
            "Informe seu nome."
        );

        return;
    }

    if (!descricao) {

        alert(
            "Descreva o problema."
        );

        return;
    }

    // ALTERNANDO BOTÃO

    submitButton.disabled = true;

    submitButton.textContent =
        "Enviando...";

    try {

        const resposta =
            await fetch(
                "/api/chamados",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        categoria:
                            categoriaSelecionada,

                        sala:
                            sala,

                        professor:
                            professor,

                        descricao:
                            descricao

                    })

                }
            );

        const chamado =
            await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                chamado.erro ||
                "Erro ao criar chamado."
            );

        }

        // SUCESSO

        mostrarSucesso(
            chamado
        );

    } catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível abrir o chamado."
        );

    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
            "Abrir chamado";

    }

}

// MOSTRAR MENSAGEM DE SUCESSO CASO CONCLUÍDO

function mostrarSucesso(chamado) {

    document.getElementById(
        "modalCategory"
    ).textContent =
        chamado.categoria;

    document.getElementById(
        "modalDescription"
    ).textContent =
        chamado.descricao;

    document.getElementById(
        "successModal"
    ).classList.remove(
        "hidden"
    );

}

// NOVO CHAMADO

newTicketButton.addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "successModal"
            )
            .classList.add(
                "hidden"
            );

        document.getElementById(
            "sala"
        ).value = "";

        document.getElementById(
            "professor"
        ).value = "";

        document.getElementById(
            "description"
        ).value = "";

        categoriaSelecionada =
            null;

        botoesCategoria.forEach(
            (botao) => {

                botao.classList.remove(
                    "selecionada"
                );

            }
        );

    }
);