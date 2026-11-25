import { expect, test, type Page } from '@playwright/test'

const pages = [
  { path: '/', heading: 'Yosef Pumares', nav: 'Home' },
  { path: '/projects', heading: 'Projects', nav: 'Projects' },
  { path: '/about', heading: 'About me', nav: 'About' },
  { path: '/contact', heading: 'Get in touch', nav: 'Contact' },
] as const

const projectIds = [
  'xepto-grader-tool',
  'xepto-health-checker',
  'xepto-module-repository',
  'xepto-biblio',
  'xepto-metabase',
  'ms17-reclaimed-valor',
]

/** Collects console errors/warnings, page errors (incl. CSP violations) and failed requests. */
function trackProblems(page: Page) {
  const problems: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') problems.push(`[console.${msg.type()}] ${msg.text()}`)
  })
  page.on('pageerror', (err) => problems.push(`[pageerror] ${err.message}`))
  page.on('requestfailed', (req) => problems.push(`[requestfailed] ${req.url()}`))
  page.on('response', (res) => {
    if (res.status() >= 400) problems.push(`[http ${res.status()}] ${res.url()}`)
  })
  return problems
}

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768

/**
 * Clicks a primary navigation link (via the mobile menu on small screens) and waits until the
 * route has committed: client-side navigation is asynchronous, so the click returns first.
 */
async function navigate(page: Page, label: string) {
  const path = pages.find((p) => p.nav === label)!.path
  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Open navigation menu' }).click()
    await page.locator('#mobile-nav').getByRole('link', { name: label, exact: true }).click()
    await expect(page.locator('#mobile-nav')).toHaveCount(0)
  } else {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label, exact: true }).click()
  }
  await expect(page).toHaveURL(path)
}

const h1 = (page: Page) => page.locator('#main h1')
/** Accessible page heading text (the hero h1 animates hidden word copies; screen readers get the sr-only name). */
const headingText = (page: Page) =>
  h1(page).evaluate((el) => (el.querySelector('.sr-only') ?? el).textContent?.trim() ?? '')

