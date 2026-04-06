function mapClinic(apiClinic) {
  return {
    id: apiClinic.id,
    nome: apiClinic.name,
    endereco: apiClinic.address,
    horario: apiClinic.hours,
    descricao: apiClinic.description,
    imagem: apiClinic.image_url,
    whatsapp: apiClinic.contact_whatsapp,
    telefone: apiClinic.contact_phone,
    email: apiClinic.contact_email,
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
      console.warn("Nenhuma clínica encontrada. Parâmetro ausente.");
      return;
    }

    let clinica = null;
    try {
      clinica = await getClinicById(clinicaId);
    } catch (err) {
      console.warn("Falha ao carregar clínica:", err);
      return;
    }

    if (!clinica) {
      console.warn("Nenhuma clínica encontrada. Parâmetro ausente:", clinicaId);
      return;
    }

    localStorage.setItem("selectedClinica", clinica.id);
    document.getElementById("ct-nome").textContent = clinica.nome;
    document.getElementById("ct-img").src = clinica.imagem;
    document.getElementById("ct-endereco").innerHTML = `<strong>${clinica.endereco}</strong>`;
    document.getElementById("ct-horario").textContent = clinica.horario;
    document.getElementById("ct-descricao").textContent = clinica.descricao;

    document.getElementById("btnLigar").onclick = () => {
      window.location.href = `tel:${clinica.telefone}`;
    };

    document.getElementById("btnWhatsapp").onclick = () => {
      window.open(`https://wa.me/${clinica.whatsapp}`, "_blank");
    };

    document.getElementById("btnEmail").onclick = () => {
      window.location.href = `mailto:${clinica.email}`;
    };

    console.log("[contato.js] Card carregado para:", clinica.nome);
  })();
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContato");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso! A clínica retornará em breve.");
    form.reset();
  });
});
