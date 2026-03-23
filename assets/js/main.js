function getBasePath() {
  const path = window.location.pathname || '/';
  const segments = path.split('/').filter(Boolean);
  const depth = segments.length > 1 ? segments.length - 1 : 0;
  return '../'.repeat(depth);
}

function fixAbsoluteAssetPaths(html, base) {
  return html
    .replace(/(src|href)=["']\/assets\//g, `$1="${base}assets/`)
    .replace(/(src|href)=["']\/pages\//g, `$1="${base}pages/`);
}

async function loadMainLayout() {
  const base = '/';
  const htmlPath = `${base}components/main.html`;
  const cssPath = `${base}assets/css/main.css`;

  try {
    const response = await fetch(htmlPath, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status} ao buscar ${htmlPath}`);

    let content = await response.text();
    content = fixAbsoluteAssetPaths(content, base);

    const temp = document.createElement('div');
    temp.innerHTML = content;

    const header = temp.querySelector('header');
    const footer = temp.querySelector('footer');
    const placeholder = document.getElementById('header-placeholder');

    if (placeholder && header) {
      placeholder.replaceWith(header);
    } else if (header && !document.querySelector('header')) {
      document.body.prepend(header);
    }

    if (footer && !document.querySelector('footer')) {
      document.body.append(footer);
    }


    if (![...document.querySelectorAll('link[rel="stylesheet"]')]
        .some(link => link.href.includes('main.css'))) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      link.onload = () => console.log('[layout] main.css carregado.');
      link.onerror = () => console.error('[layout] Falha ao carregar CSS:', cssPath);
      document.head.appendChild(link);
    } else {
      console.log('[layout] main.css já presente.');
    }

    setTimeout(() => {
      document.querySelectorAll('header, footer').forEach(el => el.classList.add('loaded'));
    }, 100);

    setupLayoutInteractions(base);
  } catch (err) {
    console.error('[layout] Erro ao carregar main.html:', err);
    const note = document.createElement('div');
    note.style.background = '#fee';
    note.style.color = '#900';
    note.style.padding = '10px';
    note.style.fontFamily = 'monospace';
    note.textContent = `Erro ao carregar layout: ${err.message}`;
    document.body.prepend(note);
  }
}

function setupLayoutInteractions(base) {
  const userHeader = document.getElementById('dropdownHeader');
  const userMenu = document.getElementById('dropdownMenu');
  const logoutHeader = document.getElementById('logoutDropdownHeader');
  const logoutMenu = document.getElementById('logoutDropdownMenu');

  const toggleMenu = (header, menu) => {
    if (!header || !menu) return;
    header.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.toggle('show');
      menu.classList.toggle('hidden', !menu.classList.contains('show'));
    });
  };

  toggleMenu(userHeader, userMenu);
  toggleMenu(logoutHeader, logoutMenu);

  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown-container') && userMenu) {
      userMenu.classList.remove('show');
      userMenu.classList.add('hidden');
    }
    if (!e.target.closest('.logout-dropdown-container') && logoutMenu) {
      logoutMenu.classList.remove('show');
      logoutMenu.classList.add('hidden');
    }
  });

  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = `${base}pages/login.html`;
    });
  }
}

document.addEventListener('DOMContentLoaded', loadMainLayout);
