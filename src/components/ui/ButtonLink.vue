<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

/**
 * A link styled as a button.
 * Pass `to` for in-site pages (client-side navigation) or `href` for files, mailto and external URLs.
 */
const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    href?: string
    variant?: 'primary' | 'secondary' | 'ghost'
    /** Opens in a new tab with safe rel attributes. */
    external?: boolean
    /** Value for the download attribute (suggested file name). */
    download?: string
  }>(),
  { to: undefined, href: undefined, variant: 'secondary', external: false, download: undefined },
)

const variants = {
  primary:
    'bg-accent text-bg border-accent hover:bg-accent-strong hover:border-accent-strong shadow-[0_0_0_0_rgb(92_200_255/0)] hover:shadow-[0_0_32px_-4px_rgb(92_200_255/0.55)]',
  secondary:
    'bg-surface/80 text-fg border-line-strong backdrop-blur-sm hover:border-accent/60 hover:text-accent-strong',
  ghost: 'bg-transparent text-muted border-transparent hover:text-fg',
} as const

const classes = computed(() => [
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold',
  'transition-[color,background-color,border-color,box-shadow] duration-200',
  variants[props.variant],
])
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <slot />
  </RouterLink>
  <a
    v-else
    :href="href"
    :class="classes"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :download="download"
  >
    <slot />
  </a>
</template>
