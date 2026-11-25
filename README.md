# Yosef Pumares — Portfolio

Personal portfolio website. A multi-page static site (client-side routing) built with:
- Vue 3, TypeScript, Vite and Tailwind CSS v4
- Motion for animations
- three.js for the interactive hero

It's ready to deploy on Vercel.

## Edit these first

All site content lives in [`src/data/`](src/data). You should not need to touch components to update content.

| Priority | File | What to check |
| --- | --- | --- |
| 1 | [`src/data/site.ts`](src/data/site.ts) | `canonicalUrl` (set after deploying), `about`, `tagline` |
| 2 | [`src/data/projects.ts`](src/data/projects.ts) | `technologies` and `contribution` for each project — read each project's `editorNotes` |
| 3 | `public/resume.pdf` | Add your resume (see below) |
| 4 | [`src/data/experience.ts`](src/data/experience.ts) | Role details |
| 5 | [`src/data/education.ts`](src/data/education.ts), [`src/data/skills.ts`](src/data/skills.ts) | Education, recognition, skills |

### Content rules built into the code
- **Missing values are hidden.** An empty `email`, `github` or `linkedin` hides that contact card. Project links with an empty, `http:`, placeholder or `example.com` URL are dropped.
- **`editorNotes` are never rendered.** Use them for reminders of what still needs confirming.
- **`published: false`** hides a project, for example a confidential one, without deleting its content.
- **`featured: true`** makes a project the wide card at the top. Use it for at most one project; a unit test enforces this.
- The unit tests fail if rendered project text contains `TODO`, `TBD`, `lorem` or `placeholder`.

## Prerequisites
- Node.js `^22.18.0` or `>=24.12.0`. This repo was developed on Node 24.19.0.
- npm 10+ (developed on npm 11.17).
- For E2E tests only: Microsoft Edge (used by default) or Playwright's Chromium.

## Run locally

```sh
npm install          # install dependencies
npm run dev          # dev server at http://localhost:5173
npm run build        # type-check + production build into dist/
npm run preview      # serve dist/ at http://localhost:4173 (with the production security headers)
```

## Checks

```sh
npm run type-check   # vue-tsc
npm run lint         # oxlint + eslint (both auto-fix)
npm run test:unit    # Vitest (content integrity, link filtering, resume button, rendering)
npm run test:e2e     # Playwright on Edge at 360px, 768px and 1440px widths; builds first
```

- **Without Edge:** run `npx playwright install chromium` once, then `PW_CHANNEL=chromium npm run test:e2e` (PowerShell: `$env:PW_CHANNEL='chromium'; npm run test:e2e`).
- **Screenshots:** the E2E run saves them to `test-results/screens/`. Open the HTML report with `npx playwright show-report`.

## Adding the resume
The resume is generated from [`resume/resume.html`](resume/resume.html). Edit that file, then run `npm run resume` to rewrite `public/resume.pdf`.
- The command uses Edge, or Chromium with `PW_CHANNEL=chromium`.
- It warns if the resume runs past one page.
- Commit both files.

To use a PDF made elsewhere instead:
1. Save your resume as **`public/resume.pdf`**. The exact name matters; to use another, change `resumePath` in `site.ts`.
2. Restart `npm run dev`, or rebuild. The file is detected at startup or build time in `vite.config.ts`.
3. "Resume" download buttons appear in the header, the hero, the mobile menu and the Contact section. Without the file, no button is rendered, so there's never a broken link.

> The PDF is public to anyone visiting the site. Check that it only contains details you're happy to publish.

## Replacing the hero portrait
The portrait lives in [`src/assets/portrait/`](src/assets/portrait) and is shown by [`HeroPortrait.vue`](src/components/sections/HeroPortrait.vue).

To replace it:
1. Export a transparent cutout cropped from the top of the head to about the waist, with no empty margins.
2. Save it as WebP at two widths: `yosef-320.webp` and `yosef-500.webp`. The larger one can be up to about 640 px wide.
3. Update `width`/`height` in `HeroPortrait.vue` to the large file's real size, so the page doesn't jump while it loads.
4. Keep each file under 150 KB; an E2E test enforces this.
5. Strip metadata (EXIF/GPS) before committing. Most export tools do this; `sharp` does by default.

## Adding or updating a project
Add an object to the `projects` array in `src/data/projects.ts`. The `Project` type in [`src/types/content.ts`](src/types/content.ts) documents each field.

```ts
{
  id: 'my-new-project',             // unique, URL-safe
  title: 'My New Project',
  category: 'Web Application · Vue',
  context: 'professional',          // or 'academic'
  published: true,
  cover: { monogram: 'MN', pattern: 'dots' },  // grid | lines | dots | rings | bars
  summary: 'One or two sentences for the card.',
  problem: 'Optional.',
  solution: 'Optional.',
  contribution: ['What you personally did.'],
  highlights: [{ label: 'Outcome', detail: 'Only evidence-backed results.' }],
  technologies: ['Vue.js', 'TypeScript'],
  links: [{ label: 'GitHub', href: 'https://github.com/SefPumares/repo' }],
}
```

