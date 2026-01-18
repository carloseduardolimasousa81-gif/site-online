klet hoje = new Date();
let mes = hoje.getMonth();
let ano = hoje.getFullYear();
let dias = [];
let diaSelecionado = null;
let imagemSelecionada = null;

const elGrid = document.getElementById("grid");
const elMes = document.getElementById("mes");
const elAno = document.getElementById("ano");
const elModal = document.getElementById("modal");
const elTexto = document.getElementById("textoDia");
const elSelectLojas = document.getElementById("selectLojas");

// === CRIAR DIAS ===
function criarDias() {
  dias = [];
  const total = new Date(ano, mes + 1, 0).getDate();
  for (let i = 1; i <= total; i++) {
    dias.push({ dia: i, info: [], imagem: "" });
  }
}

// === RENDERIZAR CALENDARIO ===
function renderizar() {
  elGrid.innerHTML = "";
  criarDias();
  dias.forEach(d => {
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `<strong>${d.dia}</strong>`;
    if (d.info.length) div.innerHTML += "<br>" + d.info.join(", ");
    if (d.imagem) div.innerHTML += `<br><img src="imagens/${d.imagem}" alt="">`;
    div.onclick = () => abrirModal(d);
    elGrid.appendChild(div);
  });
}

// === MODAL ===
function abrirModal(d) {
  diaSelecionado = d;
  elModal.style.display = "block";
  elSelectLojas.value = "";
  elTexto.value = d.info.join(", ");
}

function fecharModal() {
  elModal.style.display = "none";
}

// === VOLTAR AO HOJE ===
function voltarHoje() {
  const h = new Date();
  mes = h.getMonth();
  ano = h.getFullYear();
  elMes.value = mes;
  elAno.value = ano;
  renderizar();
}

// === LIMPAR CALENDARIO ===
function limparCalendario() {
  dias.forEach(d => {
    d.info = [];
    if (d.imagem) removerImagem(d.imagem);
    d.imagem = "";
  });
  renderizar();
  salvarEstado();
}

// === SALVAR DIAS ===
async function salvar() {
  const selecionadas = Array.from(elSelectLojas.selectedOptions).map(o => o.value).slice(0, 4);
  diaSelecionado.info = selecionadas;

  if (imagemSelecionada instanceof File) {
    const idImg = `img-${ano}-${mes}-${diaSelecionado.dia}.png`;
    await salvarImagem(idImg, imagemSelecionada);
    diaSelecionado.imagem = idImg;
  } else if (imagemSelecionada === '') {
    if (diaSelecionado.imagem) removerImagem(diaSelecionado.imagem);
    diaSelecionado.imagem = '';
  }

  fecharModal();
  renderizar();
}

// === LISTENERS DE MÊS E ANO ===
elMes.addEventListener('change', () => {
  mes = parseInt(elMes.value);
  renderizar();
});

elAno.addEventListener('change', () => {
  ano = parseInt(elAno.value);
  renderizar();
});

// === PERSISTÊNCIA NO SERVIDOR ===
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
      }
      renderizar();
    });
}

// === SOBREESCREVE RENDER PARA SALVAR AUTOMATICAMENTE ===
const _renderizarOriginal = renderizar;
renderizar = function() {
  _renderizarOriginal();
  salvarEstado();
};

// === INICIALIZAÇÃO ===
document.addEventListener("DOMContentLoaded", restaurarEstado);

