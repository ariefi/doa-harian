/* =========================
   LOAD DATA DOA
========================= */
import { renderDoaList } from '../ui/renderer.js';

fetch('./src/data/doa.json')
  .then(res => res.json())
  .then(data => {
      data.sort((a, b) => a.urutan - b.urutan);
      renderDoaList(data);
      updateFocus();
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
   SMART READING MODE (AUTO WAKE LOCK)
========================= */
let wakeLock = null;
let readingTimer = null;

async function requestWakeLock() {
    try {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if ('wakeLock' in navigator && !wakeLock && isStandalone) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('WakeLock active (Standalone Mode)');
        }
    } catch (err) {
        console.log('WakeLock error:', err);
    }
}

async function releaseWakeLock() {
    if (wakeLock) {
        await wakeLock.release();
        wakeLock = null;
        console.log('WakeLock released');
    }
}

function resetReadingTimer() {
    // saat user scroll → release dulu
    releaseWakeLock();

    // reset timer
    if (readingTimer) {
        clearTimeout(readingTimer);
    }

    // jika tidak scroll selama 3 detik → aktifkan wake lock
    readingTimer = setTimeout(() => {
        requestWakeLock();
    }, 3000);
}

window.addEventListener('scroll', resetReadingTimer);
window.addEventListener('touchmove', resetReadingTimer);
window.addEventListener('load', resetReadingTimer);


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