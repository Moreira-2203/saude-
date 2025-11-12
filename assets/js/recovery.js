    const btn = document.getElementById('recuperar-btn');
    btn.addEventListener('click', () => {
      const email = document.getElementById('email').value;
      if (!email) {
        alert('Por favor, insira seu e-mail.');
        return;
      }

      alert(`Um link de redefinição foi enviado para: ${email}`);
      window.location.href = 'login.html';
    });