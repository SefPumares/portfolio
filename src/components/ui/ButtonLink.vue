<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    href: string
    variant?: 'primary' | 'secondary' | 'ghost'
    /** Opens in a new tab with safe rel attributes. */
    external?: boolean
    /** Value for the download attribute (suggested file name). */
    download?: string
  }>(),
  { variant: 'secondary', external: false, download: undefined },
)

const variants = {
  primary:
    'bg-accent text-bg border-accent hover:bg-accent-strong hover:border-accent-strong',
  secondary:
    'bg-surface text-fg border-line-strong hover:border-accent/60 hover:text-accent-strong',
  ghost: 'bg-transparent text-muted border-transparent hover:text-fg',
} as const

const classes = computed(() => [
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold',
  'transition-colors duration-200',
  variants[props.variant],
])
</script>

<template>
  <a
    :href="href"
    :class="classes"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :download="download"
  >
    <slot />
  </a>
</template>
