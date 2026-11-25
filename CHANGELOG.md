# Changelog

## 2.4.0 — 2026-11-25

### Changed
- The hero portrait is hidden until a visitor interacts with the name:
  - **Wide screens with a mouse:** hovering "Yosef Pumares" makes the photo rise into the particle field, and the field ripples around it. It stays while you hover the name or the photo, and hides shortly after you leave both.
  - **Touch screens and narrower windows:** tap or click the name to show or hide the photo above it. A small "Tap my name" / "Click my name" hint shows until the first use. Tapping elsewhere or pressing Escape closes it.
- The name turns light cyan while the photo is shown.
- The photo is now decorative for screen readers, since the name is already the page heading.

## 2.3.0 — 2026-11-25

### Added
- An interactive portrait in the home hero. The background was removed locally and nothing was uploaded; the images are WebP files of 20 KB and 32 KB with no metadata.
  - **Mouse:** it tilts toward the pointer, and a cyan glow behind it drifts after the pointer.
  - **Touch screens:** it floats slowly.
  - **Reduced motion:** it stays still.
  - **On wide screens**, the 3D particle field sends slow rings out from under the figure.
  - **Below 1024 px**, it sits above the name in a frame that fades out at the bottom.

## 2.2.0 — 2026-11-25

### Added
- A one-page resume generated from `resume/resume.html` with `npm run resume` and saved as `public/resume.pdf`. The "Resume" download buttons now appear across the site.
- `canonicalUrl` is set to the production URL, so the site now has `<link rel="canonical">` and `og:url` tags.

### Changed
- Biblio lists WordPress. The Grader Tool speed-up is confirmed and no longer described as only "reported".

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
