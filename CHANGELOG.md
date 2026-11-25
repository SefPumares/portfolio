# Changelog

## 2.1.0 — 2026-11-25

### Added
- Two Moodle plugin case studies: Xepto Health Checker and Xepto Module Repository. They replace the generic "Moodle / XLMS Work" card.
- Confirmed technologies and contributions:
  - Grader Tool: Vue.js, TypeScript, Capacitor, Python
  - Metabase: MySQL queries and dashboards
  - MS 17 Reclaimed Valor: Unity, C#, team of six, role (terrains, character modelling, voiceovers)
- Skills: Capacitor, Unity and Moodle plugin development.

### Removed
- The unconfirmed "14 devices tested" highlight on the Grader Tool.

### Fixed
- Back/forward now restores the scroll position instantly. Before, the CSS smooth scrolling animated it, and the animation could stop part-way.
- The mobile menu now overlays the page instead of pushing it down. This also fixes the back-button position on phones, which was off by the menu's height.

## 2.0.0 — 2026-11-11

Multi-page redesign with Motion animations and an interactive 3D hero.

### Breaking
- The single scrolling page is now separate pages: `/`, `/projects`, `/projects/:id`, `/about`, `/contact`, plus a 404 page. Old `#section` links such as `/#projects` no longer jump to a section.

### Added
- Routing with `vue-router`. Each page sets its own tab title. Focus moves to the page heading after navigation, and scroll position is restored on back/forward.
- Project case-study pages replace the project dialog. They include previous/next project links, and unknown ids show the 404 page.
- Motion (`motion-v`) animations, all disabled or reduced when the visitor prefers reduced motion:
  - page transitions
  - staggered scroll reveals
  - a timeline that draws in
  - magnetic buttons
  - card tilt
  - a sliding active-nav pill
  - an animated mobile menu
  - a cover that flies from the project card into the case-study page
- An original interactive three.js hero: a particle wave field that ripples around the pointer.
  - It loads lazily, pauses when off-screen and frees its GPU resources when you leave the page.
  - It falls back to a CSS glow when the visitor prefers reduced motion, has Save-Data on, or has no WebGL.
- Other pages' code is prefetched when the browser is idle, so navigation is instant.
- Vercel SPA rewrite, so deep links and reloads work.
- Tests: router unit tests, plus E2E tests for deep links, back/forward, rapid history changes, 404s with hostile URLs, focus handling, the 3D canvas and its fallback, and resizing during a transition.

### Removed
- `ProjectDialog.vue` (replaced by the case-study pages), the `v-reveal` directive (replaced by Motion), and `useActiveSection`.

### Fixed
- Scroll-triggered content still renders when `IntersectionObserver` is unavailable.

## 1.0.0 — 2026-10-30

Initial release.

### Added
- Single-page portfolio:
  - Hero, About, Skills, Projects (cards plus an accessible detail dialog), Experience timeline, Education and recognition, Contact.
- Content kept in `src/data/` with TypeScript types. Project visibility flags and maintainer-only `editorNotes`.
- Contact links validated automatically. Missing or invalid destinations are hidden.
- Resume download buttons appear only when `public/resume.pdf` exists.
- Metadata injected from `site.ts`: title, description, Open Graph, and canonical once a domain is set. SVG favicon.
- Vercel configuration with a strict Content-Security-Policy and other security headers, mirrored in `vite preview`.
- Tests:
  - Vitest unit tests.
  - Playwright E2E tests on Edge at mobile, tablet and desktop widths, covering navigation, mobile menu, dialog focus handling, links, overflow, reduced motion, console and CSP errors, and metadata.