Cards and dialogs are generated automatically. Optional sections are skipped when their field is missing.

## Deploying to Vercel (Git integration)
1. Create an empty GitHub repository, e.g. `SefPumares/portfolio`, then push this project:
   ```sh
   git remote add origin https://github.com/SefPumares/portfolio.git
   git push -u origin feature/initial-portfolio
   ```
   Merge to `main` when you're happy. Vercel deploys `main` to production and other branches as previews.
2. Go to <https://vercel.com/new>, import the repository and keep the detected settings. [`vercel.json`](vercel.json) already sets:
   - Framework **Vite**.
   - Build command `npm run build`.
   - Output directory `dist`.
3. Click **Deploy**.
4. Copy the production URL into `canonicalUrl` in `site.ts`, e.g. `https://your-project.vercel.app`. Commit and push. This adds the `<link rel="canonical">` and `og:url` tags.

**Updating the site:** commit and push. Each push to `main` redeploys automatically, and pull requests get preview URLs.

**Custom domain:**
1. In Vercel → Project → Settings → Domains, add the domain and set up the DNS records Vercel shows you.
2. Update `canonicalUrl` to the new domain and push.

**Security headers:** [`vercel.json`](vercel.json) sets a strict Content-Security-Policy (self-hosted assets only, no inline scripts) plus `nosniff`, `Referrer-Policy`, `Permissions-Policy` and `X-Frame-Options`. `npm run preview` serves the same headers, so violations show up locally. If you ever add third-party scripts, analytics or fonts, you'll need to extend the CSP.

**Deep links:** `vercel.json` rewrites every path that doesn't match a real file to `index.html`. That lets client-side routes like `/projects/xepto-biblio` load directly and survive a reload. `vite preview` does the same locally.

## Pages and animation

| Route | Page |
| --- | --- |
| `/` | Hero with the 3D scene, selected work, skills overview, call to action |
| `/projects` | All published projects |
| `/projects/:id` | Case study for one project. Unknown or unpublished ids show the 404 page |
| `/about` | About, skills, experience timeline, education |
| `/contact` | Contact links |

- **Motion** ([motion-v](https://motion.dev/docs/vue)) handles:
  - page transitions (`AnimatePresence` in `App.vue`)
  - scroll reveals (`RevealOnScroll`)
  - magnetic buttons (`MagneticHover`)
  - card tilt
  - the sliding nav pill
  - the card-to-case-study cover fly-in (`src/lib/page-transition.ts`)
- **3D hero**: [`src/components/three/hero-scene.ts`](src/components/three/hero-scene.ts) is plain three.js with a custom point shader. It loads only after first paint, and only when WebGL is available, the visitor doesn't prefer reduced motion, and Save-Data is off. In every other case a CSS glow is shown instead.
- **Reduced motion**: when the OS setting is on, page changes are a short fade, content appears without movement and the 3D scene is skipped.

## Project structure

```
src/
  data/          ← all editable content (site, projects, experience, skills, education)
  types/         TypeScript interfaces for that content
  router/        Routes, page titles, scroll restoration, 404 handling, idle prefetch
  views/         One component per page (Home, Projects, ProjectDetail, About, Contact, NotFound)
  components/
    layout/      SiteHeader (nav with sliding active pill + animated mobile menu), SiteFooter
    sections/    Hero, About, Skills, Projects, Experience, Education, Contact
    projects/    ProjectCard (links to its case study), ProjectCover (CSS-only cover)
    motion/      RevealOnScroll, MagneticHover
    three/       HeroScene (loader + fallback), hero-scene.ts (three.js scene)
    ui/          ButtonLink, TagChip, SectionHeading, ResumeButton, ContactIcon
  lib/           link validation/mailto helpers, resume availability, page-transition coordination
  styles/        Tailwind v4 theme tokens and global styles
  __tests__/     Vitest unit tests
e2e/             Playwright tests
vite.config.ts   Tailwind, metadata injection from site.ts, resume detection, preview headers
vercel.json      Vercel build settings and security headers
```

## Notes
- **Contact form:** there isn't one on purpose. A form needs a real backend or form service to deliver messages; the email link is the contact method.
- **Email spam:** publishing the email as a `mailto:` link exposes it to scrapers. That's an accepted trade-off for a portfolio.
- **Social image:** there's no `og:image`, because no real image is available. If you add one, e.g. `public/og.png` at 1200×630, add an `og:image` tag in `vite.config.ts` using an absolute URL built from `canonicalUrl`.
