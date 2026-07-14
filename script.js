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

// ── HEADER SCROLL ──
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ═══════════════════════════════════════════════
//  SCATTER FIELD + PROJECT VIEWER (homepage only)
// ═══════════════════════════════════════════════
(function () {
  const field = document.getElementById('field');
  const viewer = document.getElementById('viewer');
  if (!field || !viewer || !window.PROJECTS) return;

  const projects = window.PROJECTS;
  const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]));
  const order = projects.map(p => p.slug);

  // flat list of every image tagged with its project
  const tiles = [];
  projects.forEach(p => p.images.forEach((im, i) => tiles.push({ p, im, i })));

  const hoverlabel = document.getElementById('hoverlabel');
  const prng = seed => () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

  function render(seed) {
    const r = prng(seed);
    const shuffled = tiles.map(t => [t, r()]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
    const frag = document.createDocumentFragment();
    shuffled.forEach(t => {
      const a = document.createElement('a');
      a.className = 'tile';
      a.href = '#' + t.p.slug;
      a.dataset.slug = t.p.slug;
      a.style.setProperty('--rot', (r() * 2.4 - 1.2).toFixed(2) + 'deg');
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = t.im.thumb;
      img.alt = t.p.name;
      if (t.im.w && t.im.h) img.style.aspectRatio = t.im.w + ' / ' + t.im.h;
      a.appendChild(img);
      a.addEventListener('mouseenter', () => focusProject(t.p.slug));
      a.addEventListener('mouseleave', clearFocus);
      frag.appendChild(a);
    });
    field.innerHTML = '';
    field.appendChild(frag);
  }

  function focusProject(slug) {
    field.classList.add('has-focus');
    field.querySelectorAll('.tile').forEach(el =>
      el.classList.toggle('sibling', el.dataset.slug === slug));
    const p = bySlug[slug];
    if (hoverlabel) {
      const bits = [p.name];
      if (p.category) bits.push(p.category);
      let credit = p.role || '';
      if (p.studio) credit += (credit ? ' · ' : '') + p.studio;
      if (credit) bits.push(credit);
      hoverlabel.textContent = bits.join('   —   ');
      hoverlabel.classList.add('on');
    }
  }
  function clearFocus() {
    field.classList.remove('has-focus');
    if (hoverlabel) hoverlabel.classList.remove('on');
  }

  // ── viewer ──
  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function buildViewer(p) {
    const idx = order.indexOf(p.slug);
    const prev = order[(idx - 1 + order.length) % order.length];
    const next = order[(idx + 1) % order.length];
    let credit = p.role || '';
    if (p.studio) credit += (credit ? ' · ' : '') + p.studio;
    const roleClass = /solo/i.test(p.role) ? ' solo' : '';

    let body;
    if (p.writeup && p.writeup.trim()) {
      body = p.writeup.split(/\n\n+/).map(par => '<p>' + esc(par) + '</p>').join('');
    } else {
      body = '<p class="pending">Write-up coming soon.</p>';
    }
    const imgs = p.images.map(im =>
      '<img loading="lazy" src="' + im.full + '" alt="' + esc(p.name) + '"'
      + (im.w && im.h ? ' style="aspect-ratio:' + im.w + ' / ' + im.h + '"' : '') + '>'
    ).join('');

    return ''
      + '<a class="viewer-close" href="#">✕ &nbsp;Close</a>'
      + '<div class="viewer-inner">'
      +   '<div class="viewer-head">'
      +     '<h1>' + esc(p.name) + '</h1>'
      +     (p.category ? '<p class="cat">' + esc(p.category) + '</p>' : '')
      +     (credit ? '<span class="viewer-tag' + roleClass + '">' + esc(credit) + '</span>' : '')
      +   '</div>'
      +   '<div class="viewer-writeup">' + body + '</div>'
      +   '<div class="viewer-imgs">' + imgs + '</div>'
      +   '<div class="viewer-nav">'
      +     '<a href="#' + prev + '"><span class="np">← prev</span><br>' + esc(bySlug[prev].name) + '</a>'
      +     '<a href="#' + next + '" style="text-align:right"><span class="np">next →</span><br>' + esc(bySlug[next].name) + '</a>'
      +   '</div>'
      + '</div>';
  }

  function openProject(slug) {
    const p = bySlug[slug];
    if (!p) return;
    viewer.innerHTML = buildViewer(p);
    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    viewer.scrollTop = 0;
  }
  function closeViewer() {
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function sync() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h && bySlug[h]) openProject(h);
    else closeViewer();
  }

  window.addEventListener('hashchange', sync);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && location.hash) {
      history.pushState('', document.title, location.pathname + location.search);
      sync();
    }
  });

  const shuffleBtn = document.getElementById('shuffle');
  if (shuffleBtn) shuffleBtn.addEventListener('click', () => { clearFocus(); render(Math.floor(Math.random() * 1e5)); });

  render(Date.now() % 1e5);
  sync(); // honour a deep-linked #slug on load
})();
