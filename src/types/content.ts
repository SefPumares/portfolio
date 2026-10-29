/**
 * Content types for the portfolio.
 *
 * Convention for unknown information:
 *   Leave optional fields out (or empty) rather than guessing. Anything that still needs
 *   confirmation goes in `editorNotes`, which is NEVER rendered on the page.
 */

export interface SocialLinks {
  /** Full https URL, e.g. https://github.com/username. Leave '' to hide. */
  github: string
  /** Full https URL, e.g. https://www.linkedin.com/in/username. Leave '' to hide. */
  linkedin: string
  /** Any other professional links. Entries with an empty or invalid href are hidden. */
  other: { label: string; href: string }[]
}

export interface SiteConfig {
  /** Display name used in the header, hero, title and metadata. */
  name: string
  /** Professional title shown under the name. */
  title: string
  /** Shown in the hero and the About facts list. Keep it general. */
  location: string
  /** One-sentence value statement in the hero. */
  tagline: string
  /** Optional supporting line under the tagline. */
  subtagline: string
  /** About section, one string per paragraph (first person). */
  about: string[]
  /** Public contact email. Leave '' to hide the email link. */
  email: string
  social: SocialLinks
  /**
   * Final public URL of the site, e.g. https://yosefpumares.dev (no trailing slash).
   * Leave '' until the domain is known: canonical and og:url tags are then omitted.
   */
  canonicalUrl: string
  /** Meta description and social-sharing description (~150 characters). */
  metaDescription: string
  /** Public path of the resume. The button only appears if this file exists in /public at build time. */
  resumePath: string
}

export type CoverPattern = 'grid' | 'lines' | 'dots' | 'rings' | 'bars'

export interface ProjectHighlight {
  label: string
  detail: string
}

export interface ProjectLink {
  label: string
  /** Must be a real https URL. Invalid or empty links are not rendered. */
  href: string
}

export interface Project {
  /** Unique, URL-safe identifier. */
  id: string
  title: string
  /** Short category line, e.g. "Web Application · Educational Technology". */
  category: string
  /** Professional (employment) work or an academic project. */
  context: 'professional' | 'academic'
  /** Set to false to hide a project (e.g. confidential) without deleting its content. */
  published: boolean
  /** Promote to the wide card at the top of the grid. Use for at most one project. */
  featured?: boolean
  /** Card cover: 2–3 letter monogram and a CSS background pattern. */
  cover: { monogram: string; pattern: CoverPattern }
  /** One- or two-sentence description shown on the card. */
  summary: string
  /** The problem the project addresses (detail view). */
  problem?: string
  /** What the project does / how it addresses the problem (detail view). */
  solution?: string
  /** Confirmed personal contribution only. Omit when unknown. */
  contribution?: string[]
  /** Outcomes, findings or lessons that are supported by evidence. */
  highlights?: ProjectHighlight[]
  /** Verified technologies only. Omit when unknown. */
  technologies?: string[]
  /** Award or recognition line. */
  recognition?: string
  /** Optional repository or demo links. Only real destinations. */
  links?: ProjectLink[]
  /** Maintainer-only notes about what still needs confirmation. Never rendered. */
  editorNotes?: string[]
}

export interface ExperienceRole {
  title: string
  /** Free text exactly as it should appear, e.g. "Oct 2024 – Present". */
  period: string
  points: string[]
}

export interface ExperienceEntry {
  id: string
  organization: string
  /** Secondary organization line, e.g. a division or campus. */
  organizationDetail?: string
  /** Keeps paid employment and student leadership clearly separated. */
  kind: 'employment' | 'leadership'
  /** Short context line shown above the roles. */
  summary?: string
  /** Most recent role first. */
  roles: ExperienceRole[]
  /** Visually emphasised entry (primary experience). */
  primary?: boolean
  editorNotes?: string[]
}

export interface SkillGroup {
  id: string
  title: string
  icon: 'frontend' | 'backend' | 'data' | 'qa' | 'tools'
  items: string[]
}

export interface Education {
  institution: string
  degree: string
  year: string
  notes: string[]
}

export interface Achievement {
  title: string
  detail: string
  date: string
  kind: 'academic' | 'professional'
}
