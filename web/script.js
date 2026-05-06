const API = "http://localhost:3000/tarefas";

function trocarPagina(pagina) {
  document.querySelectorAll("section").forEach(sec => {
    sec.classList.remove("ativo");
  });
  document.getElementById(pagina).classList.add("ativo");
}

function abrirModal() {
  document.getElementById("modal").style.display = "block";
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
    alert("Preencha os campos obrigatorios");
    return;
  }

  await fetch(`${API}/cadastrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      titulo,
      descricao,
      datainicio,
      datafinal,
      imgurl
    })
  });

  limparCampos();
  fecharModal();
  carregarTarefas();
}

async function carregarTarefas() {
  const res = await fetch(`${API}/listar`);
  const tarefas = await res.json();

  const container = document.getElementById("cards");
  if (!container) return;

  container.innerHTML = "";

  tarefas.forEach(t => {
    container.innerHTML += `
      <div class="card">
        <img src="${t.imgurl || 'https://picsum.photos/200'}">

        <h3>${t.titulo}</h3>
        <p>${t.descricao}</p>

        <small>
          ${formatarData(t.datainicio)} → ${formatarData(t.datafinal)}
        </small>

        <br><br>

        <button onclick="deletar(${t.id})">Excluir</button>
      </div>
    `;
  });
}

async function deletar(id) {
  await fetch(`${API}/excluir/${id}`, {
    method: "DELETE"
  });

  carregarTarefas();
}

const key = "SUA_API_KEY";

async function buscarCidade(cidade) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`
    );

    const dados = await res.json();

    if (dados.cod != 200) {
      alert("Cidade não encontrada!");
      return;
    }

    mostrarTemperatura(dados);

  } catch (e) {
    alert("Erro ao buscar clima");
  }
}

function mostrarTemperatura(dados) {
  document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name;
  document.querySelector(".temp").innerHTML = Math.floor(dados.main.temp) + "°C";
  document.querySelector(".texto-previsao").innerHTML = dados.weather[0].description;
  document.querySelector(".umidade").innerHTML = "Umidade: " + dados.main.humidity + "%";
  document.querySelector(".img-previsao").src =
    `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`;
}

function buscarTemp() {
  const cidade = document.querySelector(".input-cidade").value.trim();

  if (!cidade) return alert("Digite uma cidade");

  buscarCidade(cidade);
}

function limparCampos() {
  document.getElementById("titulo").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("datainicio").value = "";
  document.getElementById("datafinal").value = "";
  document.getElementById("imgurl").value = "";
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

carregarTarefas();