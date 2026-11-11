import { describe, expect, it } from 'vitest'
import { createTestRouter, titleFor } from '@/router'
import { findPublishedProject, projects, publishedProjects } from '@/data/projects'
import type { Project } from '@/types/content'

describe('router', () => {
  it.each([
    ['/', 'home', 'Yosef Pumares — Junior Software Developer'],
    ['/projects', 'projects', 'Projects · Yosef Pumares'],
    ['/about', 'about', 'About · Yosef Pumares'],
    ['/contact', 'contact', 'Contact · Yosef Pumares'],
    ['/projects/xepto-biblio', 'project', 'Xepto Biblio · Yosef Pumares'],
    ['/definitely/not/here', 'not-found', 'Page not found · Yosef Pumares'],
  ])('%s resolves to %s with the title "%s"', async (path, name, title) => {
    const router = createTestRouter()
    await router.push(path)
    expect(router.currentRoute.value.name).toBe(name)
    expect(titleFor(router.currentRoute.value)).toBe(title)
    expect(document.title).toBe(title)
  })

  it('shows the 404 page for an unknown project id and keeps the typed URL', async () => {
    const router = createTestRouter()
    await router.push('/projects/does-not-exist')
    expect(router.currentRoute.value.name).toBe('not-found')
    expect(router.currentRoute.value.path).toBe('/projects/does-not-exist')
  })

  it('treats hostile-looking ids as plain unknown ids', async () => {
    const router = createTestRouter()
    for (const id of ['<script>alert(1)</script>', '..%2F..%2Fetc', 'x'.repeat(5000)]) {
      await router.push(`/projects/${encodeURIComponent(id)}`)
      expect(router.currentRoute.value.name).toBe('not-found')
    }
  })

  it('every published project has a reachable case-study route', async () => {
    const router = createTestRouter()
    for (const project of publishedProjects(projects)) {
      await router.push({ name: 'project', params: { id: project.id } })
      expect(router.currentRoute.value.name).toBe('project')
      expect(router.currentRoute.value.path).toBe(`/projects/${project.id}`)
    }
  })

  it('does not expose unpublished projects', () => {
    const hidden: Project = { ...projects[0]!, id: 'hidden-one', published: false }
    expect(findPublishedProject('hidden-one', [...projects, hidden])).toBeUndefined()
  })
})
