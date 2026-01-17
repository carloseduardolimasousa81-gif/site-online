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
      }
    });
}
