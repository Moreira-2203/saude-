const eye = document.querySelector('.password-wrapper i');
const senhaInput = document.querySelector('#senha');

if (eye && senhaInput) {
  eye.addEventListener('click', () => {
    const isPassword = senhaInput.type === 'password';
    senhaInput.type = isPassword ? 'text' : 'password';
    eye.classList.toggle('fa-eye');
    eye.classList.toggle('fa-eye-slash');
  });
}

async function apiLogin(email, senha, rememberMe) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      email,
      password: senha,
      remember_me: rememberMe,
    }),
  });

  if (!response.ok) {
    let message = 'Falha no login.';
    try {
      const data = await response.json();
      if (data && data.detail) message = data.detail;
    } catch (err) {
      message = 'Falha no login.';
    }
    throw new Error(message);
  }

  return response.json();
}

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-btn');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const rememberInput = document.getElementById('remember-me');
  const msg = document.getElementById('login-msg');

  if (!loginButton || !emailInput || !senhaInput) return;

  loginButton.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    const rememberMe = rememberInput ? rememberInput.checked : false;

    if (msg) msg.textContent = '';

    if (!email || !senha) {
      const text = 'Por favor, preencha e-mail e senha!';
      if (msg) msg.textContent = text;
      else alert(text);
      return;
    }

    try {
      await apiLogin(email, senha, rememberMe);
      window.location.href = "../../pages/dashboard/minha_area.html";
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Falha no login.';
      if (msg) msg.textContent = text;
      else alert(text);
    }
  });
});
