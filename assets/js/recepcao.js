async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: { ...(options.headers || {}) },
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

async function loadPatients() {
  return apiRequest('/api/users?role=paciente');
}

async function loadExams(patientId) {
  const query = patientId ? `?patient_id=${encodeURIComponent(patientId)}` : '';
  return apiRequest(`/api/exams${query}`);
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

const examPatient = document.getElementById('examPatient');
const examName = document.getElementById('examName');
const examLab = document.getElementById('examLab');
const examFile = document.getElementById('examFile');
const uploadExamBtn = document.getElementById('uploadExam');
const examListWrap = document.getElementById('examListWrap');

let patients = [];
let exams = [];

function renderPatientsOptions() {
  examPatient.innerHTML = '';
  if (patients.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Nenhum paciente encontrado';
    examPatient.appendChild(option);
    return;
  }
  patients.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.name} (${p.email})`;
    examPatient.appendChild(option);
  });
}

function renderExamList() {
  if (!examListWrap) return;
  if (!exams || exams.length === 0) {
    examListWrap.innerHTML = '<div class="empty">Nenhum exame para o paciente.</div>';
    return;
  }

  let html = '<table><thead><tr><th>Nome</th><th>Laboratorio</th><th>Arquivo</th><th>Acoes</th></tr></thead><tbody>';
  exams.forEach(e => {
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
        const patientId = examPatient.value;
        if (patientId) {
          exams = await loadExams(patientId);
          renderExamList();
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Falha ao excluir exame.');
      }
    });
  });
}

async function init() {
  try {
    patients = await loadPatients();
    renderPatientsOptions();
    const patientId = examPatient.value;
    if (patientId) {
      exams = await loadExams(patientId);
    }
    renderExamList();
  } catch (err) {
    examListWrap.innerHTML = '<div class="empty">Nao foi possivel carregar exames.</div>';
  }
}

examPatient.addEventListener('change', async () => {
  const patientId = examPatient.value;
  if (!patientId) return;
  try {
    exams = await loadExams(patientId);
    renderExamList();
  } catch (err) {
    examListWrap.innerHTML = '<div class="empty">Nao foi possivel carregar exames.</div>';
  }
});

uploadExamBtn.addEventListener('click', async () => {
  const patientId = examPatient.value;
  const name = examName.value.trim();
  const lab = examLab.value.trim();
  const file = examFile.files ? examFile.files[0] : null;

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
    examName.value = '';
    examLab.value = '';
    examFile.value = '';
    exams = await loadExams(patientId);
    renderExamList();
    alert('Exame enviado com sucesso.');
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Falha ao enviar exame.');
  }
});

init();
