# guynaor.site

Portfolio of Guy Naor — Industrial Designer / Creative / Entrepreneur.
Plain HTML/CSS/JS, no build step, no dependencies (Google Fonts is the only external resource). Hosted free on GitHub Pages with the custom domain `guynaor.site`.

## Structure

| File | Purpose |
|---|---|
| `index.html` | Homepage — project grid + contact |
| `info.html` | Bio, services/software table, contact |
| `project-yoto.html` | Yoto & Yoto Mini case page (complete — use as reference) |
| `project-pigzbe.html`, `project-economad.html`, `project-untitled.html`, `project-uniqlo.html`, `project-chip.html` | Project pages awaiting text + images |
| `project-TEMPLATE.html` | Copy this to add a new project |
| `404.html` | Styled not-found page (GitHub Pages serves it automatically) |
| `style.css` / `script.js` | Shared styles and JS (clock, header scroll) |
| `CNAME` | Custom domain for GitHub Pages — do not delete |
| `images/` | Project photos + portrait |

## Adding images

1. Resize to ~1600px max width, export JPEG at ~80% quality.
2. Drop into `images/` (grid thumbs display at 4:3 — they're cropped with `object-fit: cover`, so any aspect ratio works).
3. In the HTML, replace the `<div class="placeholder">…</div>` / `<span class="hero-placeholder">…</span>` with `<img src="images/name.jpg" alt="…" loading="lazy">` — the commented-out examples are already in place.

## Adding a project

1. Copy `project-TEMPLATE.html` → `project-name.html`, fill in the `[PLACEHOLDERS]`.
2. Add a card to the grid in `index.html` (copy an existing `.project-item`).

## Local preview

Just open `index.html` in a browser, or run any static server, e.g. `python -m http.server`.

## Deployment

Pushed to GitHub, served by GitHub Pages from the `main` branch root. DNS at the registrar points the apex to GitHub Pages' A records (185.199.108.153 / .109 / .110 / .111) and `www` via CNAME to the GitHub Pages hostname.
