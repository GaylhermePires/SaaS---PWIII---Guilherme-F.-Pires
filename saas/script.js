const input = document.getElementById("inputTarefa");
const btnAdicionar = document.getElementById("btnAdicionar");
const lista = document.getElementById("listaTarefas");
const total = document.getElementById("total");
const mensagemVazia = document.getElementById("mensagemVazia");
const filtros = document.querySelectorAll(".filtro");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let filtroAtual = "todas";

// Salva as tarefas no navegador
function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Mostra as tarefas na tela
function mostrarTarefas() {

    lista.innerHTML = "";

    let tarefasFiltradas = tarefas;

    if (filtroAtual === "pendentes") {
        tarefasFiltradas = tarefas.filter(tarefa => !tarefa.concluida);
    }

    if (filtroAtual === "concluidas") {
        tarefasFiltradas = tarefas.filter(tarefa => tarefa.concluida);
    }

    tarefasFiltradas.forEach(tarefa => {

        const div = document.createElement("div");

        div.classList.add("tarefa");

        if (tarefa.concluida) {
            div.classList.add("concluida");
        }

        div.innerHTML = `
            <button class="check"></button>

            <span class="nome-tarefa">
                ${tarefa.nome}
            </span>

            <button class="excluir">
                Excluir
            </button>
        `;

        const check = div.querySelector(".check");
        const excluir = div.querySelector(".excluir");

        check.addEventListener("click", function() {
            concluirTarefa(tarefa.id);
        });

        excluir.addEventListener("click", function() {
            excluirTarefa(tarefa.id);
        });

        lista.appendChild(div);
    });

    atualizarTela(tarefasFiltradas);
}

// Atualiza contador e mensagem
function atualizarTela(tarefasFiltradas) {

    total.textContent = tarefas.length;

    if (tarefasFiltradas.length === 0) {
        mensagemVazia.style.display = "block";
        lista.style.display = "none";
    } else {
        mensagemVazia.style.display = "none";
        lista.style.display = "block";
    }
}

// Adiciona uma nova tarefa
function adicionarTarefa() {

    const nome = input.value.trim();

    if (nome === "") {
        alert("Digite uma tarefa primeiro!");
        input.focus();
        return;
    }

    const novaTarefa = {
        id: Date.now(),
        nome: nome,
        concluida: false
    };

    tarefas.push(novaTarefa);

    salvarTarefas();

    input.value = "";

    mostrarTarefas();

    input.focus();
}

// Marca ou desmarca uma tarefa
function concluirTarefa(id) {

    tarefas = tarefas.map(tarefa => {

        if (tarefa.id === id) {
            tarefa.concluida = !tarefa.concluida;
        }

        return tarefa;
    });

    salvarTarefas();
    mostrarTarefas();
}

// Exclui uma tarefa
function excluirTarefa(id) {

    tarefas = tarefas.filter(tarefa => tarefa.id !== id);

    salvarTarefas();
    mostrarTarefas();
}

// Botão adicionar
btnAdicionar.addEventListener("click", adicionarTarefa);

// Adicionar apertando Enter
input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        adicionarTarefa();
    }
});

// Filtros
filtros.forEach(botao => {

    botao.addEventListener("click", function() {

        filtros.forEach(b => {
            b.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        filtroAtual = botao.dataset.filtro;

        mostrarTarefas();
    });
});

// Inicia o sistema
mostrarTarefas();