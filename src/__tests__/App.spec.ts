import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

// jsdom has no matchMedia / IntersectionObserver; components degrade gracefully without them.
vi.stubGlobal(
  'matchMedia',
  vi.fn<(query: string) => Partial<MediaQueryList>>().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn<() => void>(),
    removeEventListener: vi.fn<() => void>(),
  })),
)

afterEach(() => {
  vi.resetModules()
  vi.doUnmock('@/lib/resume')
})

/** Mounts the full app (header, page, footer) at `path` with an in-memory router. */
async function mountApp(path = '/') {
  const { default: App } = await import('@/App.vue')
  const { createTestRouter } = await import('@/router')
  const router = createTestRouter()
  await router.push(path)
  await router.isReady()
  const wrapper = mount(App, { attachTo: document.body, global: { plugins: [router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('App', () => {
  it('renders the name, title and every primary navigation route', async () => {
    const { wrapper } = await mountApp()
    // The visible name is split into animated words (aria-hidden); assistive tech reads the sr-only copy.
    expect(wrapper.find('h1 .sr-only').text()).toBe('Yosef Pumares')
    expect(wrapper.find('h1').attributes('aria-label')).toBeUndefined()
    expect(wrapper.text()).toContain('Junior Software Developer')

    const navTargets = wrapper.findAll('nav[aria-label="Primary"] a').map((a) => a.attributes('href'))
    expect(navTargets).toEqual(['/', '/projects', '/about', '/contact'])
    expect(wrapper.find('nav[aria-label="Primary"] a[aria-current="page"]').text()).toBe('Home')
    wrapper.unmount()
  })

  it.each(['/', '/projects', '/projects/xepto-biblio', '/about', '/contact', '/no-such-page'])(
    '%s has exactly one h1, focusable for route announcements, and no empty or placeholder links',
    async (path) => {
      const { wrapper } = await mountApp(path)
      const h1s = wrapper.findAll('h1')
      expect(h1s).toHaveLength(1)
      expect(h1s[0]!.attributes('tabindex')).toBe('-1')
      expect(h1s[0]!.attributes('data-page-heading')).toBeDefined()
      for (const a of wrapper.findAll('a')) {
        const href = a.attributes('href') ?? ''
        expect(href).not.toBe('')
        expect(href).not.toBe('#')
        expect(href).not.toMatch(/todo|example\.com|undefined|null/i)
      }
      wrapper.unmount()
    },
  )

  it('marks Projects as the current page on a case study', async () => {
    const { wrapper } = await mountApp('/projects/xepto-grader-tool')
    expect(wrapper.find('nav[aria-label="Primary"] a[aria-current="page"]').text()).toBe('Projects')
    expect(wrapper.find('h1').text()).toBe('Xepto Grader Tool')
    expect(wrapper.text()).toContain('reported observation, not a controlled benchmark')
    wrapper.unmount()
  })

  it('links every project card to its case-study page', async () => {
    const { wrapper } = await mountApp('/projects')
    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
    for (const id of ['xepto-grader-tool', 'xepto-biblio', 'xepto-metabase', 'moodle-xlms', 'ms17-reclaimed-valor']) {
      expect(hrefs).toContain(`/projects/${id}`)
    }
    wrapper.unmount()
  })

  it('does not render a resume link when the PDF is missing', async () => {
    vi.doMock('@/lib/resume', () => ({ resumeAvailable: false, resumeHref: '/resume.pdf' }))
    const { wrapper } = await mountApp()
    expect(wrapper.find('a[href="/resume.pdf"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders downloadable resume links when the PDF exists', async () => {
    vi.doMock('@/lib/resume', () => ({ resumeAvailable: true, resumeHref: '/resume.pdf' }))
    const { wrapper } = await mountApp()
    const links = wrapper.findAll('a[href="/resume.pdf"]')
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.attributes('download')).toBe('Yosef-Pumares-Resume.pdf')
      expect(link.attributes('aria-label')).toMatch(/resume \(PDF\)/)
    }
    wrapper.unmount()
  })

  it('opens external contact links safely in a new tab', async () => {
    const { wrapper } = await mountApp('/contact')
    const external = wrapper.findAll('a[target="_blank"]')
    expect(external.length).toBeGreaterThan(0)
    for (const a of external) expect(a.attributes('rel')).toBe('noopener noreferrer')
    wrapper.unmount()
  })
})
