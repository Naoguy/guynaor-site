// ── CLOCK ──
function updateClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
updateClock();
setInterval(updateClock, 1000);

// ── WORK INDEX HOVER PREVIEW ──
// Follows the cursor over index rows. Shows the row's data-img when present,
// otherwise a labelled swatch. Inactive on touch devices (CSS hides it too).
(() => {
  const preview = document.getElementById('index-preview');
  const index = document.getElementById('work-index');
  if (!preview || !index || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const move = e => {
    const x = Math.min(e.clientX + 24, window.innerWidth - 320);
    const y = Math.min(e.clientY + 24, window.innerHeight - 245);
    preview.style.left = x + 'px';
    preview.style.top = y + 'px';
  };

  index.querySelectorAll('.index-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      const img = row.dataset.img;
      preview.innerHTML = img
        ? `<img src="${img}" alt="">`
        : `<span class="preview-label">[ ${row.dataset.title} ]</span>`;
      preview.classList.add('visible');
    });
    row.addEventListener('mouseleave', () => preview.classList.remove('visible'));
    row.addEventListener('mousemove', move);
  });
})();

// ── HEADER SCROLL ──
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });
