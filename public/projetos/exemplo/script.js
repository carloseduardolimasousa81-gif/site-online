async function salvar() {
  const texto = document.getElementById("msg").value;
  if (!texto) return;

  await fetch("/api.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto })
  });

  document.getElementById("msg").value = "";
  carregar();
}

async function carregar() {
  const resp = await fetch("/api.php");
  const dados = await resp.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  dados.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.texto + " (" + item.data + ")";
    lista.appendChild(li);
  });
}

carregar();
