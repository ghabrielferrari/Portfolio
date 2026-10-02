# Portfolio — current handoff

## Goal and state

Loop 2 adds evidence-based bilingual project cases to the approved Home in `/Users/ferrari/Projects/VSCode/Portfolio`, branch `feat/portfolio-home`.

Current stack: Astro 7.3.5, strict TypeScript, static output and GitHub Pages base `/Portfolio/`, site `https://ghabrielferrari.github.io`. CI and manual deployment configuration were preserved.

Six cases: `/pt/projetos/{carely,fintech,jordania}/` and `/en/work/{carely,fintech,jordania}/`. Carely is the visual iOS evidence; Fintech explains session/retry/idempotent persistence; Jordania is the compact team integration case. Home changes are three case CTAs and necessary factual corrections. Global styling and the interactive Fintech Home component are unchanged.

## Active files

`src/data/cases.ts` pairs typed PT/EN content and public evidence links. `src/components/CasePage.astro` shares the case document and approved header/footer language. `src/pages/[locale]/[section]/[slug].astro` generates the six approved routes. `src/styles/cases.css` scopes case layout. Minimal integration edits are in `Home.astro`, `content.ts`, `site.ts` and `utils/paths.ts`. Existing build/browser checks now include the cases.

## Evidence boundaries

Carely screenshots contain different demonstrative vacancies; they are representative steps, not a recorded single application or evidence of institutional receipt. No current App Store build correspondence is claimed. Contribution is frontend/iOS within a team.

Fintech sources were checked at public iOS `48ff69b` and API `cba4a86`, matching local HEADs. Session generation guards are described only for login/refresh completion. The portfolio diagram makes no real requests. Product repositories were inspected, not executed in production.

Jordania public iOS `ab20de9` and backend `55c6212` are newer than the local checkouts. The case cites those public snapshots. Attribution is frontend/iOS, session/client integration and contribution to authentication routes; current live Apple/Google operation is not claimed.

Internal claim classifications are in `review/claims-audit.md`. Browser reports, link verification and final screenshots are local review artifacts; generated PNG/JSON files are ignored by Git.

## Verification and issues

Final validation: `npm run check` reports zero errors/warnings/hints; `npm run build` generates nine static routes; `SITE_URL=http://127.0.0.1:4331 npm test` passes 106/106 browser checks, including 48 case locale/theme/viewport combinations and 56 total automated WCAG AA scans without violations. All 17 case external destinations return HTTP 200. Sixteen final screenshots cover Home and cases at mobile/desktop in light/dark. Keyboard navigation, dialog focus restoration, equivalent language switching, no-JS content and reduced motion pass. Final human editorial/visual approval remains pending. A desktop EN stack label initially wrapped within a word; its flex shrinking was disabled and a browser regression assertion added. Python’s local TLS certificate store could not verify public links; native curl verified them without disabling certificate checks. Browser tests explicitly scroll through lazy-loaded images before verifying them.

## Next step

Human editorial and visual review of the cases. Preview for this session: `http://127.0.0.1:4331/Portfolio/pt/` (4330 was already occupied). No commit, push, deployment, stack migration or additional polish is authorized by this loop.
