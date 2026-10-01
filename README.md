# Gabriel Ferrari — Portfolio

A bilingual, static portfolio built with Astro 7, strict TypeScript and native CSS/interactions. No React, animation library, backend or contact form. Use Node 24.12+ on the 24.x line (`.nvmrc`); Node 26.x is also supported.

## Run

```sh
npm ci
npm run dev
```

Portuguese: `http://127.0.0.1:4330/Portfolio/pt/`. English: `http://127.0.0.1:4330/Portfolio/en/`. `/Portfolio/` serves the Portuguese home with its canonical pointing to `/Portfolio/pt/`. With JavaScript, only this entry route selects the saved or browser language. Without JavaScript/storage, ordinary PT/EN links remain usable. Language selection keeps the equivalent section and the selected theme.

```sh
npm run check
npm run build
npm run preview
npm test
```

Run `npm run build` before `npm test`; keep `npm run preview` running in another terminal. The tests inspect `dist` and the served site under `/Portfolio/`. Override the server with `SITE_URL=http://127.0.0.1:4331 npm test`. They use installed Brave or Playwright Chromium; set `BROWSER_PATH` or run `npx --no-install playwright install chromium`. `CAPTURE=0 npm test` skips screenshots.

## Edit

- `src/data/content.ts`: PT/EN copy and public destinations.
- `src/components/Home.astro`: page composition, project evidence, profile and contact.
- `src/styles/global.css`: themes, typography, responsive layouts and motion.
- `src/scripts/site.ts`: theme, language context, screenshot dialog and one-time reveals.
- `src/components/FintechFlow.astro` and `src/data/flow.ts`: explanatory scenarios with finite playback and manual navigation.
- `public/media/`: optimized real photography and development captures.
- `public/documents/`: the original Portuguese DOCX supplied by Gabriel.

## Evidence boundaries

Carely is a team project published on the App Store. Its screenshots show development/demo data; they do not establish the exact current App Store build, application delivery or institution receipt. The detail and confirmation captures were reused from the existing local Portfolio assets. The confirmation screen is a pre-submission modal.

Fintech is Gabriel’s personal project and remains in development. The diagram illustrates implementation concepts and makes no API requests. Idempotency does not imply global exactly-once execution.

Jordania is a team project. The described contribution concerns iOS, authentication/session infrastructure and Java/Spring authentication routes. Apple Developer Academy is education. English uses Contact as the secondary hero action because no English CV was supplied.

The portrait and additional Carely captures come from the user-supplied local files. Font licenses are in `public/fonts/`. The original Portuguese CV is available from the PT hero and the EN footer, where its language is identified.

## GitHub Pages

The fixed destination is `https://ghabrielferrari.github.io/Portfolio/`: Astro `site` is the host, `base` is `/Portfolio/`, and `dist/` contains static HTML and assets. Canonical, hreflang and Open Graph URLs use that destination without an environment variable.

`ci.yml` runs deterministic installation, check, build and the existing Chromium tests on push/PR/manual runs. `deploy.yml` publishes `dist/` **only through `workflow_dispatch`**. Before an authorized release, select GitHub Actions as the repository's Pages source; the manual workflow must be available on its default branch. No custom secret is required. This setup does not trigger a publication by itself.
