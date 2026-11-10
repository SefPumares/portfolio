<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import { AnimatePresence, motion, useReducedMotion } from 'motion-v'
import ResumeButton from '@/components/ui/ResumeButton.vue'
import { site } from '@/data/site'

const navItems = [
  { name: 'home', label: 'Home', path: '/' },
  { name: 'projects', label: 'Projects', path: '/projects' },
  { name: 'about', label: 'About', path: '/about' },
  { name: 'contact', label: 'Contact', path: '/contact' },
] as const

const route = useRoute()
const reduced = useReducedMotion()

/** Projects stays highlighted on case-study pages (/projects/:id). */
function isActive(path: string): boolean {
  return path === '/' ? route.path === '/' : route.path === path || route.path.startsWith(`${path}/`)
}

const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const menuLinks = ref<{ $el: HTMLAnchorElement }[]>([])

async function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    await nextTick()
    menuLinks.value[0]?.$el.focus()
  }
}

function closeMenu(returnFocus = false) {
  if (!menuOpen.value) return
  menuOpen.value = false
  if (returnFocus) menuButton.value?.focus()
}

// Navigating anywhere closes the mobile menu.
watch(
  () => route.fullPath,
  () => closeMenu(),
)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu(true)
}

// Close the mobile menu if the viewport grows to the desktop layout.
let desktopQuery: MediaQueryList | null = null
const onBreakpoint = (event: MediaQueryListEvent) => {
  if (event.matches) closeMenu()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  desktopQuery = window.matchMedia('(min-width: 768px)')
  desktopQuery.addEventListener('change', onBreakpoint)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  desktopQuery?.removeEventListener('change', onBreakpoint)
})
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-line/80 bg-bg/80 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink
        :to="{ name: 'home' }"
        class="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-fg"
        :aria-label="`${site.name} — home`"
      >
        <span
          aria-hidden="true"
          class="grid size-8 place-items-center rounded-md border border-line-strong bg-surface font-mono text-xs text-accent transition-[border-color,transform] duration-300 group-hover:border-accent/60 motion-safe:group-hover:rotate-6"
          >YP</span
        >
        <span>{{ site.name }}</span>
      </RouterLink>

      <nav aria-label="Primary" class="hidden md:block">
        <ul class="flex items-center gap-1">
          <li v-for="item in navItems" :key="item.name" class="relative">
            <RouterLink
              :to="item.path"
              class="relative z-10 block rounded-md px-3 py-2 text-sm transition-colors"
              :class="isActive(item.path) ? 'text-fg' : 'text-muted hover:text-fg'"
              :aria-current="isActive(item.path) ? 'page' : undefined"
              >{{ item.label }}</RouterLink
            >
            <!-- Shared layoutId: the pill glides from the old active link to the new one. -->
            <motion.span
              v-if="isActive(item.path)"
              layout-id="nav-active-pill"
              aria-hidden="true"
              class="absolute inset-0 rounded-md border border-line-strong bg-surface"
              :transition="{ type: 'spring', stiffness: 380, damping: 32 }"
            />
          </li>
        </ul>
      </nav>

      <div class="hidden md:block">
        <ResumeButton />
      </div>

      <button
        ref="menuButton"
        type="button"
        class="inline-flex size-11 items-center justify-center rounded-md border border-line-strong text-fg md:hidden"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        :aria-label="menuOpen ? 'Close navigation menu' : 'Open navigation menu'"
        @click="toggleMenu"
      >
        <X v-if="menuOpen" class="size-5" aria-hidden="true" />
        <Menu v-else class="size-5" aria-hidden="true" />
      </button>
    </div>

    <AnimatePresence>
      <motion.nav
        v-if="menuOpen"
        id="mobile-nav"
        aria-label="Mobile"
        class="overflow-hidden border-t border-line bg-bg md:hidden"
        :initial="reduced ? { opacity: 0 } : { height: 0, opacity: 0 }"
        :animate="reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }"
        :exit="reduced ? { opacity: 0 } : { height: 0, opacity: 0 }"
        :transition="{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }"
      >
        <div class="px-4 pt-2 pb-4">
          <ul class="flex flex-col">
            <motion.li
              v-for="(item, i) in navItems"
              :key="item.name"
              :initial="reduced ? false : { opacity: 0, x: -12 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ delay: 0.04 + i * 0.04, duration: 0.25 }"
            >
              <RouterLink
                ref="menuLinks"
                :to="item.path"
                class="flex min-h-12 items-center justify-between border-b border-line text-base"
                :class="isActive(item.path) ? 'text-accent' : 'text-fg'"
                :aria-current="isActive(item.path) ? 'page' : undefined"
                @click="closeMenu()"
                >{{ item.label }}</RouterLink
              >
            </motion.li>
          </ul>
          <div class="mt-4 empty:hidden">
            <ResumeButton variant="primary" />
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  </header>
</template>
