<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion-v'

/**
 * Pulls its content slightly toward the pointer while hovered, then springs back.
 * Only active for precise pointers (mouse/trackpad) and when motion is allowed.
 */
const props = withDefaults(defineProps<{ strength?: number }>(), { strength: 0.25 })

const reduced = useReducedMotion()
const finePointer = ref(false)
onMounted(() => {
  finePointer.value = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false
})

const rawX = useMotionValue(0)
const rawY = useMotionValue(0)
const x = useSpring(rawX, { stiffness: 220, damping: 16, mass: 0.4 })
const y = useSpring(rawY, { stiffness: 220, damping: 16, mass: 0.4 })

function onMove(event: PointerEvent) {
  if (reduced.value || !finePointer.value || event.pointerType !== 'mouse') return
  const el = event.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  rawX.set((event.clientX - (r.left + r.width / 2)) * props.strength)
  rawY.set((event.clientY - (r.top + r.height / 2)) * props.strength)
}

function reset() {
  rawX.set(0)
  rawY.set(0)
}
</script>

<template>
  <motion.div class="inline-flex" :style="{ x, y }" @pointermove="onMove" @pointerleave="reset">
    <slot />
  </motion.div>
</template>
