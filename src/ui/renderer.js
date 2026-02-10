/* =========================
   RENDER DOA LIST
========================= */
export function renderDoaList(data) {
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
}