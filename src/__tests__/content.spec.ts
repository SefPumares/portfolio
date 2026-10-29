import { describe, expect, it } from 'vitest'
import { projects, publishedProjects } from '@/data/projects'
import { experience } from '@/data/experience'
import { site } from '@/data/site'
import { isUsableUrl } from '@/lib/links'
import type { Project } from '@/types/content'

/** Rendered text fields of a project (editorNotes are deliberately excluded — they are never shown). */
function renderedText(project: Project): string[] {
  return [
    project.title,
    project.category,
    project.summary,
    project.problem ?? '',
    project.solution ?? '',
    project.recognition ?? '',
    ...(project.contribution ?? []),
    ...(project.technologies ?? []),
    ...(project.highlights ?? []).flatMap((h) => [h.label, h.detail]),
  ]
}

describe('project content', () => {
  it('has unique ids', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('hides unpublished projects', () => {
    const sample: Project[] = [
      { ...projects[0]!, id: 'a', published: true },
      { ...projects[0]!, id: 'b', published: false },
    ]
    expect(publishedProjects(sample).map((p) => p.id)).toEqual(['a'])
  })

  it('never renders placeholder text', () => {
    for (const project of projects) {
      for (const text of renderedText(project)) {
        expect(text, `${project.id}: "${text}"`).not.toMatch(/TODO|TBD|lorem|placeholder/i)
      }
    }
  })

  it('only links to real https destinations', () => {
    for (const project of projects) {
      for (const link of project.links ?? []) {
        expect(isUsableUrl(link.href), `${project.id}: ${link.href}`).toBe(true)
      }
    }
  })

  it('features at most one project', () => {
    expect(projects.filter((p) => p.featured && p.published).length).toBeLessThanOrEqual(1)
  })

  it('keeps the capstone labelled as academic work', () => {
    expect(projects.find((p) => p.id === 'ms17-reclaimed-valor')?.context).toBe('academic')
  })
})

describe('experience content', () => {
  it('lists the primary (software) experience first', () => {
    expect(experience[0]?.primary).toBe(true)
    expect(experience[0]?.kind).toBe('employment')
  })

  it('keeps student leadership separate from employment', () => {
    expect(experience.find((e) => e.id === 'ibits')?.kind).toBe('leadership')
  })
})

describe('site config', () => {
  it('uses the configured title everywhere it is surfaced', () => {
    expect(site.metaDescription).toContain(site.title)
  })

  it('leaves canonicalUrl empty or sets a real https URL', () => {
    expect(site.canonicalUrl === '' || isUsableUrl(site.canonicalUrl)).toBe(true)
  })
})
