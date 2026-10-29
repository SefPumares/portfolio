import type { SiteConfig } from '@/types/content'

export interface ResolvedLink {
  id: string
  label: string
  href: string
  external: boolean
}

const EMAIL_PATTERN = /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[a-z]{2,}$/i
const PLACEHOLDER_PATTERN = /todo|example\.|placeholder|your[-_]?name|username/i

/** True only for real https URLs — rejects empty strings, placeholders and other schemes. */
export function isUsableUrl(value: string | null | undefined): value is string {
  if (!value || PLACEHOLDER_PATTERN.test(value)) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname.includes('.')
  } catch {
    return false
  }
}

export function isUsableEmail(value: string | null | undefined): value is string {
  return !!value && EMAIL_PATTERN.test(value) && !PLACEHOLDER_PATTERN.test(value)
}

export function mailtoHref(email: string): string | null {
  return isUsableEmail(email) ? `mailto:${email}` : null
}

/** Contact destinations that are actually configured, in display order. Missing ones are dropped. */
export function contactLinks(config: Pick<SiteConfig, 'email' | 'social'>): ResolvedLink[] {
  const links: ResolvedLink[] = []
  const mail = mailtoHref(config.email)
  if (mail) links.push({ id: 'email', label: 'Email', href: mail, external: false })
  if (isUsableUrl(config.social.github)) {
    links.push({ id: 'github', label: 'GitHub', href: config.social.github, external: true })
  }
  if (isUsableUrl(config.social.linkedin)) {
    links.push({ id: 'linkedin', label: 'LinkedIn', href: config.social.linkedin, external: true })
  }
  config.social.other.forEach((link, index) => {
    if (link.label.trim() && isUsableUrl(link.href)) {
      links.push({ id: `other-${index}`, label: link.label, href: link.href, external: true })
    }
  })
  return links
}

/** Human-readable form of a URL for display, e.g. "github.com/SefPumares". */
export function displayUrl(href: string): string {
  if (href.startsWith('mailto:')) return href.slice('mailto:'.length)
  try {
    const url = new URL(href)
    return `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`
  } catch {
    return href
  }
}
