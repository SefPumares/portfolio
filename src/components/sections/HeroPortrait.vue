<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion-v'
import { site } from '@/data/site'
import { canAnimateInView } from '@/lib/motion-support'
import portrait320 from '@/assets/portrait/yosef-320.webp'
import portrait500 from '@/assets/portrait/yosef-500.webp'

/**
 * The hero portrait (background removed). Interactive layers:
 * - mouse: the figure tilts in 3D toward the pointer and a cyan glow behind it follows on a softer spring
 * - touch / no fine pointer: a slow float
 * - reduced motion: shown still
 * `data-hero-figure` lets the 3D particle field (HeroScene) ripple around the figure.
 */

const reduced = useReducedMotion()
const root = ref<HTMLElement | null>(null)
const finePointer = ref(false)

// Pointer position over the hero, normalised to -1..1 (0 = centre / at rest).
const px = useMotionValue(0)
const py = useMotionValue(0)
const tilt = { stiffness: 140, damping: 18, mass: 0.6 }
const drift = { stiffness: 50, damping: 20, mass: 1 }
const rotateY = useSpring(useTransform(px, [-1, 1], [-8, 8]), tilt)
const rotateX = useSpring(useTransform(py, [-1, 1], [6, -6]), tilt)
const x = useSpring(useTransform(px, [-1, 1], [-10, 10]), tilt)
const y = useSpring(useTransform(py, [-1, 1], [-6, 6]), tilt)
const glowX = useSpring(useTransform(px, [-1, 1], [-40, 40]), drift)
const glowY = useSpring(useTransform(py, [-1, 1], [-28, 28]), drift)

let visible = true
let observer: IntersectionObserver | null = null

function onPointerMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || !visible || reduced.value) return
  const hero = root.value?.closest('section')
  if (!hero) return
  const r = hero.getBoundingClientRect()
  if (event.clientY < r.top || event.clientY > r.bottom) return reset()
  px.set(Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1)))
  py.set(Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1)))
}
function reset() {
  px.set(0)
  py.set(0)
}

onMounted(() => {
  finePointer.value = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false
  if (finePointer.value) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
  }
  if (canAnimateInView() && root.value) {
    observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      if (!visible) reset()
    })
    observer.observe(root.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  document.documentElement.removeEventListener('pointerleave', reset)
  observer?.disconnect()
})

/** Same rise-out-of-blur entrance as the hero text. */
const entrance = computed(() => ({
  initial: reduced.value ? false : { opacity: 0, y: 36, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}))

/** Touch devices get a slow float instead of the tilt. */
const float = computed(() =>
  reduced.value || finePointer.value
    ? {}
    : {
        animate: { y: [0, -6, 0] },
        transition: { duration: 6, ease: 'easeInOut' as const, repeat: Infinity },
      },
)

const tiltStyle = computed(() =>
  reduced.value ? {} : { rotateX, rotateY, x, y, transformPerspective: 1000 },
)
const glowStyle = computed(() => (reduced.value ? {} : { x: glowX, y: glowY }))
</script>

<template>
  <motion.div
    data-hero-figure
    class="relative mr-auto w-44 max-lg:h-60 sm:w-52 lg:mx-auto lg:w-full lg:max-w-[24rem]"
    v-bind="entrance"
  >
    <motion.div aria-hidden="true" class="portrait-glow pointer-events-none absolute" :style="glowStyle" />
    <!-- The ref goes on a plain element: on motion.div it would be the component, not a DOM node. -->
    <div ref="root" class="portrait-frame max-lg:h-full max-lg:overflow-hidden">
      <motion.div :style="tiltStyle">
        <motion.div v-bind="float">
          <img
            :src="portrait500"
            :srcset="`${portrait320} 320w, ${portrait500} 500w`"
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 13rem, 11rem"
            width="500"
            height="822"
            :alt="site.name"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            draggable="false"
            class="portrait-cutout block h-auto w-full select-none"
          />
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
</template>
