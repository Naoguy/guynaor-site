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

// ── RAW FIELD: seeded scatter + shuffle ──
// Position (order, rotation, jitter) is randomised; emphasis (size) stays authored in CSS.
(() => {
  const field = document.getElementById('field');
  if (!field) return;
  const cards = Array.from(field.children);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // small seeded PRNG so a given load is stable but each shuffle differs
  const prng = seed => () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

  function scatter(seed) {
    const r = prng(seed);
    const order = cards
      .map(c => [c, r()])
      .sort((a, b) => a[1] - b[1])
      .map(x => x[0]);
    order.forEach(c => {
      if (!reduce) {
        c.style.setProperty('--rot', (r() * 3.4 - 1.7).toFixed(2) + 'deg');
        c.style.setProperty('--jx', Math.round(r() * 14 - 7) + 'px');
      }
      field.appendChild(c); // reappend in new order
    });
  }

  scatter(Date.now() % 100000);

  const btn = document.getElementById('shuffle');
  if (btn) btn.addEventListener('click', () => scatter(Math.floor(Math.random() * 100000)));
})();

// ── HEADER SCROLL ──
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });
