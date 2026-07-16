const CHAVE_STORAGE = "alimentos-tabelas";

const alimentosIniciais = [
  { id: 1, nome: "Maçã", categoria: "frutas", gramas: 150, vezes: 1 },
  { id: 2, nome: "Banana", categoria: "frutas", gramas: 120, vezes: 1 },
  { id: 3, nome: "Laranja", categoria: "frutas", gramas: 130, vezes: 1 },
  { id: 4, nome: "Morango", categoria: "frutas", gramas: 100, vezes: 2 },
  { id: 5, nome: "Uva", categoria: "frutas", gramas: 80, vezes: 2 },
  { id: 6, nome: "Pera", categoria: "frutas", gramas: 140, vezes: 1 },
  { id: 7, nome: "Manga", categoria: "frutas", gramas: 160, vezes: 1 },
  { id: 8, nome: "Abacaxi", categoria: "frutas", gramas: 150, vezes: 1 },
  { id: 9, nome: "Kiwi", categoria: "frutas", gramas: 90, vezes: 2 },
  { id: 10, nome: "Melancia", categoria: "frutas", gramas: 200, vezes: 1 },
  { id: 11, nome: "Frango", categoria: "proteinas", gramas: 200, vezes: 1 },
  { id: 12, nome: "Carne", categoria: "proteinas", gramas: 180, vezes: 1 },
  { id: 13, nome: "Peixe", categoria: "proteinas", gramas: 160, vezes: 1 },
  { id: 14, nome: "Ovo", categoria: "proteinas", gramas: 120, vezes: 2 },
  { id: 15, nome: "Feijão", categoria: "proteinas", gramas: 150, vezes: 1 },
  { id: 16, nome: "Tofu", categoria: "proteinas", gramas: 140, vezes: 1 },
  { id: 17, nome: "Atum", categoria: "proteinas", gramas: 130, vezes: 1 },
  { id: 18, nome: "Soja", categoria: "proteinas", gramas: 100, vezes: 2 },
  { id: 19, nome: "Queijo", categoria: "proteinas", gramas: 90, vezes: 1 },
  { id: 20, nome: "Tilápia", categoria: "proteinas", gramas: 170, vezes: 1 },
];

function carregarAlimentos() {
  try {
    const dadosSalvos = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
    return Array.isArray(dadosSalvos) ? dadosSalvos : alimentosIniciais;
  } catch {
    return alimentosIniciais;
  }
}

let alimentos = carregarAlimentos();
const ordemCrescente = { frutas: true, proteinas: true };

function salvarAlimentos() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(alimentos));
}

function criarLinha(alimento) {
  const linha = document.createElement("tr");
  linha.dataset.id = alimento.id;

  const nome = document.createElement("td");
  nome.textContent = alimento.nome;

  const gramas = document.createElement("td");
  gramas.textContent = `${alimento.gramas} g`;

  const vezes = document.createElement("td");
  vezes.textContent = `${alimento.vezes} ${alimento.vezes === 1 ? "vez" : "vezes"}`;

  const acoes = document.createElement("td");
  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "excluir";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.setAttribute("aria-label", `Excluir ${alimento.nome}`);
  acoes.appendChild(botaoExcluir);

  linha.append(nome, gramas, vezes, acoes);
  return linha;
}

function renderizarCategoria(categoria) {
  const secao = document.querySelector(`[data-categoria="${categoria}"]`);
  const corpo = secao.querySelector("tbody");
  const filtro = secao.querySelector(".filtro-consumo").value;
  const listaFiltrada = alimentos.filter(
    (alimento) =>
      alimento.categoria === categoria &&
      (filtro === "todos" || alimento.vezes === Number(filtro)),
  );

  corpo.replaceChildren(...listaFiltrada.map(criarLinha));

  const total = listaFiltrada.reduce(
    (soma, alimento) => soma + alimento.gramas * alimento.vezes,
    0,
  );
  secao.querySelector(".total").textContent = `Total diário exibido: ${total} g`;
}

function renderizarTudo() {
  renderizarCategoria("frutas");
  renderizarCategoria("proteinas");
}

document.querySelector("#form-alimento").addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = document.querySelector("#nome").value.trim();
  const categoria = document.querySelector("#categoria").value;
  const gramas = Number(document.querySelector("#gramas").value);
  const vezes = Number(document.querySelector("#vezes").value);

  if (!nome || gramas <= 0 || ![1, 2].includes(vezes)) return;

  alimentos.push({ id: Date.now(), nome, categoria, gramas, vezes });
  salvarAlimentos();
  renderizarTudo();

  evento.currentTarget.reset();
  const mensagem = document.querySelector("#mensagem");
  mensagem.textContent = `${nome} foi adicionado com sucesso.`;
  setTimeout(() => (mensagem.textContent = ""), 3000);
});

document.querySelectorAll(".secao-tabela").forEach((secao) => {
  const categoria = secao.dataset.categoria;

  secao.querySelector(".filtro-consumo").addEventListener("change", () => {
    renderizarCategoria(categoria);
  });

  secao.querySelector(".ordenar-gramas").addEventListener("click", (evento) => {
    alimentos.sort((a, b) => {
      if (a.categoria !== categoria || b.categoria !== categoria) return 0;
      return ordemCrescente[categoria] ? a.gramas - b.gramas : b.gramas - a.gramas;
    });

    evento.currentTarget.textContent = ordemCrescente[categoria]
      ? "Gramas por vez ↑"
      : "Gramas por vez ↓";
    ordemCrescente[categoria] = !ordemCrescente[categoria];
    salvarAlimentos();
    renderizarCategoria(categoria);
  });

  secao.querySelector("tbody").addEventListener("click", (evento) => {
    const linha = evento.target.closest("tr");
    if (!linha) return;

    if (evento.target.classList.contains("excluir")) {
      alimentos = alimentos.filter((alimento) => alimento.id !== Number(linha.dataset.id));
      salvarAlimentos();
      renderizarCategoria(categoria);
      return;
    }

    linha.classList.toggle("selecionada");
  });
});

salvarAlimentos();
renderizarTudo();
