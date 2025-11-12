const clinicas = [
  {
    id: "clinicamulher",
    nome: "Clínica da Mulher",
    endereco: "Tv. Arildo Ferreira Da Silva, 5 - Barreira",
    horario: "07h da manhã às 17h da tarde",
    descricao: "Clínica Municipal especializada em Atenção Integral à Saúde da Mulher do município de Saquarema.",
    imagem: "../../assets/img/clinicadamulher.jpg",
    whatsapp: "5522999611638",
    telefone: "5522999611638",
    email: "contato@clinicadamulher.com"
  },
  {
    id: "capsad",
    nome: "Centro de Atenção Psicossocial de Saquarema – CAPS AD",
    endereco: "Rua Adolfo Bravo, n° 28 - Bacaxá",
    horario: "08h da manhã às 17h da tarde",
    descricao: "Clínica de Saúde especializada em atendimento psicossocial.",
    imagem: "../../assets/img/caps.png",
    whatsapp: "5522999999999",
    telefone: "5522999999999",
    email: "contato@capsad.com"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const especialidadeSelect = document.getElementById("especialidade");
  const medicoSelect = document.getElementById("medico");
  const dataSelect = document.getElementById("data");
  const horarioSelect = document.getElementById("horario");
  const form = document.getElementById("formAgendamento");
  const contatoBtn = document.getElementById("btnContato");
  const mapaBtn = document.getElementById("btnMapa");

  const params = new URLSearchParams(window.location.search);
  const clinicaId = params.get("clinica") || localStorage.getItem("selectedClinica");
  const clinicaSelecionada = clinicas.find(c => c.id === clinicaId);

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

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const esp = especialidadeSelect.value;
    const med = medicoSelect.value;
    const dat = dataSelect.value;
    const hor = horarioSelect.value;

    if (!esp || !med || !dat || !hor) {
      alert("⚠️ Por favor, preencha todos os campos antes de agendar!");
      return;
    }

    const novoAgendamento = {
      clinica: clinicaSelecionada ? clinicaSelecionada.nome : "Clínica não identificada",
      especialidade: esp,
      medico: med,
      data: dat,
      horario: hor,
      criadoEm: new Date().toLocaleString()
    };

    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    agendamentos.push(novoAgendamento);
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

    alert("✅ Consulta agendada com sucesso!");
    form.reset();

    setTimeout(() => {
      window.location.href = "../../pages/dashboard/minha_area.html";
    }, 1000);
  });
});
