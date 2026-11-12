const formulario = document.querySelector("#form-tarefa");
const inputTarefa = document.querySelector("#input-tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");
const contadorTarefas = document.querySelector("#contador-tarefas");

let tarefas = [];
let proximoId = 1;

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}


function carregarTarefas() {
    const dadosSalvos = localStorage.getItem("tarefas");

    if (!dadosSalvos) {
        return;
    }

    try {
        const dados = JSON.parse(dadosSalvos);

        if (!Array.isArray(dados)) {
            return;
        }

        tarefas = dados.filter(function(tarefa) {
            return tarefa !== null &&
                typeof tarefa === "object" &&
                Number.isSafeInteger(tarefa.id) &&
                tarefa.id > 0 &&
                typeof tarefa.texto === "string" &&
                typeof tarefa.concluida === "boolean";
        });

        const ids = tarefas.map(function(tarefa) {
            return tarefa.id;
        });

        proximoId = Math.max(0, ...ids) + 1;

    } catch (erro) {
        console.error(
            "Erro ao carregar tarefas:",
            erro
        );
    }
}


// CREATE
function adicionarTarefa() {
  const texto = inputTarefa.value.trim();

  if (texto === "") {
    return;
  }

  const novaTarefa = {
    id: proximoId,
    texto: texto,
    concluida: false,
  };

  tarefas.push(novaTarefa);
  proximoId++;

  salvarTarefas();
  renderizarTarefas();

  inputTarefa.value = "";
  inputTarefa.focus();
}

// UPDATE - CONCLUIR
function concluirTarefa(id) {
  const tarefa = tarefas.find(function (tarefa) {
    return tarefa.id === id;
  });

  if (tarefa) {
    tarefa.concluida = !tarefa.concluida;
    salvarTarefas();
    renderizarTarefas();
  }
}

// UPDATE - EDITAR
function editarTarefa(id) {
  const tarefa = tarefas.find(function (tarefa) {
    return tarefa.id === id;
  });

  if (!tarefa) {
    return;
  }

  const novoTexto = prompt("Edite sua tarefa:", tarefa.texto);

  if (novoTexto === null) {
    return;
  }

  const textoLimpo = novoTexto.trim();

  if (textoLimpo === "") {
    return;
  }

  tarefa.texto = textoLimpo;

  salvarTarefas();
  renderizarTarefas();
}

// DELETE
function excluirTarefa(id) {
  const confirmar = confirm("Tem certeza que deseja excluir esta tarefa?");

  if (!confirmar) {
    return;
  }

  tarefas = tarefas.filter(function (tarefa) {
    return tarefa.id !== id;
  });

  salvarTarefas();
  renderizarTarefas();
}

// CONTADOR
function atualizarContador() {
  const pendentes = tarefas.filter(function (tarefa) {
    return tarefa.concluida === false;
  });

  contadorTarefas.textContent = `Você tem ${pendentes.length} tarefas pendentes.`;
}

// READ
function renderizarTarefas() {
  listaTarefas.innerHTML = "";

  if (tarefas.length === 0) {
    const mensagem = document.createElement("li");

    mensagem.textContent = "Nenhuma tarefa cadastrada.";
    mensagem.classList.add("mensagem-vazia");

    listaTarefas.appendChild(mensagem);

    atualizarContador();
    return;
  }

  tarefas.forEach(function (tarefa) {
    const li = document.createElement("li");

    const botaoConcluir = document.createElement("button");
    botaoConcluir.textContent = tarefa.concluida ? "↩" : "✓";
    botaoConcluir.classList.add("btn-concluir");
    botaoConcluir.setAttribute(
      "aria-label",
      tarefa.concluida ? "Reabrir tarefa" : "Concluir tarefa",
    );

    const span = document.createElement("span");
    span.textContent = tarefa.texto;

    if (tarefa.concluida) {
      li.classList.add("concluida");
    }

    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    botaoEditar.classList.add("btn-editar");

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.classList.add("btn-excluir");

    botaoConcluir.addEventListener("click", function () {
      concluirTarefa(tarefa.id);
    });

    botaoEditar.addEventListener("click", function () {
      editarTarefa(tarefa.id);
    });

    botaoExcluir.addEventListener("click", function () {
      excluirTarefa(tarefa.id);
    });

    li.appendChild(botaoConcluir);
    li.appendChild(span);
    li.appendChild(botaoEditar);
    li.appendChild(botaoExcluir);

    listaTarefas.appendChild(li);
  });

  atualizarContador();
}

// EVENTO DO FORMULÁRIO
formulario.addEventListener("submit", function (event) {
  event.preventDefault();
  adicionarTarefa();
});

// INICIALIZAÇÃO
carregarTarefas();
renderizarTarefas();
