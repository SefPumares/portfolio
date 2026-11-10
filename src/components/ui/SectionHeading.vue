<script setup lang="ts">
import RevealOnScroll from '@/components/motion/RevealOnScroll.vue'

withDefaults(
  defineProps<{
    /** id of the heading, referenced by the section's aria-labelledby. */
    id: string
    index: string
    title: string
    /**
     * 1 for the page's main heading (one per page). It is focusable (tabindex -1) so focus can be
     * moved to it after client-side navigation, which announces the new page to screen readers.
     */
    level?: 1 | 2
  }>(),
  { level: 2 },
)
</script>

<template>
  <RevealOnScroll as="header" class="max-w-2xl" :class="level === 1 ? 'mb-12' : 'mb-10'">
    <p class="mb-3 flex items-center gap-3 font-mono text-xs tracking-widest text-accent uppercase">
      <span aria-hidden="true">{{ index }}</span>
      <span aria-hidden="true" class="h-px w-8 bg-line-strong"></span>
    </p>
    <h1
      v-if="level === 1"
      :id="id"
      tabindex="-1"
      data-page-heading
      class="text-3xl font-semibold tracking-tight text-fg focus:outline-none sm:text-4xl lg:text-5xl"
    >
      {{ title }}
    </h1>
    <h2 v-else :id="id" class="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{{ title }}</h2>
    <p v-if="$slots.default" class="mt-3 text-base leading-relaxed text-muted" :class="level === 1 ? 'sm:text-lg' : ''">
      <slot />
    </p>
  </RevealOnScroll>
</template>
