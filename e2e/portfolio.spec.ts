import { expect, test, type Page } from '@playwright/test'

const pages = [
  { path: '/', heading: 'Yosef Pumares', nav: 'Home' },
  { path: '/projects', heading: 'Projects', nav: 'Projects' },
  { path: '/about', heading: 'About me', nav: 'About' },
  { path: '/contact', heading: 'Get in touch', nav: 'Contact' },
] as const

const projectIds = ['xepto-grader-tool', 'xepto-biblio', 'xepto-metabase', 'moodle-xlms', 'ms17-reclaimed-valor']

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
    await page.keyboard.press('Escape')
    await expect(page.locator('#mobile-nav')).toHaveCount(0)
    await expect(toggle).toBeFocused()
  })

  test('project cards open their case-study pages', async ({ page }) => {
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
    await expect(main).toContainText('reported observation, not a controlled benchmark')
    await expect(main).toContainText('not a statement about which devices the tool supports')

    await page.getByRole('navigation', { name: 'More projects' }).getByRole('link', { name: /Next project/ }).click()
    await expect(page).toHaveURL('/projects/xepto-biblio')
    await expect(h1(page)).toHaveText('Xepto Biblio')

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
  })
})

test('screenshots for visual review', async ({ page }, testInfo) => {
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
