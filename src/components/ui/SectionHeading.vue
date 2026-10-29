<script setup lang="ts">
defineProps<{
  /** id of the <h2>, referenced by the section's aria-labelledby. */
  id: string
  index: string
  title: string
}>()
</script>

<template>
  <header class="mb-10 max-w-2xl">
    <p class="mb-3 flex items-center gap-3 font-mono text-xs tracking-widest text-accent uppercase">
      <span aria-hidden="true">{{ index }}</span>
      <span aria-hidden="true" class="h-px w-8 bg-line-strong"></span>
    </p>
    <h2 :id="id" class="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{{ title }}</h2>
    <p v-if="$slots.default" class="mt-3 text-base leading-relaxed text-muted">
      <slot />
    </p>
  </header>
</template>