test.describe('portfolio', () => {
  test('every page loads without console errors, failed requests or CSP violations', async ({ page }) => {
    test.slow() // visits many pages in one test
    const problems = trackProblems(page)
    for (const path of [...pages.map((p) => p.path), ...projectIds.map((id) => `/projects/${id}`)]) {
      await page.goto(path)
      await expect(h1(page)).toBeVisible()
      // Scroll to the bottom so scroll-triggered content and the 3D scene initialise.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForLoadState('networkidle')
    }
    expect(problems).toEqual([])
  })

  test('has metadata, language and favicon', async ({ page, request }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('Yosef Pumares — Junior Software Developer')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Junior Software Developer/)
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Yosef Pumares/)
    const icon = await page.locator('link[rel="icon"]').getAttribute('href')
    expect(icon).toBe('/favicon.svg')
    const res = await request.get(icon!)
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('svg')
  })

  test('serves the production security headers', async ({ request }) => {
    const res = await request.get('/')
    const headers = res.headers()
    expect(headers['content-security-policy']).toContain("script-src 'self'")
    expect(headers['x-content-type-options']).toBe('nosniff')
  })

  test('has no horizontal overflow on any page', async ({ page }) => {
    test.slow() // visits many pages in one test
    for (const path of [...pages.map((p) => p.path), '/projects/xepto-grader-tool']) {
      await page.goto(path)
      await expect(h1(page)).toBeVisible()
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, path).toBeLessThanOrEqual(0)
    }
  })

  test('navigation reaches every page, updates title, active link and focus', async ({ page }) => {
    await page.goto('/')
    for (const target of [...pages.slice(1), pages[0]]) {
      await navigate(page, target.nav)
      await expect(page).toHaveURL(target.path)
      await expect.poll(() => headingText(page)).toBe(target.heading)
      await expect(page).toHaveTitle(target.path === '/' ? /Junior Software Developer/ : `${target.nav} · Yosef Pumares`)
      // Focus moves to the new page's heading so screen readers announce it.
      await expect(h1(page)).toBeFocused()
      // Each page starts at the top.
      expect(await page.evaluate(() => window.scrollY)).toBe(0)
      if (!isMobile(page)) {
        await expect(
          page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: target.nav, exact: true }),
        ).toHaveAttribute('aria-current', 'page')
      }
    }
  })

  test('hero calls to action reach projects and contact', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Explore My Projects' }).click()
    await expect(page).toHaveURL('/projects')
    await expect(h1(page)).toHaveText('Projects')
    await page.goto('/')
    await page.getByRole('link', { name: 'Contact Me' }).click()
    await expect(page).toHaveURL('/contact')
    await expect(h1(page)).toHaveText('Get in touch')
  })

  test('back and forward buttons restore pages and scroll position', async ({ page }) => {
    await page.goto('/about')
    await expect(h1(page)).toHaveText('About me')
    await page.evaluate(() => window.scrollTo(0, 900))
    await page.waitForTimeout(100)
    const before = await page.evaluate(() => window.scrollY)
    expect(before).toBeGreaterThan(0)

    await navigate(page, 'Contact')
    await expect(h1(page)).toHaveText('Get in touch')
    await page.goBack()
    await expect(h1(page)).toHaveText('About me')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(before)
    await page.goForward()
    await expect(h1(page)).toHaveText('Get in touch')
  })

  test('rapid back/forward does not leave a blank or duplicated page', async ({ page }) => {
    await page.goto('/')
    await navigate(page, 'Projects')
    await navigate(page, 'About')
    await navigate(page, 'Contact')
    for (let i = 0; i < 3; i++) {
      await page.goBack()
      await page.goForward()
    }
    await page.goBack()
    await page.goBack()
    await expect(page).toHaveURL('/projects')
    await expect(h1(page)).toHaveCount(1)
    await expect(h1(page)).toHaveText('Projects')
  })

  test('mobile menu is keyboard operable and closes with Escape', async ({ page }) => {
    test.skip(!isMobile(page), 'mobile-only control')
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Open navigation menu' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#mobile-nav').getByRole('link', { name: 'Home' })).toBeFocused()
    // The menu overlays the page: it must not push content down (which shifts the scroll position).
    expect(await page.locator('body > #app header').first().evaluate((el) => el.getBoundingClientRect().height)).toBeLessThanOrEqual(80)
    await page.keyboard.press('Escape')
    await expect(page.locator('#mobile-nav')).toHaveCount(0)
    await expect(toggle).toBeFocused()
  })

  test('project cards open their case-study pages', async ({ page }) => {
    test.slow() // visits many pages in one test
    await page.goto('/projects')
    const links = page.getByRole('link', { name: /^View case study/ })
    await expect(links).toHaveCount(projectIds.length)
    for (const id of projectIds) {
      await page.goto('/projects')
      await page.locator(`a[href="/projects/${id}"]`).first().click()
      await expect(page).toHaveURL(`/projects/${id}`)
      await expect(h1(page)).not.toBeEmpty()
      await expect(h1(page)).toBeFocused()
    }
  })

  test('case study shows full details and links to neighbours', async ({ page }) => {
    await page.goto('/projects')
    await page.getByRole('link', { name: /View case study\s*: Xepto Grader Tool/ }).click()
    await expect(h1(page)).toHaveText('Xepto Grader Tool')
    await expect(page).toHaveTitle('Xepto Grader Tool · Yosef Pumares')
    const main = page.locator('#main')
    await expect(main).toContainText('not a controlled benchmark')
    await expect(main).toContainText('Capacitor')

    await page.getByRole('navigation', { name: 'More projects' }).getByRole('link', { name: /Next project/ }).click()
    await expect(page).toHaveURL('/projects/xepto-health-checker')
    await expect(h1(page)).toHaveText('Xepto Health Checker')

    await page.getByRole('link', { name: 'All projects' }).click()
    await expect(page).toHaveURL('/projects')
  })

  test('deep links load directly and survive a reload', async ({ page }) => {
    await page.goto('/projects/xepto-biblio')
    await expect(h1(page)).toHaveText('Xepto Biblio')
    await page.reload()
    await expect(h1(page)).toHaveText('Xepto Biblio')
    await page.goto('/about')
    await expect(h1(page)).toHaveText('About me')
  })

  test('unknown pages and project ids show a helpful 404', async ({ page }) => {
    for (const path of ['/this-does-not-exist', '/projects/not-a-project', `/projects/${'a'.repeat(3000)}`, '/projects/%3Cscript%3E']) {
      const problems = trackProblems(page)
      await page.goto(path)
      await expect(h1(page)).toHaveText('Page not found')
      await expect(page).toHaveTitle('Page not found · Yosef Pumares')
      expect(problems.filter((p) => !p.includes('[http'))).toEqual([])
    }
    await page.getByRole('link', { name: 'Back to home' }).click()
    await expect(page).toHaveURL('/')
  })

  test('links have real destinations and no resume link while the PDF is missing', async ({ page, request }) => {
    for (const path of ['/', '/contact', '/about']) {
      await page.goto(path)
      await expect(h1(page)).toBeVisible()
      const hrefs = await page.locator('a').evaluateAll((els) => els.map((a) => a.getAttribute('href') ?? ''))
      for (const href of hrefs) {
        expect(href).not.toBe('')
        expect(href).not.toBe('#')
        expect(href).not.toMatch(/todo|undefined|null|example\.com/i)
      }
      if (path === '/contact') {
        expect(hrefs).toContain('mailto:yosef.pumares22@gmail.com')
        expect(hrefs).toContain('https://github.com/SefPumares')
      }
    }
    const resumeExists = (await request.get('/resume.pdf')).headers()['content-type']?.includes('pdf') ?? false
    const resumeLinks = await page.locator('a[href="/resume.pdf"]').count()
    if (resumeExists) expect(resumeLinks).toBeGreaterThan(0)
    else expect(resumeLinks).toBe(0)
  })

  test('skip link moves focus to main content', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main$/)
    await expect.poll(() => headingText(page)).toBe('Yosef Pumares')
  })

  test('all interactive elements show a visible focus indicator', async ({ page }) => {
    await page.goto('/')
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
      const outline = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return 'none'
        return getComputedStyle(el).outlineStyle
      })
      expect(outline).not.toBe('none')
    }
  })

  test('3D hero renders a canvas when motion is allowed', async ({ page }) => {
    await page.goto('/')
    const scene = page.locator('[data-hero-scene]')
    await expect(scene).toHaveAttribute('data-ready', 'true', { timeout: 10_000 })
    await expect(scene.locator('canvas')).toHaveCount(1)
    // The canvas never intercepts clicks on the hero buttons.
    await page.getByRole('link', { name: 'Explore My Projects' }).click()
    await expect(page).toHaveURL('/projects')
    // Leaving the page disposes the scene.
    await expect(page.locator('[data-hero-scene] canvas')).toHaveCount(0)
  })

  test('hero portrait is preloaded but hidden until the name is used', async ({ page }) => {
    const responses: { type: string; size: number }[] = []
    page.on('response', async (res) => {
      if (/\/assets\/yosef-\d+-.*\.webp$/.test(new URL(res.url()).pathname)) {
        responses.push({ type: res.headers()['content-type'] ?? '', size: (await res.body()).length })
      }
    })
    await page.goto('/')
    const figure = page.locator('[data-hero-figure]')
    const img = figure.locator('img')
    await expect(img).toHaveAttribute('alt', '')
    await expect(figure).toHaveAttribute('aria-hidden', 'true')
    // Loaded up front, so it appears instantly on hover; small WebP files.
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0)
    expect(responses.length).toBeGreaterThan(0)
    for (const r of responses) {
      expect(r.type).toContain('image/webp')
      expect(r.size).toBeLessThan(150 * 1024)
    }
    await page.waitForTimeout(1500)
    await expect(figure).toHaveAttribute('data-revealed', 'false')
    expect(await figure.evaluate((el) => getComputedStyle(el).opacity)).toBe('0')
  })

  test('hovering the name reveals the portrait; it stays while hovered and hides after leaving', async ({ page }) => {
    test.skip(page.viewportSize()!.width < 1024, 'hover reveal is for wide layouts; narrower ones click or tap')
    await page.goto('/')
    const figure = page.locator('[data-hero-figure]')
    const tilt = figure.locator('img').locator('xpath=../..')
    await page.waitForTimeout(1500)
    const rest = await tilt.evaluate((el) => getComputedStyle(el).transform)
    await expect(page.locator('[data-name-hint]')).toBeHidden() // no hint where hover works

    await page.locator('[data-hero-name]').hover()
    await expect(figure).toHaveAttribute('data-revealed', 'true')
    await expect.poll(() => figure.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
    const atName = await tilt.evaluate((el) => getComputedStyle(el).transform)

    // Move onto the portrait (within the hide delay): it stays open and tilts toward the pointer.
    const box = (await figure.boundingBox())!
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.25, { steps: 4 })
    await page.waitForTimeout(800)
    await expect(figure).toHaveAttribute('data-revealed', 'true')
    await expect.poll(() => tilt.evaluate((el) => getComputedStyle(el).transform)).not.toBe(atName)

    // It does not cover the heading or the call-to-action buttons.
    const shown = (await figure.boundingBox())!
    for (const target of [h1(page), page.getByRole('link', { name: 'Explore My Projects' })]) {
      const t = (await target.boundingBox())!
      const overlaps =
        shown.x < t.x + t.width && t.x < shown.x + shown.width && shown.y < t.y + t.height && t.y < shown.y + shown.height
      expect(overlaps).toBe(false)
    }

    // Leave both: it hides and springs back to rest.
    await page.mouse.move(40, page.viewportSize()!.height - 40, { steps: 4 })
    await expect(figure).toHaveAttribute('data-revealed', 'false', { timeout: 2000 })
    await expect.poll(() => figure.evaluate((el) => getComputedStyle(el).opacity)).toBe('0')
    await expect.poll(() => tilt.evaluate((el) => getComputedStyle(el).transform), { timeout: 5000 }).toBe(rest)

    // Escape closes it immediately.
    await page.locator('[data-hero-name]').hover()
    await expect(figure).toHaveAttribute('data-revealed', 'true')
    await page.keyboard.press('Escape')
    await expect(figure).toHaveAttribute('data-revealed', 'false')
  })

  test('below the wide layout, clicking the name toggles the portrait above it', async ({ page }) => {
    test.skip(page.viewportSize()!.width >= 1024, 'narrow layouts only')
    await page.goto('/')
    const figure = page.locator('[data-hero-figure]')
    const hint = page.locator('[data-name-hint]')
    await expect(hint).toBeVisible()
    await page.waitForTimeout(1200)
    const nameBefore = (await h1(page).boundingBox())!.y

    await page.locator('[data-hero-name]').click()
    await expect(figure).toHaveAttribute('data-revealed', 'true')
    await expect(hint).toHaveCount(0)
    await expect.poll(async () => (await figure.boundingBox())!.height, { timeout: 3000 }).toBeGreaterThan(200)
    // The name moved down to make room (by less than the full height where the hero content is
    // vertically centred), and the portrait sits entirely above it.
    expect((await h1(page).boundingBox())!.y).toBeGreaterThan(nameBefore + 40)
    const shown = (await figure.boundingBox())!
    const heading = (await h1(page).boundingBox())!
    expect(shown.y + shown.height).toBeLessThanOrEqual(heading.y + 1)

    // Moving the mouse away does not close it here (no hover behaviour below lg); clicking again does.
    await page.mouse.move(5, 5)
    await page.waitForTimeout(700)
    await expect(figure).toHaveAttribute('data-revealed', 'true')
    await page.locator('[data-hero-name]').click()
    await expect(figure).toHaveAttribute('data-revealed', 'false')
    await expect.poll(async () => (await figure.boundingBox())!.height, { timeout: 3000 }).toBeLessThan(1)
  })

  test('resizing during a page transition keeps the layout intact', async ({ page }) => {
    await page.goto('/')
    const size = page.viewportSize()!
    await navigate(page, 'About')
    await page.setViewportSize({ width: Math.max(320, size.width - 200), height: size.height })
    await expect(h1(page)).toHaveText('About me')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('content is fully visible without animations and the 3D scene is skipped', async ({ page }) => {
    await page.goto('/about')
    // Content far down the page is visible without having been scrolled into view.
    const lastEntry = page.locator('#experience ol > li').last()
    expect(await lastEntry.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
    expect(await lastEntry.evaluate((el) => getComputedStyle(el).transform)).toBe('none')

    await page.goto('/')
    await page.waitForTimeout(1500)
    await expect(page.locator('[data-hero-scene] canvas')).toHaveCount(0)
    await expect(page.locator('[data-hero-scene]')).toHaveAttribute('data-ready', 'false')
    const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)
    expect(behavior).toBe('auto')

    // The portrait still reveals (clicking the name works on every layout), as a plain fade:
    // fully opaque once shown, with no tilt, rise or float transforms on any layer.
    const portrait = page.locator('[data-hero-figure]')
    await page.locator('[data-hero-name]').click()
    await expect(portrait).toHaveAttribute('data-revealed', 'true')
    await expect.poll(() => portrait.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
    const transforms = await portrait.evaluate((el) =>
      [el, ...el.querySelectorAll('*')].map((n) => getComputedStyle(n).transform),
    )
    expect(transforms.every((t) => t === 'none')).toBe(true)
  })
})

test.describe('touch phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

  test('tapping the name toggles the portrait; a tap elsewhere or Escape closes it', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'one touch-phone run is enough')
    await page.goto('/')
    const figure = page.locator('[data-hero-figure]')
    const name = page.locator('[data-hero-name]')
    const hint = page.locator('[data-name-hint]')
    await expect(hint).toBeVisible()
    await expect(hint).toHaveText(/Tap my name/)
    await page.waitForTimeout(1200)

    await name.tap()
    await expect(figure).toHaveAttribute('data-revealed', 'true')
    await expect(hint).toHaveCount(0)
    await expect.poll(async () => (await figure.boundingBox())!.height, { timeout: 3000 }).toBeGreaterThan(200)

    await name.tap() // tap again: hides
    await expect(figure).toHaveAttribute('data-revealed', 'false')

    await name.tap()
    await expect(figure).toHaveAttribute('data-revealed', 'true')
    await page.getByText(/I build practical software/).tap() // tap elsewhere: hides
    await expect(figure).toHaveAttribute('data-revealed', 'false')

    await name.tap()
    await expect(figure).toHaveAttribute('data-revealed', 'true')
    await page.keyboard.press('Escape')
    await expect(figure).toHaveAttribute('data-revealed', 'false')
  })
})

test('screenshots for visual review', async ({ page }, testInfo) => {
  test.slow() // visits many pages in one test
  const name = testInfo.project.name
  await page.goto('/')
  await expect(page.locator('[data-hero-scene]')).toHaveAttribute('data-ready', 'true', { timeout: 10_000 })
  await page.waitForTimeout(1200) // let the entrance animation and 3D fade-in settle
  await page.screenshot({ path: `test-results/screens/${name}-home-hero.png` })

  // Full-page shots with reduced motion so every scroll-revealed block is visible.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const path of ['/', '/projects', '/projects/xepto-grader-tool', '/about', '/contact', '/nope']) {
    await page.goto(path)
    await expect(h1(page)).toBeVisible()
    await page.waitForLoadState('networkidle')
    const slug = path === '/' ? 'home' : path.slice(1).replace(/\//g, '-')
    await page.screenshot({ path: `test-results/screens/${name}-${slug}.png`, fullPage: true })
  }
})
