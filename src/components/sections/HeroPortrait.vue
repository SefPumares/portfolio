<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion-v'
import { canAnimateInView } from '@/lib/motion-support'
import portrait320 from '@/assets/portrait/yosef-320.webp'
import portrait500 from '@/assets/portrait/yosef-500.webp'

/**
 * The hero portrait (background removed). Hidden until the visitor hovers or taps the name
 * in the hero (state owned by HeroSection.vue). While revealed:
 * - mouse: the figure tilts toward the pointer and a cyan glow behind it drifts after it
 * - touch: a slow float
 * - reduced motion: a plain fade, no movement
 * The image is decorative (the name is already the page heading). `data-hero-figure` and
 * `data-revealed` let the 3D particle field (hero-scene.ts) ripple around it while it is shown.
 */

const props = defineProps<{ revealed: boolean }>()
const emit = defineEmits<{ 'hover-change': [hovered: boolean] }>()

const reduced = useReducedMotion()
const root = ref<HTMLElement | null>(null)
const finePointer = ref(false)
// lg+: the portrait has its own column; below it sits above the text. Read synchronously so the
// first render already uses the right variant.
const WIDE_QUERY = '(min-width: 1024px)'
const wide = ref(typeof window !== 'undefined' && (window.matchMedia?.(WIDE_QUERY).matches ?? false))

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
let wideQuery: MediaQueryList | null = null
const onWideChange = (event: MediaQueryListEvent) => (wide.value = event.matches)

function onPointerMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || !visible || !props.revealed || reduced.value) return
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
watch(
  () => props.revealed,
  (shown) => {
    if (!shown) reset()
  },
)

onMounted(() => {
  finePointer.value = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false
  wideQuery = window.matchMedia?.(WIDE_QUERY) ?? null
  wide.value = wideQuery?.matches ?? false
  wideQuery?.addEventListener('change', onWideChange)
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
  wideQuery?.removeEventListener('change', onWideChange)
  window.removeEventListener('pointermove', onPointerMove)
  document.documentElement.removeEventListener('pointerleave', reset)
  observer?.disconnect()
})

const easeIn = [0.22, 1, 0.36, 1] as const
const easeOut = [0.4, 0, 1, 1] as const

/**
 * Show/hide. Wide screens: rise out of the particle field in place (layout never shifts).
 * Small screens: the frame above the name opens to 15rem, pushing the text down.
 */
const reveal = computed(() => {
  const shown = props.revealed
  const transition = reduced.value
    ? { duration: 0.2 }
    : shown
      ? { duration: 0.6, ease: easeIn }
      : { duration: 0.4, ease: easeOut }
  if (wide.value) {
    // height/margin reset the small-screen values if the window is resized across the breakpoint.
    const frame = { height: 'auto', marginBottom: 0 }
    const animate = reduced.value
      ? { opacity: shown ? 1 : 0, ...frame }
      : shown
        ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', ...frame }
        : { opacity: 0, y: 60, scale: 0.96, filter: 'blur(12px)', ...frame }
    return { animate, transition }
  }
  const animate = reduced.value
    ? { opacity: shown ? 1 : 0, height: shown ? 240 : 0, marginBottom: shown ? 24 : 0 }
    : shown
      ? { opacity: 1, y: 0, height: 240, marginBottom: 24 }
      : { opacity: 0, y: -12, height: 0, marginBottom: 0 }
  return { animate, transition: reduced.value ? { ...transition, height: { duration: 0 } } : transition }
})

/** Touch devices get a slow float while the portrait is shown. */
const float = computed(() =>
  props.revealed && !reduced.value && !finePointer.value
    ? { animate: { y: [0, -6, 0] }, transition: { duration: 6, ease: 'easeInOut' as const, repeat: Infinity } }
    : { animate: { y: 0 } },
)

const tiltStyle = computed(() =>
  reduced.value ? {} : { rotateX, rotateY, x, y, transformPerspective: 1000 },
)
const glowStyle = computed(() => (reduced.value ? {} : { x: glowX, y: glowY }))

function onHover(event: PointerEvent, hovered: boolean) {
  if (event.pointerType === 'mouse') emit('hover-change', hovered)
}
</script>

<template>
  <motion.div
    data-hero-figure
    :data-revealed="revealed ? 'true' : 'false'"
    aria-hidden="true"
    class="relative mr-auto w-44 sm:w-52 lg:mx-auto lg:w-full lg:max-w-[24rem]"
    :class="revealed ? '' : 'pointer-events-none'"
    :initial="false"
    v-bind="reveal"
    @pointerenter="onHover($event, true)"
    @pointerleave="onHover($event, false)"
  >
    <motion.div class="portrait-glow pointer-events-none absolute" :style="glowStyle" />
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
            alt=""
            loading="eager"
            fetchpriority="low"
            decoding="async"
            draggable="false"
            class="portrait-cutout block h-auto w-full select-none"
          />
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
</template>
