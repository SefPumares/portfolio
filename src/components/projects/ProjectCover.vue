<script setup lang="ts">
import type { Project } from '@/types/content'

defineProps<{ project: Project }>()
</script>

<template>
  <!-- Typographic cover: decorative only, the card text carries all the information. -->
  <div aria-hidden="true" class="relative isolate overflow-hidden bg-surface-2">
    <div class="absolute inset-0 -z-10" :class="`cover-${project.cover.pattern}`"></div>
    <div
      class="absolute -right-10 -bottom-12 -z-10 size-48 rounded-full bg-accent/10 blur-3xl"
    ></div>
    <div class="flex h-full min-h-36 flex-col justify-between p-5">
      <span class="font-mono text-[0.6875rem] tracking-widest text-subtle uppercase">
        {{ project.context === 'academic' ? 'Academic' : 'Professional' }}
      </span>
      <span class="font-mono text-4xl font-semibold tracking-tight text-fg/85 sm:text-5xl">
        {{ project.cover.monogram }}
      </span>
    </div>
  </div>
</template>
