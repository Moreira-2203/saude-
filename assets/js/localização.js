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

async function getClinicById(clinicaId) {
  const response = await fetch('/api/clinics', { credentials: 'include' });
  if (!response.ok) {
    throw new Error('Falha ao carregar clínicas.');
  }
  const data = await response.json();
  const clinics = Array.isArray(data) ? data.map(mapClinic) : [];
  return clinics.find(c => c.id === clinicaId) || null;
}

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    const params = new URLSearchParams(window.location.search);
    const clinicaId = params.get("clinica") || localStorage.getItem("selectedClinica");

    if (!clinicaId) {
      document.getElementById("map-box").innerHTML = "<p>Clínica não encontrada.</p>";
      return;
    }

    let clinica = null;
    try {
      clinica = await getClinicById(clinicaId);
    } catch (err) {
      document.getElementById("map-box").innerHTML = "<p>Não foi possível carregar a clínica.</p>";
      return;
    }

    if (!clinica) {
      document.getElementById("map-box").innerHTML = "<p>Clínica não encontrada.</p>";
      return;
    }

    localStorage.setItem("selectedClinica", clinica.id);

    document.getElementById("loc-img").src = clinica.imagem;
    document.getElementById("loc-nome").textContent = clinica.nome;
    document.getElementById("loc-endereco").textContent = clinica.endereco;
    document.getElementById("loc-horario").textContent = clinica.horario;
    document.getElementById("loc-descricao").textContent = clinica.descricao;

    document.getElementById("btnContato").onclick = () => {
      window.location.href = `../../pages/dashboard/contato.html?clinica=${clinica.id}`;
    };

    document.getElementById("btnAgendar").onclick = () => {
      window.location.href = `../../pages/dashboard/agendamento.html?clinica=${clinica.id}`;
    };

    mostrarRotaCompleta(clinica);
  })();
});

function mostrarRotaCompleta(clinica) {
  const mapaBox = document.getElementById("map-box");

  if (!navigator.geolocation) {
    mapaBox.innerHTML = "<p>Seu navegador não suporta geolocalização.</p>";
    return;
  }

  mapaBox.innerHTML = "<p>Obtendo sua localização...</p>";

  navigator.geolocation.getCurrentPosition(
    pos => {
      const latUser = pos.coords.latitude;
      const lonUser = pos.coords.longitude;

      const destino = encodeURIComponent(clinica.endereco);

      const rotaUrl = `https://www.google.com/maps/dir/?api=1&origin=${latUser},${lonUser}&destination=${destino}&travelmode=driving`;

      mapaBox.innerHTML = `
        <iframe 
          src="https://maps.google.com/maps?q=${destino}&t=&z=14&ie=UTF8&iwloc=&output=embed"
          loading="lazy"
          style="width:100%;height:450px;border:0;border-radius:12px;">
        </iframe>
        <p style="margin-top:10px;">
          <a href="${rotaUrl}" target="_blank" class="abrir-mapa" 
            style="color:#26ac98;font-weight:bold;text-decoration:none;">
            ➜ Traçar rota no Google Maps
          </a>
        </p>
      `;

      console.log("[localizacao] Rota pronta:", rotaUrl);
    },
    err => {
      console.error("[localizacao] Erro ao obter localização:", err);
      mapaBox.innerHTML = "<p>Não foi possível acessar sua localização. Ative a permissão e recarregue a página.</p>";
    }
  );
}
