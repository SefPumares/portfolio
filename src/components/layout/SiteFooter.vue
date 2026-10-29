<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'
import { site } from '@/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
    >
      <p>© {{ year }} {{ site.name }}. Built with Vue, TypeScript and Tailwind CSS.</p>
      <a href="#top" class="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg">
        <ArrowUp class="size-4" aria-hidden="true" />
        Back to top
      </a>
    </div>
  </footer>
</template>
