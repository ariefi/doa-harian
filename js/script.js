/* =========================
   LOAD DATA DOA
========================= */
fetch('data/doa.json')
  .then(response => response.json())
  .then(data => {

      data.sort((a, b) => a.urutan - b.urutan);

      const container = document.getElementById('doaContainer');

      data.forEach(doa => {
          const card = document.createElement('div');
          card.className = 'doa';

          card.innerHTML = `
              <div class="judul">${doa.urutan}. ${doa.judul}</div>
              <div class="arabic">${doa.arabic}</div>
              <div class="arti">${doa.arti}</div>
          `;

          container.appendChild(card);
      });

      updateFocus(); // trigger focus setelah render
  });


/* =========================
   TOGGLE ARTI
========================= */
const toggleBtn = document.getElementById('toggleArti');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('hide-arti');

        toggleBtn.innerText =
            document.body.classList.contains('hide-arti')
            ? 'Arabic + Arti'
            : 'Arabic Only';
    });
}


/* =========================
   DARK MODE
========================= */
const darkBtn = document.getElementById('toggleDark');

if (darkBtn) {

    if (localStorage.getItem('darkmode') === 'on') {
        document.body.classList.add('dark');
        darkBtn.innerText = '☀️';
    }

    darkBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');

        if (document.body.classList.contains('dark')) {
            localStorage.setItem('darkmode', 'on');
            darkBtn.innerText = '☀️';
        } else {
            localStorage.setItem('darkmode', 'off');
            darkBtn.innerText = '🌙';
        }
    });
}


/* =========================
   READING FOCUS EFFECT
========================= */
function updateFocus() {
    const cards = document.querySelectorAll('.doa');
    const screenCenter = window.innerHeight / 2;

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;

        if (Math.abs(screenCenter - cardCenter) < rect.height / 2) {
            card.classList.add('focus');
        } else {
            card.classList.remove('focus');
        }
    });
}

window.addEventListener('scroll', updateFocus);
window.addEventListener('load', updateFocus);


/* =========================
   SERVICE WORKER
========================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            alert('Update tersedia. Refresh halaman untuk versi terbaru.');
          }
        });

      });

    }).catch(err => console.log('SW registration failed', err));
  });
}