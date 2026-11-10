<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'
import { site } from '@/data/site'

const year = new Date().getFullYear()

function backToTop() {
  const smooth = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
  document.querySelector<HTMLElement>('#main [data-page-heading]')?.focus({ preventScroll: true })
}
</script>

<template>
  <footer class="border-t border-line">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
    >
      <p>© {{ year }} {{ site.name }}. Built with Vue, TypeScript, Motion and three.js.</p>
      <button
        type="button"
        class="inline-flex min-h-11 items-center gap-1.5 self-start text-muted transition-colors hover:text-fg sm:self-auto"
        @click="backToTop"
      >
        <ArrowUp class="size-4" aria-hidden="true" />
        Back to top
      </button>
    </div>
  </footer>
</template>
