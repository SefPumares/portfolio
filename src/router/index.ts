import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw,
  type RouterHistory,
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { site } from '@/data/site'
import { findPublishedProject } from '@/data/projects'
import { expectPageExit, pageExited } from '@/lib/page-transition'

declare module 'vue-router' {
  interface RouteMeta {
    /** Page name shown before the site name in the browser tab. Omit on the home page. */
    title?: string
  }
}

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: { title: 'Projects' },
  },
  {
    path: '/projects/:id',
    name: 'project',
    component: () => import('@/views/ProjectDetailView.vue'),
    // Unknown or unpublished ids render the 404 page, keeping the URL the visitor typed.
    beforeEnter: (to) => {
      if (findPublishedProject(String(to.params.id))) return true
      return {
        name: 'not-found',
        params: { pathMatch: to.path.substring(1).split('/') },
        query: to.query,
        hash: to.hash,
        replace: true,
      }
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'Contact' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
]

/** Browser-tab title for a route. */
export function titleFor(route: RouteLocationNormalized): string {
  const base = `${site.name} — ${site.title}`
  if (route.name === 'project') {
    const project = findPublishedProject(String(route.params.id))
    return project ? `${project.title} · ${site.name}` : base
  }
  return route.meta.title ? `${route.meta.title} · ${site.name}` : base
}

export function createAppRouter(history: RouterHistory = createWebHistory(import.meta.env.BASE_URL)) {
  const router = createRouter({
    history,
    routes,
    async scrollBehavior(to, from, savedPosition) {
      // Same page (e.g. a #hash link): scroll immediately.
      if (to.path === from.path) {
        return to.hash ? { el: to.hash, top: 80 } : false
      }
      // Wait for the outgoing page to finish animating before moving the scroll position.
      await pageExited()
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, top: 80 }
      return { top: 0 }
    },
  })

  router.beforeEach((to, from) => {
    if (from.matched.length && to.path !== from.path) expectPageExit()
  })

  router.afterEach((to) => {
    if (typeof document !== 'undefined') document.title = titleFor(to)
  })

  return router
}

/** In-memory router for unit tests. */
export const createTestRouter = () => createAppRouter(createMemoryHistory())
