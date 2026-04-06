
let clinicsCache = null;

function mapClinic(apiClinic) {
  return {
    id: apiClinic.id,
    nome: apiClinic.name,
    endereco: apiClinic.address,
    horario: apiClinic.hours,
    descricao: apiClinic.description,
    imagem: apiClinic.image_url,
  };
}

async function loadClinics() {
  const response = await fetch('/api/clinics', { credentials: 'include' });
  if (!response.ok) {
    throw new Error('Falha ao carregar clínicas.');
  }
  const data = await response.json();
  return Array.isArray(data) ? data.map(mapClinic) : [];
}

async function getClinics() {
  if (clinicsCache) return clinicsCache;
  clinicsCache = await loadClinics();
  return clinicsCache;
}

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


async function buscarClinica() {
  const termo = document.getElementById("search-input").value.toLowerCase().trim();
  const cardsContainer = document.getElementById("cards");

  cardsContainer.innerHTML = "";

  if (!termo) return;
  let clinicas = [];
  try {
    clinicas = await getClinics();
  } catch (err) {
    cardsContainer.innerHTML = `
      <p style="text-align:center; padding:20px; font-size:18px;">
        Não foi possível carregar as clínicas.
      </p>`;
    return;
  }

  const resultados = clinicas.filter(c => c.nome.toLowerCase().includes(termo));

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

document.getElementById("search-btn").addEventListener("click", () => {
  buscarClinica();
});
document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") buscarClinica();
});


document.addEventListener("click", (e) => {
  const btnAgendar = e.target.closest(".btn-agendar");
  const btnContato = e.target.closest(".btn-contato");
  const btnMapa = e.target.closest(".btn-mapa");

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

  if (btnMapa) {
    const id = btnMapa.getAttribute("data-id");
    localStorage.setItem("selectedClinica", id);
    const url = `../../pages/dashboard/localizacao.html?clinica=${encodeURIComponent(id)}`;
    window.location.href = url;
  }
});
