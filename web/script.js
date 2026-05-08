const API = "http://localhost:3000/tarefas";

function abrirModal() {
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

async function salvarTarefa() {

  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  const datainicio = document.getElementById("datainicio").value;
  const datafinal = document.getElementById("datafinal").value;
  const imgurl = document.getElementById("imgurl").value;

  if (!titulo || !descricao) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  const tarefa = {
    titulo,
    descricao,
    datainicio,
    datafinal,
    imgurl
  };

  try {

    const response = await fetch(`${API}/cadastrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tarefa)
    });

    if (!response.ok) {
      throw new Error("Erro ao cadastrar");
    }

    alert("Tarefa cadastrada!");

    limparCampos();

    fecharModal();

    carregarTarefas();

  } catch (erro) {

    console.error(erro);

    alert("Erro ao salvar tarefa");
  }
}

async function carregarTarefas() {

  try {

    const response = await fetch(`${API}/listar`);

    const tarefas = await response.json();

    const container = document.getElementById("cards");

    if (!container) return;

    container.innerHTML = "";

    tarefas.forEach((tarefa) => {

      container.innerHTML += `
      
        <div class="card">

          <img 
            src="${tarefa.imgurl || 'https://picsum.photos/300'}"
            alt="imagem"
          >

          <h2>${tarefa.titulo}</h2>

          <p>${tarefa.descricao}</p>

          <small>
            ${formatarData(tarefa.datainicio)}
            até
            ${formatarData(tarefa.datafinal)}
          </small>

          <br><br>

          <button onclick="deletarTarefa(${tarefa.id})">
            Excluir
          </button>

        </div>

      `;
    });

  } catch (erro) {

    console.error(erro);

    alert("Erro ao carregar tarefas");
  }
}

async function deletarTarefa(id) {

  try {

    await fetch(`${API}/excluir/${id}`, {
      method: "DELETE"
    });

    carregarTarefas();

  } catch (erro) {

    console.error(erro);

    alert("Erro ao deletar tarefa");
  }
}

function limparCampos() {

  document.getElementById("titulo").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("datainicio").value = "";
  document.getElementById("datafinal").value = "";
  document.getElementById("imgurl").value = "";
}

function formatarData(data) {

  if (!data) return "";

  return new Date(data).toLocaleDateString("pt-BR");
}

const key = "SUA_API_KEY";

async function buscarCidade(cidade) {

  try {

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`
    );

    const dados = await response.json();

    if (dados.cod != 200) {
      alert("Cidade não encontrada");
      return;
    }

    mostrarTemperatura(dados);

  } catch (erro) {

    console.error(erro);

    alert("Erro ao buscar clima");
  }
}

function mostrarTemperatura(dados) {

  document.querySelector(".cidade").innerHTML =
    "Tempo em " + dados.name;

  document.querySelector(".temp").innerHTML =
    Math.floor(dados.main.temp) + "°C";

  document.querySelector(".texto-previsao").innerHTML =
    dados.weather[0].description;

  document.querySelector(".umidade").innerHTML =
    "Umidade: " + dados.main.humidity + "%";

  document.querySelector(".img-previsao").src =
    `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`;
}

function buscarTemp() {

  const cidade = document
    .querySelector(".input-cidade")
    .value
    .trim();

  if (!cidade) {
    alert("Digite uma cidade");
    return;
  }

  buscarCidade(cidade);
}

carregarTarefas();