async function apiListAppointments() {
  const response = await fetch('/api/appointments', { credentials: 'include' });
  if (response.status === 401) {
    throw new Error('Not authenticated');
  }
  if (!response.ok) {
    throw new Error('Falha ao carregar consultas.');
  }
  return response.json();
}

async function apiListClinics() {
  const response = await fetch('/api/clinics', { credentials: 'include' });
  if (!response.ok) {
    throw new Error('Falha ao carregar clínicas.');
  }
  return response.json();
}

async function apiUpdateAppointment(appointmentId, payload) {
  const response = await fetch(`/api/appointments/${appointmentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    throw new Error('Not authenticated');
  }
  if (!response.ok) {
    let message = 'Falha ao atualizar consulta.';
    try {
      const data = await response.json();
      if (data && data.detail) message = data.detail;
    } catch (err) {
      message = 'Falha ao atualizar consulta.';
    }
    throw new Error(message);
  }

  return response.json();
}

async function apiListExams() {
  const response = await fetch('/api/exams', { credentials: 'include' });
  if (response.status === 401) {
    throw new Error('Not authenticated');
  }
  if (!response.ok) {
    throw new Error('Falha ao carregar exames.');
  }
  return response.json();
}

async function apiDeleteExam(examId) {
  const response = await fetch(`/api/exams/${examId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (response.status === 401) {
    throw new Error('Not authenticated');
  }
  if (!response.ok) {
    let message = 'Falha ao excluir exame.';
    try {
      const data = await response.json();
      if (data && data.detail) message = data.detail;
    } catch (err) {
      message = 'Falha ao excluir exame.';
    }
    throw new Error(message);
  }
  return response.json();
}

function formatStatus(status) {
  const map = {
    agendado: 'Agendado',
    cancelado: 'Cancelado',
    remarcado: 'Remarcado',
  };
  return map[status] || status;
}

async function carregarConsultas() {
  const lista = document.getElementById("lista-consultas");
  const msgSemConsultas = document.getElementById("sem-consultas");

  lista.innerHTML = "";
  msgSemConsultas.style.display = "none";

  let agendamentos = [];
  let clinics = [];

  try {
    const [appointmentsData, clinicsData] = await Promise.all([
      apiListAppointments(),
      apiListClinics(),
    ]);
    agendamentos = Array.isArray(appointmentsData) ? appointmentsData : [];
    clinics = Array.isArray(clinicsData) ? clinicsData : [];
  } catch (err) {
    if (err instanceof Error && err.message === 'Not authenticated') {
      window.location.href = "../../pages/login/login.html";
      return;
    }
    msgSemConsultas.textContent = "Não foi possível carregar as consultas.";
    msgSemConsultas.style.display = "block";
    return;
  }

  if (agendamentos.length === 0) {
    msgSemConsultas.style.display = "block";
    return;
  }

  const clinicMap = new Map(clinics.map(c => [c.id, c.name]));

  agendamentos.forEach(ag => {
    const card = document.createElement("div");
    card.classList.add("card");

    const clinicName = clinicMap.get(ag.clinic_id) || ag.clinic_id;
    const statusLabel = formatStatus(ag.status);

    card.innerHTML = `
      <div class="info">
        <p><strong>${ag.date} - ${ag.time}</strong></p>
        <p>${clinicName}</p>
        <p>${ag.specialty}</p>
        <p>${statusLabel}</p>
      </div>
      <div class="actions">
        <button class="edit" data-id="${ag.id}" data-date="${ag.date}" data-time="${ag.time}">Remarcar</button>
        <button class="delete" data-id="${ag.id}">Cancelar</button>
      </div>
    `;

    lista.appendChild(card);
  });

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", async function () {
      const appointmentId = this.getAttribute("data-id");
      if (!confirm("Tem certeza que deseja cancelar esta consulta?")) return;

      try {
        await apiUpdateAppointment(appointmentId, { status: 'cancelado' });
        carregarConsultas();
      } catch (err) {
        if (err instanceof Error && err.message === 'Not authenticated') {
          window.location.href = "../../pages/login/login.html";
          return;
        }
        const text = err instanceof Error ? err.message : 'Falha ao cancelar consulta.';
        alert(text);
      }
    });
  });

  document.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", async function () {
      const appointmentId = this.getAttribute("data-id");
      const currentDate = this.getAttribute("data-date");
      const currentTime = this.getAttribute("data-time");
      const novaData = prompt("Informe a nova data (dd/mm/aaaa):", currentDate);
      const novoHorario = prompt("Informe o novo horário (ex: 14:00):", currentTime);

      if (!novaData || !novoHorario) return;

      try {
        await apiUpdateAppointment(appointmentId, {
          date: novaData,
          time: novoHorario,
          status: 'remarcado',
        });
        alert("Consulta remarcada com sucesso!");
        carregarConsultas();
      } catch (err) {
        if (err instanceof Error && err.message === 'Not authenticated') {
          window.location.href = "../../pages/login/login.html";
          return;
        }
        const text = err instanceof Error ? err.message : 'Falha ao remarcar consulta.';
        alert(text);
      }
    });
  });
}

async function carregarExames() {
  const examesSection = document.querySelector(".box.exames");
  const msgSemExames = examesSection.querySelector(".none");
  let exames = [];

  const container = examesSection.querySelector("#lista-exames") || document.createElement("div");
  container.id = "lista-exames";
  container.innerHTML = "";

  try {
    exames = await apiListExams();
  } catch (err) {
    if (err instanceof Error && err.message === 'Not authenticated') {
      window.location.href = "../../pages/login/login.html";
      return;
    }
    msgSemExames.textContent = "Não foi possível carregar os exames.";
    msgSemExames.style.display = "block";
    examesSection.appendChild(container);
    return;
  }

  if (!Array.isArray(exames) || exames.length === 0) {
    msgSemExames.style.display = "block";
    examesSection.appendChild(container);
    return;
  }

  msgSemExames.style.display = "none";

  exames.forEach((ex) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="info">
        <p><strong>${ex.name}</strong></p>
        <p>${ex.lab}</p>
      </div>
      <div class="icons-exams">
        <i class="fa-regular fa-trash-can" data-id="${ex.id}" title="Excluir"></i>
        <i class="fa-solid fa-download" data-url="${ex.file_url}" title="Baixar"></i>
      </div>
    `;

    container.appendChild(card);
  });

  examesSection.appendChild(container);

  container.querySelectorAll(".fa-trash-can").forEach(icon => {
    icon.addEventListener("click", async function () {
      const examId = this.getAttribute("data-id");
      if (!confirm("Deseja excluir este exame?")) return;
      try {
        await apiDeleteExam(examId);
        carregarExames();
      } catch (err) {
        if (err instanceof Error && err.message === 'Not authenticated') {
          window.location.href = "../../pages/login/login.html";
          return;
        }
        const text = err instanceof Error ? err.message : 'Falha ao excluir exame.';
        alert(text);
      }
    });
  });

  container.querySelectorAll(".fa-download").forEach(icon => {
    icon.addEventListener("click", function () {
      const url = this.getAttribute("data-url");
      if (!url) {
        alert("Arquivo indisponível.");
        return;
      }
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split('/').pop() || 'exame';
      link.click();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarConsultas();
  carregarExames();
});

window.addEventListener("storage", (event) => {
  if (event.key === "exames") {
    carregarExames();
  }
});
