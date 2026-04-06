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

async function createAppointment(payload) {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Falha ao agendar consulta.';
    try {
      const data = await response.json();
      if (data && data.detail) message = data.detail;
    } catch (err) {
      message = 'Falha ao agendar consulta.';
    }
    throw new Error(message);
  }

  return response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  const especialidadeSelect = document.getElementById("especialidade");
  const medicoSelect = document.getElementById("medico");
  const dataSelect = document.getElementById("data");
  const horarioSelect = document.getElementById("horario");
  const form = document.getElementById("formAgendamento");
  const contatoBtn = document.getElementById("btnContato");
  const mapaBtn = document.getElementById("btnMapa");

  const params = new URLSearchParams(window.location.search);
  const clinicaId = params.get("clinica") || localStorage.getItem("selectedClinica");
  let clinicaSelecionada = null;
  if (clinicaId) {
    try {
      clinicaSelecionada = await getClinicById(clinicaId);
    } catch (err) {
      console.warn("[Agendamento] Falha ao carregar clínica:", err);
    }
  }

  if (clinicaSelecionada) {
    localStorage.setItem("selectedClinica", clinicaSelecionada.id);

    document.getElementById("ag-img").src = clinicaSelecionada.imagem;
    document.getElementById("ag-nome").textContent = clinicaSelecionada.nome;
    document.getElementById("ag-endereco").textContent = clinicaSelecionada.endereco;
    document.getElementById("ag-horario").textContent = clinicaSelecionada.horario;
    document.getElementById("ag-descricao").textContent = clinicaSelecionada.descricao;

    contatoBtn.addEventListener("click", () => {
      window.location.href = `../../pages/dashboard/contato.html?clinica=${clinicaSelecionada.id}`;
    });

    mapaBtn.addEventListener("click", () => {
      window.location.href = `../../pages/dashboard/localizacao.html?clinica=${clinicaSelecionada.id}`;
    });
  } else {
    console.warn("[Agendamento] Nenhuma clínica correspondente encontrada.");
  }

  const dados = {
    ginecologia: {
      medicos: ["Dra. Ana Paula", "Dr. Carlos Silva"],
      datas: ["12/11/2025", "15/11/2025"],
      horarios: ["08:00", "09:30", "11:00"]
    },
    obstetricia: {
      medicos: ["Dra. Helena Moraes", "Dr. Ricardo Lima"],
      datas: ["13/11/2025", "16/11/2025"],
      horarios: ["10:00", "13:30", "15:00"]
    },
    mastologia: {
      medicos: ["Dr. João Mendes", "Dra. Laura Campos"],
      datas: ["14/11/2025", "17/11/2025"],
      horarios: ["08:30", "10:00", "14:00"]
    }
  };

  especialidadeSelect.addEventListener("change", () => {
    const esp = especialidadeSelect.value;
    medicoSelect.innerHTML = `<option value="">Selecione...</option>`;
    dataSelect.innerHTML = `<option value="">Selecione um médico</option>`;
    horarioSelect.innerHTML = `<option value="">Selecione uma data</option>`;

    if (esp && dados[esp]) {
      dados[esp].medicos.forEach(medico => {
        const opt = document.createElement("option");
        opt.value = medico;
        opt.textContent = medico;
        medicoSelect.appendChild(opt);
      });
    }
  });

  medicoSelect.addEventListener("change", () => {
    const esp = especialidadeSelect.value;
    dataSelect.innerHTML = `<option value="">Selecione...</option>`;
    horarioSelect.innerHTML = `<option value="">Selecione uma data</option>`;

    if (esp && dados[esp]) {
      dados[esp].datas.forEach(data => {
        const opt = document.createElement("option");
        opt.value = data;
        opt.textContent = data;
        dataSelect.appendChild(opt);
      });
    }
  });

  dataSelect.addEventListener("change", () => {
    const esp = especialidadeSelect.value;
    horarioSelect.innerHTML = `<option value="">Selecione...</option>`;

    if (esp && dados[esp]) {
      dados[esp].horarios.forEach(horario => {
        const opt = document.createElement("option");
        opt.value = horario;
        opt.textContent = horario;
        horarioSelect.appendChild(opt);
      });
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const esp = especialidadeSelect.value;
    const med = medicoSelect.value;
    const dat = dataSelect.value;
    const hor = horarioSelect.value;

    if (!esp || !med || !dat || !hor) {
      alert("⚠️ Por favor, preencha todos os campos antes de agendar!");
      return;
    }

    if (!clinicaSelecionada) {
      alert("⚠️ Clínica não identificada.");
      return;
    }

    try {
      await createAppointment({
        clinic_id: clinicaSelecionada.id,
        doctor_name: med,
        specialty: esp,
        date: dat,
        time: hor,
        status: 'agendado',
      });
      alert("✅ Consulta agendada com sucesso!");
      form.reset();
      setTimeout(() => {
        window.location.href = "../../pages/dashboard/minha_area.html";
      }, 500);
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Falha ao agendar consulta.';
      if (text.toLowerCase().includes('not authenticated')) {
        window.location.href = "../../pages/login/login.html";
        return;
      }
      alert(text);
    }
  });
});
