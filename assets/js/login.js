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

async function gerarHash(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function carregarUsuarios() {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  try {
    const resposta = await fetch("../../usuarios.json");
    if (resposta.ok) {
      const usuariosArquivo = await resposta.json();
      usuariosArquivo.forEach(u => {
        if (!usuarios.some(us => us.email === u.email)) {
          usuarios.push(u);
        }
      });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
  } catch (erro) {
    console.warn("Nenhum arquivo usuarios.json encontrado ou erro ao carregar:", erro);
  }

  return usuarios;
}

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-btn');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');

  if (!loginButton || !emailInput || !senhaInput) return;

  loginButton.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
      alert("Por favor, preencha e-mail e senha!");
      return;
    }

    const usuarios = await carregarUsuarios();
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
      alert("Usuário não encontrado!");
      return;
    }

    const hashSenha = await gerarHash(senha);

    if (hashSenha === usuario.senha) {
      alert(`Bem-vindo(a), ${usuario.nome}!`);
      window.location.href = "../../pages/dashboard/minha_area.html";
    } else {
      alert("Senha incorreta!");
    }
  });
});
