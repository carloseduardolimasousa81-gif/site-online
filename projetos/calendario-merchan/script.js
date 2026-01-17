let hoje = new Date();
let mes = hoje.getMonth();
let ano = hoje.getFullYear();

let dias = [];

const elGrid = document.getElementById("grid");
const elMes = document.getElementById("mes");
const elAno = document.getElementById("ano");
const elModal = document.getElementById("modal");
const elTexto = document.getElementById("textoDia");

function criarDias() {
  dias = [];
  const total = new Date(ano, mes + 1, 0).getDate();
  for (let i = 1; i <= total; i++) {
    dias.push({ dia: i, info: "" });
  }
}

function renderizar() {
  elGrid.innerHTML = "";
  criarDias();

  dias.forEach(d => {
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `<strong>${d.dia}</strong><br>${d.info || ""}`;
    div.onclick = () => abrirModal(d);
    elGrid.appendChild(div);
  });
}

let diaAtual = null;

function abrirModal(dia) {
  diaAtual = dia;
  elTexto.value = dia.info;
  elModal.style.display = "block";
}

function salvarDia() {
  if (diaAtual) {
    diaAtual.info = elTexto.value;
    fecharModal();
    renderizar();
  }
}

function fecharModal() {
  elModal.style.display = "none";
}

function voltarHoje() {
  const h = new Date();
  mes = h.getMonth();
  ano = h.getFullYear();
  elMes.value = mes;
  elAno.value = ano;
  renderizar();
}

elMes.addEventListener("change", () => {
  mes = parseInt(elMes.value);
  renderizar();
});

elAno.addEventListener("change", () => {
  ano = parseInt(elAno.value);
  renderizar();
});

/* ====== PERSISTÊNCIA NO SERVIDOR ====== */

function salvarEstado() {
  fetch("salvar.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dias)
  });
}

function restaurarEstado() {
  fetch("carregar.php")
    .then(r => r.json())
    .then(dados => {
      if (dados && dados.length) {
        dias = dados;
        renderizar();
      } else {
        renderizar();
      }
    });
}

const _renderizarOriginal = renderizar;
renderizar = function () {
  _renderizarOriginal();
  salvarEstado();
};

document.addEventListener("DOMContentLoaded", restaurarEstado);
