<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import ResumeButton from '@/components/ui/ResumeButton.vue'
import { useActiveSection } from '@/composables/useActiveSection'
import { site } from '@/data/site'

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

const active = useActiveSection(navItems.map((item) => item.id))

const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const menuLinks = ref<HTMLAnchorElement[]>([])

async function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    await nextTick()
    menuLinks.value[0]?.focus()
  }
}

function closeMenu(returnFocus = false) {
  if (!menuOpen.value) return
  menuOpen.value = false
  if (returnFocus) menuButton.value?.focus()
}

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
  <header class="sticky top-0 z-40 border-b border-line/80 bg-bg/90 backdrop-blur-sm">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <a
        href="#top"
        class="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-fg"
        :aria-label="`${site.name} — back to top`"
      >
        <span
          aria-hidden="true"
          class="grid size-8 place-items-center rounded-md border border-line-strong bg-surface font-mono text-xs text-accent transition-colors group-hover:border-accent/60"
          >YP</span
        >
        <span>{{ site.name }}</span>
      </a>

      <nav aria-label="Primary" class="hidden md:block">
        <ul class="flex items-center gap-1">
          <li v-for="item in navItems" :key="item.id">
            <a
              :href="`#${item.id}`"
              class="rounded-md px-3 py-2 text-sm transition-colors"
              :class="active === item.id ? 'text-fg' : 'text-muted hover:text-fg'"
              :aria-current="active === item.id ? 'location' : undefined"
              >{{ item.label }}</a
            >
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

    <nav
      v-show="menuOpen"
      id="mobile-nav"
      aria-label="Mobile"
      class="border-t border-line bg-bg px-4 pt-2 pb-4 md:hidden"
    >
      <ul class="flex flex-col">
        <li v-for="item in navItems" :key="item.id">
          <a
            ref="menuLinks"
            :href="`#${item.id}`"
            class="flex min-h-12 items-center border-b border-line text-base text-fg"
            @click="closeMenu()"
            >{{ item.label }}</a
          >
        </li>
      </ul>
      <div class="mt-4 empty:hidden">
        <ResumeButton variant="primary" />
      </div>
    </nav>
  </header>
</template>
