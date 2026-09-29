# Gabriel Ferrari — Portfolio

Static HTML/CSS/JavaScript portfolio. No build step or package installation.

## Local preview

Serve the parent directory so the local URL has the same `/Portfolio/` prefix as GitHub Pages:

```bash
python3 -m http.server 8765 --bind 127.0.0.1 --directory /Users/ferrari/Projects/VSCode
```

Open `http://127.0.0.1:8765/Portfolio/pt/` or `/Portfolio/en/`.

## Checks

```bash
node --check script.js
node scripts/check.mjs
```

## Structure

- `index.html`: language entry, with real PT/EN links without JavaScript.
- `pt/index.html` and `en/index.html`: independent static localized home pages.
- `style.css`: shared tokens, typography, layout, system dark theme and reduced motion.
- `script.js`: manual language preference and entry redirect only. Explicit locale URLs never redirect.
- `assets/`: self-hosted font, current portrait and original Portuguese CV converted to PDF.
- `images/`: original assets retained, not used by the new home.

## Publication configuration

Checked on 29 September 2026: GitHub Pages uses `main`, `/ (root)`, at `https://ghabrielferrari.github.io/Portfolio/`, with HTTPS. No custom build workflow or publishing-setting change is required. This implementation is a local review checkpoint and has not been published.

## Content boundaries

This checkpoint contains the home only. Selected Work describes Gabriel's confirmed contributions in Carely, Fintech and Jordania. The Carely captures are development screenshots with demo data; the precise screenshot revision in the current App Store binary remains unconfirmed. Complete case pages and an English CV remain pending. Commit history must not be treated as the sole proof of authorship.

Source Sans 3 remains the chosen typeface. The existing palette, hierarchy, responsive layout, dark mode and reduced-motion support are preserved.

## Assets

- Source Sans 3: Google Fonts, Adobe, SIL Open Font License included in `assets/fonts/OFL.txt`.
- Portrait: Gabriel Ferrari's current public GitHub avatar, inspected against the supplied professional photograph.
- Portuguese CV: converted from `/Users/ferrari/Desktop/cv_gabrielferrari.docx` without rewriting its content. The original DOCX is not bundled with the site.

- Carely: five development screenshots supplied by Gabriel, resized and JPEG compressed without changing screen content.
