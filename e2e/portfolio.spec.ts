import { expect, test, type Page } from '@playwright/test'

const sections = ['about', 'skills', 'projects', 'experience', 'contact'] as const

/** Collects console errors, page errors (incl. CSP violations) and failed requests. */
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

test.describe('portfolio', () => {
  test('loads without console errors, failed requests or CSP violations', async ({ page }) => {
    const problems = trackProblems(page)
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Yosef Pumares' })).toBeVisible()
    // Scroll through the page so lazily revealed content and fonts load.
    for (const id of sections) await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await page.waitForLoadState('networkidle')
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

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test('navigation links scroll to every section', async ({ page }) => {
    await page.goto('/')
    for (const id of sections) {
      if (isMobile(page)) {
        await page.getByRole('button', { name: 'Open navigation menu' }).click()
        await page.locator('#mobile-nav').getByRole('link', { name: new RegExp(id, 'i') }).click()
        await expect(page.locator('#mobile-nav')).toBeHidden()
      } else {
        await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: new RegExp(id, 'i') }).click()
      }
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expect(page.locator(`#${id}`)).toBeInViewport()
    }
  })

  test('hero calls to action reach projects and contact', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Explore My Projects' }).click()
    await expect(page.locator('#projects')).toBeInViewport()
    await page.goto('/')
    await page.getByRole('link', { name: 'Contact Me' }).click()
    await expect(page.locator('#contact')).toBeInViewport()
  })

  test('mobile menu is keyboard operable and closes with Escape', async ({ page }) => {
    test.skip(!isMobile(page), 'mobile-only control')
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Open navigation menu' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#mobile-nav').getByRole('link', { name: 'About' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.locator('#mobile-nav')).toBeHidden()
    await expect(toggle).toBeFocused()
  })

  test('project details open in an accessible dialog and return focus', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: /View details about Xepto Grader Tool/ })
    await trigger.scrollIntoViewIfNeeded()
    await trigger.focus()
    await page.keyboard.press('Enter')

    const dialog = page.getByRole('dialog', { name: 'Xepto Grader Tool' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Close project details' })).toBeFocused()
    await expect(dialog).toContainText('reported observation, not a controlled benchmark')
    await expect(dialog).toContainText('not a statement about which devices the tool supports')

    // Focus stays inside the modal while tabbing.
    for (let i = 0; i < 5; i++) await page.keyboard.press('Tab')
    expect(await dialog.evaluate((el) => el.contains(document.activeElement) || document.activeElement === document.body)).toBe(true)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()

    // Close button works too.
    await trigger.click()
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Close project details' }).click()
    await expect(dialog).toBeHidden()
  })

  test('every project has a working detail view', async ({ page }) => {
    await page.goto('/')
    const triggers = page.getByRole('button', { name: /^View details about/ })
    const count = await triggers.count()
    expect(count).toBe(5)
    for (let i = 0; i < count; i++) {
      await triggers.nth(i).click()
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      await expect(dialog.getByRole('heading', { level: 2 })).not.toBeEmpty()
      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
    }
  })

  test('links have real destinations and no resume link while the PDF is missing', async ({ page, request }) => {
    await page.goto('/')
    const hrefs = await page.locator('a').evaluateAll((els) => els.map((a) => a.getAttribute('href') ?? ''))
    for (const href of hrefs) {
      expect(href).not.toBe('')
      expect(href).not.toBe('#')
      expect(href).not.toMatch(/todo|undefined|null|example\.com/i)
      if (href.startsWith('#')) expect(await page.locator(href).count(), href).toBe(1)
    }
    expect(hrefs).toContain('mailto:yosef.pumares22@gmail.com')
    expect(hrefs).toContain('https://github.com/SefPumares')

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
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('content is fully visible without entrance animations', async ({ page }) => {
    await page.goto('/')
    expect(await page.locator('.reveal').count()).toBe(0)
    const opacity = await page.locator('#experience ol > li').first().evaluate((el) => getComputedStyle(el).opacity)
    expect(opacity).toBe('1')
    const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)
    expect(behavior).toBe('auto')
  })
})

test('screenshots for visual review', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: `test-results/screens/${testInfo.project.name}-full.png`, fullPage: true })
  await page.getByRole('button', { name: /View details about Xepto Grader Tool/ }).click()
  await page.screenshot({ path: `test-results/screens/${testInfo.project.name}-dialog.png` })
})
