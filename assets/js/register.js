
document.querySelectorAll('.password-wrapper i').forEach(icon => {
  icon.addEventListener('click', () => {
    const input = icon.previousElementSibling;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
});

async function apiRegister(payload) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Falha ao cadastrar.';
    try {
      const data = await response.json();
      if (data && data.detail) message = data.detail;
    } catch (err) {
      message = 'Falha ao cadastrar.';
    }
    throw new Error(message);
  }

  return response.json();
}

document.getElementById("cadastro-btn").addEventListener("click", async () => {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmar-senha").value;
  const termos = document.getElementById("termos").checked;

  if (!nome || !email || !senha || !confirmarSenha) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  if (!termos) {
    alert("Você precisa aceitar os termos de uso e privacidade.");
    return;
  }

  try {
    await apiRegister({
      name: nome,
      email,
      password: senha,
      role: 'paciente',
    });
    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
  } catch (err) {
    const text = err instanceof Error ? err.message : 'Falha ao cadastrar.';
    alert(text);
  }
});
