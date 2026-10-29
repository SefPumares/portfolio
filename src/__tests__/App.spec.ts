import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// jsdom has no matchMedia / IntersectionObserver; components degrade gracefully without the latter.
vi.stubGlobal(
  'matchMedia',
  vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
)

afterEach(() => {
  vi.resetModules()
  vi.doUnmock('@/lib/resume')
})

async function mountApp() {
  const { default: App } = await import('@/App.vue')
  return mount(App, { attachTo: document.body })
}

describe('App', () => {
  it('renders the name, title and every navigation target', async () => {
    const wrapper = await mountApp()
    expect(wrapper.find('h1').text()).toBe('Yosef Pumares')
    expect(wrapper.text()).toContain('Junior Software Developer')

    const navTargets = wrapper
      .findAll('nav[aria-label="Primary"] a')
      .map((a) => a.attributes('href'))
    expect(navTargets).toEqual(['#about', '#skills', '#projects', '#experience', '#contact'])
    for (const target of navTargets) {
      expect(wrapper.find(target!).exists(), `${target} section exists`).toBe(true)
    }
    wrapper.unmount()
  })

  it('has exactly one h1 and no empty or placeholder links', async () => {
    const wrapper = await mountApp()
    expect(wrapper.findAll('h1')).toHaveLength(1)
    for (const a of wrapper.findAll('a')) {
      const href = a.attributes('href') ?? ''
      expect(href, a.text()).not.toBe('')
      expect(href, a.text()).not.toBe('#')
      expect(href).not.toMatch(/todo|example\.com|undefined|null/i)
    }
    wrapper.unmount()
  })

  it('does not render a resume link when the PDF is missing', async () => {
    vi.doMock('@/lib/resume', () => ({ resumeAvailable: false, resumeHref: '/resume.pdf' }))
    const wrapper = await mountApp()
    expect(wrapper.find('a[href="/resume.pdf"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders downloadable resume links when the PDF exists', async () => {
    vi.doMock('@/lib/resume', () => ({ resumeAvailable: true, resumeHref: '/resume.pdf' }))
    const wrapper = await mountApp()
    const links = wrapper.findAll('a[href="/resume.pdf"]')
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.attributes('download')).toBe('Yosef-Pumares-Resume.pdf')
      expect(link.attributes('aria-label')).toMatch(/resume \(PDF\)/)
    }
    wrapper.unmount()
  })

  it('opens external contact links safely in a new tab', async () => {
    const wrapper = await mountApp()
    for (const a of wrapper.findAll('a[target="_blank"]')) {
      expect(a.attributes('rel')).toBe('noopener noreferrer')
    }
    wrapper.unmount()
  })
})
