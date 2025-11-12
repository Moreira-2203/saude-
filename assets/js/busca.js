
const clinicas = [
  {
    id: "clinicamulher",
    nome: "Clínica da Mulher",
    endereco: "Tv. Arildo Ferreira Da Silva, 5 - Barreira",
    horario: "07h da manhã às 17h da tarde",
    descricao: "Clínica Municipal especializada em Atenção Integral à Saúde da Mulher do município de Saquarema.",
    imagem: "../../assets/img/clinicadamulher.jpg",
  },
  {
    id: "capsad",
    nome: "Centro de Atenção Psicossocial de Saquarema – CAPS AD",
    endereco: "Rua Adolfo Bravo, n° 28 - Bacaxá",
    horario: "08h da manhã às 17h da tarde",
    descricao: "Clínica de Saúde especializada em atendimento psicossocial, oferecendo suporte, acompanhamento e cuidado em saúde mental aos moradores de Saquarema.",
    imagem: "../../assets/img/caps.png",
  },
];

function criarCard(clinica) {
  return `
    <div class="card">
      <img src="${clinica.imagem}" class="card-img" alt="${clinica.nome}">
      <div class="card-info">
        <h2>${clinica.nome}</h2>
        <p>${clinica.endereco}</p>
        <p>Horário de Funcionamento: <strong>${clinica.horario}</strong></p>
        <p>${clinica.descricao}</p>

        <!-- Botão superior -->
        <div class="btn-top">
          <button class="btn-main btn-agendar" data-id="${clinica.id}">
            Agendar consulta <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- Grupo inferior -->
        <div class="btn-group">
          <button class="btn-secondary btn-contato" data-id="${clinica.id}">
            Entre em contato <i class="fa-solid fa-envelope"></i>
          </button>

          <button class="btn-secondary btn-mapa" data-id="${clinica.id}">
            Mostrar no mapa <i class="fa-solid fa-location-dot"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}


function buscarClinica() {
  const termo = document.getElementById("search-input").value.toLowerCase().trim();
  const cardsContainer = document.getElementById("cards");

  cardsContainer.innerHTML = "";

  if (!termo) return;

  const resultados = clinicas.filter(c =>
    c.nome.toLowerCase().includes(termo)
  );

  if (resultados.length > 0) {
    resultados.forEach(clinica => {
      cardsContainer.innerHTML += criarCard(clinica);
    });
  } else {
    cardsContainer.innerHTML = `
      <p style="text-align:center; padding:20px; font-size:18px;">
        Nenhuma clínica encontrada.
      </p>`;
  }
}

document.getElementById("search-btn").addEventListener("click", buscarClinica);
document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") buscarClinica();
});


document.addEventListener("click", (e) => {
  const btnAgendar = e.target.closest(".btn-agendar");
  const btnContato = e.target.closest(".btn-contato");

  if (btnAgendar) {
    const id = btnAgendar.getAttribute("data-id");
    localStorage.setItem("selectedClinica", id);
    const url = `../../pages/dashboard/agendamento.html?clinica=${encodeURIComponent(id)}`;
    window.location.href = url;
  }

  if (btnContato) {
    const id = btnContato.getAttribute("data-id");
    localStorage.setItem("selectedClinica", id);
    const url = `../../pages/dashboard/contato.html?clinica=${encodeURIComponent(id)}`;
    window.location.href = url;
  }
});
