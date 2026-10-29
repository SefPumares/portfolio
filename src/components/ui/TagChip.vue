<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'default' | 'accent' }>(), { tone: 'default' })
</script>

<template>
  <span
    class="inline-flex items-center rounded border px-2 py-1 text-xs leading-none font-medium"
    :class="
      tone === 'accent'
        ? 'border-accent/30 bg-accent-soft text-accent-strong'
        : 'border-line-strong bg-surface-2 text-muted'
    "
  >
    <slot />
  </span>
</template>
