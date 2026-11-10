<script setup lang="ts">
import { motion, useReducedMotion } from 'motion-v'

/**
 * Fades and lifts its content in the first time it scrolls into view.
 *
 * With reduced motion the content renders in its final state immediately (initial=false),
 * so nothing is ever left invisible waiting for an animation.
 */
withDefaults(
  defineProps<{
    /** Element to render, e.g. 'div', 'li', 'section'. */
    as?: string
    /** Delay in seconds, used to stagger siblings. */
    delay?: number
    /** Starting vertical offset in px. */
    y?: number
  }>(),
  { as: 'div', delay: 0, y: 24 },
)

const reduced = useReducedMotion()
</script>

<template>
  <motion.div
    :as="as"
    :initial="reduced ? false : { opacity: 0, y, filter: 'blur(6px)' }"
    :while-in-view="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
    :in-view-options="{ once: true, margin: '0px 0px -8% 0px' }"
    :transition="{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }"
  >
    <slot />
  </motion.div>
</template>
