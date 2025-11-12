const clinicas = [
  {
    id: "clinicamulher",
    nome: "Clínica da Mulher",
    endereco: "Tv. Arildo Ferreira Da Silva, 5 - Barreira",
    horario: "07h da manhã às 17h da tarde",
    descricao: "Clínica Municipal especializada em Atenção Integral à Saúde da Mulher, oferecendo serviços de ginecologia, obstetrícia, prevenção e acompanhamento médico.",
    imagem: "../../assets/img/clinicadamulher.jpg",
    whatsapp: "5522999999999",
    telefone: "5522999999999",
    email: "contato@clinicadamulher.com"
  },
  {
    id: "capsad",
    nome: "Centro de Atenção Psicossocial de Saquarema – CAPS AD",
    endereco: "Rua Adolfo Bravo, n° 28 - Bacaxá",
    horario: "08h da manhã às 17h da tarde",
    descricao: "Unidade especializada em saúde mental, oferecendo atendimento psicossocial, apoio terapêutico e acompanhamento contínuo aos moradores de Saquarema.",
    imagem: "../../assets/img/caps.png",
    whatsapp: "5522999999999",
    telefone: "5522999999999",
    email: "contato@capsad.com"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  let clinicaId = params.get("clinica") || localStorage.getItem("selectedClinica");

  const clinica = clinicas.find(c => c.id === clinicaId);
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
