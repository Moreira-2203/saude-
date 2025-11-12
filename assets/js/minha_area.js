function carregarConsultas() {
  const lista = document.getElementById("lista-consultas");
  const msgSemConsultas = document.getElementById("sem-consultas");
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

  if (agendamentos.length === 0) {
    msgSemConsultas.style.display = "block";
    lista.innerHTML = "";
    return;
  }

  msgSemConsultas.style.display = "none";
  lista.innerHTML = "";

  agendamentos.forEach((ag, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="info">
        <p><strong>${ag.data} - ${ag.horario}</strong></p>
        <p>${ag.clinica}</p>
        <p>${ag.especialidade}</p>
      </div>
      <div class="actions">
        <button class="edit" data-index="${index}">Remarcar</button>
        <button class="delete" data-index="${index}">Cancelar</button>
      </div>
    `;

    lista.appendChild(card);
  });

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", function () {
      const i = this.getAttribute("data-index");
      if (confirm("Tem certeza que deseja cancelar esta consulta?")) {
        agendamentos.splice(i, 1);
        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
        carregarConsultas();
      }
    });
  });

  document.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", function () {
      const i = this.getAttribute("data-index");
      const novaData = prompt("Informe a nova data (dd/mm/aaaa):", agendamentos[i].data);
      const novoHorario = prompt("Informe o novo horário (ex: 14:00):", agendamentos[i].horario);

      if (novaData && novoHorario) {
        agendamentos[i].data = novaData;
        agendamentos[i].horario = novoHorario;
        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
        alert("Consulta remarcada com sucesso!");
        carregarConsultas();
      }
    });
  });
}

function carregarExames() {
  const examesSection = document.querySelector(".box.exames");
  const msgSemExames = examesSection.querySelector(".none");
  const exames = JSON.parse(localStorage.getItem("exames")) || [];

  const container = examesSection.querySelector("#lista-exames") || document.createElement("div");
  container.id = "lista-exames";
  container.innerHTML = "";

  if (exames.length === 0) {
    msgSemExames.style.display = "block";
    examesSection.appendChild(container);
    return;
  }

  msgSemExames.style.display = "none";

  exames.forEach((ex, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="info">
        <p><strong>${ex.nome}</strong></p>
        <p>${ex.laboratorio}</p>
      </div>
      <div class="icons-exams">
        <i class="fa-regular fa-trash-can" data-index="${index}" title="Excluir"></i>
        <i class="fa-solid fa-download fa-download" data-index="${index}" title="Baixar"></i>
      </div>
    `;

    container.appendChild(card);
  });

  examesSection.appendChild(container);

  container.querySelectorAll(".fa-trash-can").forEach(icon => {
    icon.addEventListener("click", function () {
      const i = this.getAttribute("data-index");
      if (confirm("Deseja excluir este exame?")) {
        exames.splice(i, 1);
        localStorage.setItem("exames", JSON.stringify(exames));
        carregarExames();
      }
    });
  });

  container.querySelectorAll(".fa-download, .fa-download").forEach(icon => {
    icon.addEventListener("click", function () {
      const i = this.getAttribute("data-index");
      const exame = exames[i];
      const link = document.createElement("a");
      link.href = `../../assets/exames/${exame.arquivo}`;
      link.download = exame.arquivo;
      link.click();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarConsultas();
  carregarExames();
});

window.addEventListener("storage", (event) => {
  if (event.key === "agendamentos") {
    carregarConsultas();
  }
  if (event.key === "exames") {
    carregarExames();
  }
});
