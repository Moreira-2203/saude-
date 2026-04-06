const ROLE_MAP = {
  'Clientes': 'paciente',
  'Médicos': 'medico',
  'Recepcionistas': 'recepcionista',
  'Administradores': 'admin',
};

const ROLE_LABELS = {
  paciente: 'Clientes',
  medico: 'Médicos',
  recepcionista: 'Recepcionistas',
  admin: 'Administradores',
};

const state = {
  users: [],
  clinics: [],
  patients: [],
  exams: [],
  currentRole: null,
};

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (response.status === 401) {
    window.location.href = '../../pages/login/login.html';
    throw new Error('Not authenticated');
  }

  if (!response.ok) {
    let message = 'Erro na requisicao.';
    try {
      const data = await response.json();
      if (data && data.detail) message = data.detail;
    } catch (err) {
      message = 'Erro na requisicao.';
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function loadUsers(role) {
  const query = role ? `?role=${encodeURIComponent(role)}` : '';
  state.users = await apiRequest(`/api/users${query}`);
  state.currentRole = role;
}

async function loadClinics() {
  state.clinics = await apiRequest('/api/clinics');
}

async function createClinic(payload) {
  return apiRequest('/api/clinics', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function updateClinic(clinicId, payload) {
  return apiRequest(`/api/clinics/${clinicId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

async function deleteClinic(clinicId) {
  return apiRequest(`/api/clinics/${clinicId}`, { method: 'DELETE' });
}

async function deleteAllClinics() {
  return apiRequest('/api/clinics?all=true', { method: 'DELETE' });
}

async function loadPatients() {
  state.patients = await apiRequest('/api/users?role=paciente');
}

async function loadExams(patientId) {
  const query = patientId ? `?patient_id=${encodeURIComponent(patientId)}` : '';
  state.exams = await apiRequest(`/api/exams${query}`);
}

async function uploadExam(formData) {
  const response = await fetch('/api/exams', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (response.status === 401) {
    window.location.href = '../../pages/login/login.html';
    throw new Error('Not authenticated');
  }

  if (!response.ok) {
    let message = 'Erro ao enviar exame.';
    try {
      const data = await response.json();
      if (data && data.detail) message = data.detail;
    } catch (err) {
      message = 'Erro ao enviar exame.';
    }
    throw new Error(message);
  }

  return response.json();
}

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', async e => {
    e.preventDefault();
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    const tab = link.dataset.tab;
    ['users', 'clinics', 'exams', 'report'].forEach(id => {
      document.getElementById(id).style.display = (id === tab) ? 'block' : 'none';
    });
    if (tab === 'users') await renderUsersTable();
    if (tab === 'clinics') await renderClinicsTable();
    if (tab === 'exams') await renderExamsPanel();
    if (tab === 'report') await renderReport();
  });
});

const userType = document.getElementById('userType');
const searchInput = document.getElementById('searchInput');
const usersTableWrap = document.getElementById('usersTableWrap');

async function renderUsersTable(forceReload = false) {
  const selectedRole = ROLE_MAP[userType.value] || null;
  const q = searchInput.value.trim().toLowerCase();

  if (forceReload || selectedRole !== state.currentRole) {
    try {
      await loadUsers(selectedRole);
    } catch (err) {
      usersTableWrap.innerHTML = '<div class="empty">Não foi possível carregar usuários.</div>';
      return;
    }
  }

  const filtered = state.users.filter(u => {
    const name = u.name.toLowerCase();
    const email = u.email.toLowerCase();
    const id = u.id.toLowerCase();
    return name.includes(q) || email.includes(q) || id.includes(q);
  });

  if (filtered.length === 0) {
    usersTableWrap.innerHTML = '<div class="empty">Nenhum usuário encontrado.</div>';
    return;
  }

  let html = '<table><thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Ações</th></tr></thead><tbody>';
  filtered.forEach(u => {
    html += `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td><button class="btn ghost" onclick="viewUser('${u.id}')">Ver</button></td></tr>`;
  });
  html += '</tbody></table>';
  usersTableWrap.innerHTML = html;
}

function viewUser(id) {
  const u = state.users.find(x => x.id === id);
  if (!u) return alert('Usuário não encontrado');
  const roleLabel = ROLE_LABELS[u.role] || u.role;
  alert(`ID: ${u.id}\nNome: ${u.name}\nEmail: ${u.email}\nTipo: ${roleLabel}`);
}

userType.addEventListener('change', () => {
  renderUsersTable(true);
});
searchInput.addEventListener('input', () => {
  renderUsersTable(false);
});
document.getElementById('refreshUsers').addEventListener('click', () => {
  searchInput.value = '';
  userType.value = 'Clientes';
  renderUsersTable(true);
});

const clinicsTableWrap = document.getElementById('clinicsTableWrap');

async function renderClinicsTable(forceReload = false) {
  if (forceReload || state.clinics.length === 0) {
    try {
      await loadClinics();
    } catch (err) {
      clinicsTableWrap.innerHTML = '<div class="empty">Não foi possível carregar clínicas.</div>';
      return;
    }
  }

  if (state.clinics.length === 0) {
    clinicsTableWrap.innerHTML = '<div class="empty">Nenhuma clínica cadastrada.</div>';
    return;
  }

  let html = '<table><thead><tr><th>ID</th><th>Nome</th><th>CNPJ</th><th>Ações</th></tr></thead><tbody>';
  state.clinics.forEach(c => {
    html += `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.cnpj}</td>
      <td><button class="btn ghost" onclick="editClinic('${c.id}')">Editar</button>
      <button class="btn danger" onclick="removeClinic('${c.id}')">Remover</button></td></tr>`;
  });
  html += '</tbody></table>';
  clinicsTableWrap.innerHTML = html;
}

function openClinicModal(clinic) {
  const modal = document.getElementById('modal');
  document.getElementById('clinicModalTitle').textContent = clinic ? 'Editar Clínica' : 'Adicionar Clínica';
  document.getElementById('clinicId').value = clinic ? clinic.id : '';
  document.getElementById('clinicName').value = clinic ? clinic.name : '';
  document.getElementById('clinicAddress').value = clinic ? clinic.address : '';
  document.getElementById('clinicHours').value = clinic ? clinic.hours : '';
  document.getElementById('clinicDescription').value = clinic ? clinic.description : '';
  document.getElementById('clinicImage').value = clinic ? clinic.image_url : '';
  document.getElementById('clinicPhone').value = clinic ? clinic.contact_phone : '';
  document.getElementById('clinicWhatsapp').value = clinic ? clinic.contact_whatsapp : '';
  document.getElementById('clinicEmail').value = clinic ? clinic.contact_email : '';
  document.getElementById('clinicCNPJ').value = clinic ? clinic.cnpj : '';
  modal.style.display = 'block';
}

function closeClinicModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  document.getElementById('clinicId').value = '';
  document.getElementById('clinicName').value = '';
  document.getElementById('clinicAddress').value = '';
  document.getElementById('clinicHours').value = '';
  document.getElementById('clinicDescription').value = '';
  document.getElementById('clinicImage').value = '';
  document.getElementById('clinicPhone').value = '';
  document.getElementById('clinicWhatsapp').value = '';
  document.getElementById('clinicEmail').value = '';
  document.getElementById('clinicCNPJ').value = '';
}

window.removeClinic = async function(clinicId) {
  if (!confirm('Remover esta clínica?')) return;
  try {
    await deleteClinic(clinicId);
    await renderClinicsTable(true);
    await renderReport();
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Falha ao remover clínica.');
  }
};

window.editClinic = function(clinicId) {
  const clinic = state.clinics.find(c => c.id === clinicId);
  if (!clinic) {
    alert('Clínica não encontrada');
    return;
  }
  openClinicModal(clinic);
};

document.getElementById('addClinicBtn').addEventListener('click', () => {
  openClinicModal(null);
});

document.getElementById('cancelModal').addEventListener('click', () => {
  closeClinicModal();
});

document.getElementById('saveClinic').addEventListener('click', async () => {
  const clinicId = document.getElementById('clinicId').value.trim();
  const name = document.getElementById('clinicName').value.trim();
  const address = document.getElementById('clinicAddress').value.trim();
  const hours = document.getElementById('clinicHours').value.trim();
  const description = document.getElementById('clinicDescription').value.trim();
  const imageUrl = document.getElementById('clinicImage').value.trim();
  const contactPhone = document.getElementById('clinicPhone').value.trim();
  const contactWhatsapp = document.getElementById('clinicWhatsapp').value.trim();
  const contactEmail = document.getElementById('clinicEmail').value.trim();
  const cnpj = document.getElementById('clinicCNPJ').value.trim();

  if (!name || !address || !hours || !description || !imageUrl || !contactPhone || !contactWhatsapp || !contactEmail || !cnpj) {
    alert('Preencha todos os campos');
    return;
  }

  const payload = {
    name,
    address,
    hours,
    description,
    image_url: imageUrl,
    contact_phone: contactPhone,
    contact_whatsapp: contactWhatsapp,
    contact_email: contactEmail,
    cnpj,
  };

  try {
    if (clinicId) {
      await updateClinic(clinicId, payload);
    } else {
      await createClinic(payload);
    }
    closeClinicModal();
    await renderClinicsTable(true);
    await renderReport();
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Falha ao salvar clínica.');
  }
});

document.getElementById('clearClinics').addEventListener('click', async () => {
  if (!confirm('Remover todas as clínicas?')) return;
  try {
    await deleteAllClinics();
    await renderClinicsTable(true);
    await renderReport();
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Falha ao remover clínicas.');
  }
});

async function renderReport() {
  if (state.clinics.length === 0) {
    await renderClinicsTable(true);
  }
  if (state.clinics.length === 0) {
    document.getElementById('reportTableWrap').innerHTML = '<div class="empty">Nenhuma clínica para relatório.</div>';
    return;
  }
  let html = '<table><thead><tr><th>ID</th><th>Nome</th><th>CNPJ</th></tr></thead><tbody>';
  state.clinics.forEach(c => {
    html += `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.cnpj}</td></tr>`;
  });
  html += '</tbody></table>';
  document.getElementById('reportTableWrap').innerHTML = html;
}

document.getElementById('downloadCsv').addEventListener('click', async () => {
  if (state.clinics.length === 0) {
    await renderClinicsTable(true);
  }
  if (state.clinics.length === 0) {
    alert('Nada para exportar');
    return;
  }
  const rows = [['ID', 'Nome', 'CNPJ'], ...state.clinics.map(c => [c.id, c.name, c.cnpj])];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio_clinicas.csv';
  a.click();
  URL.revokeObjectURL(url);
});

const examPatient = document.getElementById('examPatient');
const examName = document.getElementById('examName');
const examLab = document.getElementById('examLab');
const examFile = document.getElementById('examFile');
const uploadExamBtn = document.getElementById('uploadExam');
const examListWrap = document.getElementById('examListWrap');

function renderPatientsOptions() {
  if (!examPatient) return;
  examPatient.innerHTML = '';
  if (state.patients.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Nenhum paciente encontrado';
    examPatient.appendChild(option);
    return;
  }
  state.patients.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.name} (${p.email})`;
    examPatient.appendChild(option);
  });
}

function renderExamList() {
  if (!examListWrap) return;
  if (!state.exams || state.exams.length === 0) {
    examListWrap.innerHTML = '<div class="empty">Nenhum exame para o paciente.</div>';
    return;
  }

  let html = '<table><thead><tr><th>Nome</th><th>Laboratório</th><th>Arquivo</th><th>Ações</th></tr></thead><tbody>';
  state.exams.forEach(e => {
    html += `<tr>
      <td>${e.name}</td>
      <td>${e.lab}</td>
      <td><a href="${e.file_url}" target="_blank">Abrir</a></td>
      <td><button class="btn danger" data-id="${e.id}">Excluir</button></td>
    </tr>`;
  });
  html += '</tbody></table>';
  examListWrap.innerHTML = html;

  examListWrap.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const examId = btn.getAttribute('data-id');
      if (!confirm('Excluir este exame?')) return;
      try {
        await apiRequest(`/api/exams/${examId}`, { method: 'DELETE' });
        const patientId = examPatient ? examPatient.value : null;
        if (patientId) {
          await loadExams(patientId);
          renderExamList();
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Falha ao excluir exame.');
      }
    });
  });
}

async function renderExamsPanel() {
  if (!examPatient || !examListWrap) return;
  try {
    await loadPatients();
    renderPatientsOptions();
    const patientId = examPatient.value;
    if (patientId) {
      await loadExams(patientId);
    } else {
      state.exams = [];
    }
    renderExamList();
  } catch (err) {
    examListWrap.innerHTML = '<div class="empty">Nao foi possivel carregar exames.</div>';
  }
}

if (examPatient) {
  examPatient.addEventListener('change', async () => {
    const patientId = examPatient.value;
    if (!patientId) return;
    try {
      await loadExams(patientId);
      renderExamList();
    } catch (err) {
      examListWrap.innerHTML = '<div class="empty">Nao foi possivel carregar exames.</div>';
    }
  });
}

if (uploadExamBtn) {
  uploadExamBtn.addEventListener('click', async () => {
    const patientId = examPatient ? examPatient.value : '';
    const name = examName ? examName.value.trim() : '';
    const lab = examLab ? examLab.value.trim() : '';
    const file = examFile && examFile.files ? examFile.files[0] : null;

    if (!patientId || !name || !lab || !file) {
      alert('Preencha todos os campos e selecione um arquivo.');
      return;
    }

    const formData = new FormData();
    formData.append('patient_id', patientId);
    formData.append('name', name);
    formData.append('lab', lab);
    formData.append('file', file);

    try {
      await uploadExam(formData);
      if (examName) examName.value = '';
      if (examLab) examLab.value = '';
      if (examFile) examFile.value = '';
      await loadExams(patientId);
      renderExamList();
      alert('Exame enviado com sucesso.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Falha ao enviar exame.');
    }
  });
}

renderUsersTable(true);
renderClinicsTable(true);
