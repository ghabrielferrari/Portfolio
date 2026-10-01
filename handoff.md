# Portfolio AI Experiment — handoff

## Goal and state

Built the requested bilingual professional portfolio in `/Users/ferrari/Projects/VSCode/Portfolio-AI-Experiment`, an initially blank managed checkout. The existing Portfolio checkout was used as read-only evidence and asset reference.

The site uses static Astro pages at `/`, `/pt/` and `/en/`, native TypeScript interactions and CSS. Carely has a layered search → details → pre-submission confirmation narrative and a native screenshot dialog. Fintech has three explanatory scenarios, finite playback, manual steps and correctly directed response paths. Jordania has lower visual weight. Profile, education and email-first contact are complete.

PT/EN copy, light/dark themes, equivalent section preservation, reduced motion and a useful no-JavaScript fallback are implemented. The original Portuguese DOCX is downloadable; English prioritizes Contact. No deployment or Git writes were performed.

## Active files

`src/components/Home.astro`, `src/styles/global.css`, `src/scripts/site.ts`, `src/data/content.ts`, `src/components/FintechFlow.astro`, `src/data/flow.ts`, `scripts/check-flow.ts`, `scripts/check-site.mjs`, and `public/` assets. Commands and asset/contribution boundaries are in `README.md`.

## Verification

- Astro type check: zero errors, warnings or hints.
- Production build: three static pages.
- Scenario data check: navigation boundaries, same retry key and response directions.
- Browser checks at initial delivery: 40/40 passed, covering PT/EN × light/dark × desktop/mobile; images, keyboard/dialog focus restoration, finite scenarios, reduced motion, locale/theme persistence, CV download and no-JS content.
- Additional responsive coverage: 320, 360, 430, 560, 768 and 1024 px.
- Automated axe scans: zero WCAG 2/2.1 AA violations across eight locale/theme/viewport combinations. This does not replace assistive-technology testing.
- One local mobile Lighthouse diagnostic: performance 97; accessibility, best practices and SEO 100. LCP 2.4 seconds; total blocking time 0 ms; CLS 0. These are local diagnostic results, not deployment measurements.
- Visual review: desktop and mobile, light and dark, hero, Carely evidence, Fintech diagram and contact.

## Issues encountered and corrected

The portrait orbit initially exceeded the viewport on mobile/tablet; its responsive transform/inset were corrected and a regression check retained. Node type declarations were added for the runnable scenario check. Native Chromium was unavailable, so browser checks use the installed Brave executable. A browser run overlapped a rebuild and saw a transient favicon 404; the complete stable-build rerun passed. Absolute language metadata is generated only when `PUBLIC_SITE_URL` is supplied, avoiding an invented deployment domain.

## Evidence limits and next step

Development/demo Carely captures do not establish the current App Store binary or successful institutional delivery. Fintech remains in development and its diagram makes no real requests. Academy is education. Repository destinations and the App Store link returned HTTP 200 during review; LinkedIn blocks automated fetching, and its exact CV URL was preserved.

The development preview is available at `http://127.0.0.1:4330/pt/` and `/en/`. Review the composition and bilingual copy in that preview. A deployment domain and an English CV are future inputs, not blockers for the current site.

## Latest adjustment — Contact CTA

The English hero Contact link now uses a secondary button style with a neutral surface, visible border and hover feedback. View projects retains the filled primary treatment. Both controls have a 52 px target height. Focused visual review covered 1440 px and 390 px in light/dark themes, keyboard focus and navigation to the contact section. The existing browser check selects Contact by its destination instead of its presentation class. No failed implementation attempts remain for this adjustment.
