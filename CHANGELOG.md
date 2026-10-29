# Changelog

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
