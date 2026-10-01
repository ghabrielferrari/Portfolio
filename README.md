# Gabriel Ferrari — Portfolio experiment

A bilingual, static portfolio built with Astro, CSS and native TypeScript. No React, animation library, backend or contact form.

## Run

```sh
npm ci
npm run dev
```

Portuguese: `http://127.0.0.1:4330/pt/`. English: `http://127.0.0.1:4330/en/`. The root route also renders Portuguese. Language selection keeps the equivalent section and the selected theme.

```sh
npm run check
npm run build
npm run preview
npm test
```

The browser check expects a running local server. Override with `BASE_URL=http://127.0.0.1:4331 npm test`. It uses an installed Brave browser when available, or Playwright Chromium; set `BROWSER_PATH` to another Chromium executable or run `npx playwright install chromium`. `CAPTURE=0 npm test` skips screenshots on repeat checks.

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

The portrait and additional Carely captures come from the user-supplied local files. Font licenses are in `public/fonts/`. No deployment domain is assumed and no publishing workflow is configured.

When a hosting domain is chosen, build with `PUBLIC_SITE_URL=https://your-domain.example npm run build` to generate absolute canonical and alternate-language metadata.
