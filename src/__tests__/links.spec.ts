import { describe, expect, it } from 'vitest'
import { contactLinks, displayUrl, isUsableEmail, isUsableUrl, mailtoHref } from '@/lib/links'

describe('isUsableUrl', () => {
  it('accepts real https URLs', () => {
    expect(isUsableUrl('https://github.com/SefPumares')).toBe(true)
  })

  it.each([
    ['empty', ''],
    ['null', null],
    ['undefined', undefined],
    ['bare hash', '#'],
    ['http (insecure)', 'http://github.com/someone'],
    ['javascript scheme', 'javascript:alert(1)'],
    ['placeholder', 'https://github.com/TODO'],
    ['example domain', 'https://example.com/me'],
    ['no TLD', 'https://localhost/me'],
    ['not a URL', 'github.com/someone'],
  ])('rejects %s', (_label, value) => {
    expect(isUsableUrl(value)).toBe(false)
  })
})

describe('email helpers', () => {
  it('builds a mailto link for a valid email', () => {
    expect(mailtoHref('someone@gmail.com')).toBe('mailto:someone@gmail.com')
  })

  it.each(['', 'not-an-email', 'a@b', 'todo@gmail.com', 'x@y.com?subject=hi'])(
    'rejects %j',
    (value) => {
      expect(isUsableEmail(value)).toBe(false)
      expect(mailtoHref(value)).toBeNull()
    },
  )
})

describe('contactLinks', () => {
  it('drops missing and invalid destinations instead of rendering broken links', () => {
    const links = contactLinks({
      email: '',
      social: {
        github: 'https://github.com/SefPumares',
        linkedin: '',
        other: [
          { label: 'Blog', href: '' },
          { label: '', href: 'https://valid.dev' },
          { label: 'Site', href: 'https://valid.dev' },
        ],
      },
    })
    expect(links.map((link) => link.id)).toEqual(['github', 'other-2'])
    expect(links.every((link) => link.href.startsWith('https://'))).toBe(true)
  })

  it('returns nothing when no contact details are configured', () => {
    expect(contactLinks({ email: '', social: { github: '', linkedin: '', other: [] } })).toEqual([])
  })
})

describe('displayUrl', () => {
  it('shortens URLs for display', () => {
    expect(displayUrl('https://www.linkedin.com/in/someone/')).toBe('linkedin.com/in/someone')
    expect(displayUrl('mailto:me@gmail.com')).toBe('me@gmail.com')
  })
})
