const MOCK_USERS = [
  {id:'#0902231', nome:'Marllon Rocha', email:'marllon@gmail.com', tipo:'Clientes'},
  {id:'#0091231', nome:'Isabela Moreira', email:'isabela@gmail.com', tipo:'Clientes'},
  {id:'#0912412', nome:'Breno Oliveira', email:'breno@gmail.com', tipo:'Médicos'},
  {id:'#5454534', nome:'Vitor Junior', email:'vitor@gmail.com', tipo:'Recepcionistas'},
  {id:'#4141555', nome:'Felipe Santos', email:'felipe@gmail.com', tipo:'Administradores'},
  {id:'#2157777', nome:'Gustavo Oliveira', email:'gustavo@gmail.com', tipo:'Clientes'},
  {id:'#4141513', nome:'Beatriz Moura', email:'beatriz@gmail.com', tipo:'Clientes'},
  {id:'#4686589', nome:'Leila Marins', email:'leila@gmail.com', tipo:'Médicos'},
  {id:'#1424677', nome:'Mauro Fagundes', email:'mauro@gmail.com', tipo:'Médicos'},
  {id:'#11267577', nome:'Hugo Mendes', email:'hugo@gmail.com', tipo:'Recepcionistas'}
];

const DEFAULT_CLINICS = [
  {id:'#0312943', nome:'Clínica dos Olhos', cnpj:'12.345.678/0001-01'},
  {id:'#5243665', nome:'Clínica da Mulher', cnpj:'12.345.678/0001-02'},
  {id:'#0913132', nome:'HumanizaLab', cnpj:'12.345.678/0001-03'},
  {id:'#5441245', nome:'Centro Municipal de Diagnóstico por Imagem', cnpj:'12.345.678/0001-04'},
  {id:'#4332211', nome:'Clínica Odontológica Dr. Drude', cnpj:'12.345.678/0001-05'}
];

function saveClinics(arr) {
  localStorage.setItem('clinics_v1', JSON.stringify(arr));
}

function loadClinics() {
  const raw = localStorage.getItem('clinics_v1');
  return raw ? JSON.parse(raw) : [...DEFAULT_CLINICS];
}

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    const tab = link.dataset.tab;
    ['users', 'clinics', 'report'].forEach(id => {
      document.getElementById(id).style.display = (id === tab) ? 'block' : 'none';
    });
    if (tab === 'users') renderUsersTable();
    if (tab === 'clinics') renderClinicsTable();
    if (tab === 'report') renderReport();
  });
});

const userType = document.getElementById('userType');
const searchInput = document.getElementById('searchInput');
const usersTableWrap = document.getElementById('usersTableWrap');

function renderUsersTable() {
  const type = userType.value;
  const q = searchInput.value.trim().toLowerCase();
  const filtered = MOCK_USERS.filter(u =>
    u.tipo === type &&
    (u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q))
  );
  if (filtered.length === 0) {
    usersTableWrap.innerHTML = '<div class="empty">Nenhum usuário encontrado.</div>';
    return;
  }
  let html = '<table><thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Ações</th></tr></thead><tbody>';
  filtered.forEach(u => {
    html += `<tr><td>${u.id}</td><td>${u.nome}</td><td>${u.email}</td><td><button class="btn ghost" onclick="viewUser('${u.id}')">Ver</button></td></tr>`;
  });
  html += '</tbody></table>';
  usersTableWrap.innerHTML = html;
}

function viewUser(id) {
  const u = MOCK_USERS.find(x => x.id === id);
  if (!u) return alert('Usuário não encontrado');
  alert(`ID: ${u.id}\nNome: ${u.nome}\nEmail: ${u.email}\nTipo: ${u.tipo}`);
}

userType.addEventListener('change', renderUsersTable);
searchInput.addEventListener('input', renderUsersTable);
document.getElementById('refreshUsers').addEventListener('click', () => {
  searchInput.value = '';
  userType.value = 'Clientes';
  renderUsersTable();
});

let CLINICS = loadClinics();
const clinicsTableWrap = document.getElementById('clinicsTableWrap');

function renderClinicsTable() {
  CLINICS = loadClinics();
  if (CLINICS.length === 0) {
    clinicsTableWrap.innerHTML = '<div class="empty">Nenhuma clínica cadastrada.</div>';
    return;
  }
  let html = '<table><thead><tr><th>ID</th><th>Nome</th><th>CNPJ</th><th>Ações</th></tr></thead><tbody>';
  CLINICS.forEach((c, idx) => {
    html += `<tr><td>${c.id}</td><td>${c.nome}</td><td>${c.cnpj}</td>
      <td><button class="btn ghost" onclick="editClinic(${idx})">Editar</button>
      <button class="btn danger" onclick="removeClinic(${idx})">Remover</button></td></tr>`;
  });
  html += '</tbody></table>';
  clinicsTableWrap.innerHTML = html;
}

window.removeClinic = function(idx) {
  if (!confirm('Remover esta clínica?')) return;
  CLINICS.splice(idx, 1);
  saveClinics(CLINICS);
  renderClinicsTable();
};

window.editClinic = function(idx) {
  const c = CLINICS[idx];
  const newName = prompt('Novo nome da clínica', c.nome);
  if (newName == null) return;
  const newCnpj = prompt('Novo CNPJ', c.cnpj);
  if (newCnpj == null) return;
  CLINICS[idx] = {...c, nome: newName, cnpj: newCnpj};
  saveClinics(CLINICS);
  renderClinicsTable();
};

document.getElementById('addClinicBtn').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'block';
});

document.getElementById('cancelModal').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

document.getElementById('saveClinic').addEventListener('click', () => {
  const nome = document.getElementById('clinicName').value.trim();
  const cnpj = document.getElementById('clinicCNPJ').value.trim();
  if (!nome || !cnpj) {
    alert('Preencha todos os campos');
    return;
  }
  const newId = '#' + Math.floor(Math.random() * 9000000 + 1000000);
  CLINICS.push({id: newId, nome, cnpj});
  saveClinics(CLINICS);
  document.getElementById('clinicName').value = '';
  document.getElementById('clinicCNPJ').value = '';
  document.getElementById('modal').style.display = 'none';
  renderClinicsTable();
});

document.getElementById('clearClinics').addEventListener('click', () => {
  if (!confirm('Remover todas as clínicas e restaurar padrão?')) return;
  localStorage.removeItem('clinics_v1');
  CLINICS = loadClinics();
  renderClinicsTable();
});

function renderReport() {
  const clinics = loadClinics();
  if (clinics.length === 0) {
    document.getElementById('reportTableWrap').innerHTML = '<div class="empty">Nenhuma clínica para relatório.</div>';
    return;
  }
  let html = '<table><thead><tr><th>ID</th><th>Nome</th><th>CNPJ</th></tr></thead><tbody>';
  clinics.forEach(c => {
    html += `<tr><td>${c.id}</td><td>${c.nome}</td><td>${c.cnpj}</td></tr>`;
  });
  html += '</tbody></table>';
  document.getElementById('reportTableWrap').innerHTML = html;
}

document.getElementById('downloadCsv').addEventListener('click', () => {
  const clinics = loadClinics();
  if (clinics.length === 0) {
    alert('Nada para exportar');
    return;
  }
  const rows = [['ID', 'Nome', 'CNPJ'], ...clinics.map(c => [c.id, c.nome, c.cnpj])];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio_clinicas.csv';
  a.click();
  URL.revokeObjectURL(url);
});

renderUsersTable();
renderClinicsTable();
