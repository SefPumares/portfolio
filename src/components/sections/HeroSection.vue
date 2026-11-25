<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowRight, ArrowUp, MapPin } from 'lucide-vue-next'
import { AnimatePresence, motion, useReducedMotion } from 'motion-v'
import MagneticHover from '@/components/motion/MagneticHover.vue'
import HeroScene from '@/components/three/HeroScene.vue'
import HeroPortrait from '@/components/sections/HeroPortrait.vue'
import ButtonLink from '@/components/ui/ButtonLink.vue'
import ResumeButton from '@/components/ui/ResumeButton.vue'
import { site } from '@/data/site'

const reduced = useReducedMotion()

const ease = [0.22, 1, 0.36, 1] as const
/** Staggered entrance: each line rises out of a soft blur. */
const enter = (index: number) => ({
  initial: reduced.value ? false : { opacity: 0, y: 28, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.8, delay: 0.08 + index * 0.09, ease },
})

const nameWords = site.name.split(' ')

/*
 * Portrait reveal. Mouse: hovering the name shows it; it hides shortly after the pointer leaves
 * both the name and the portrait (so it can be reached and hovered). Touch: tapping the name
 * toggles it; tapping anywhere else closes it. Escape always closes it.
 */
const HIDE_DELAY_MS = 450
const revealed = ref(false)
const hintSeen = ref(false)
const section = ref<HTMLElement | null>(null)
const nameEl = ref<HTMLElement | null>(null)
let hideTimer: number | undefined
let overPortrait = false

function show() {
  window.clearTimeout(hideTimer)
  revealed.value = true
  hintSeen.value = true
}
function hide() {
  window.clearTimeout(hideTimer)
  revealed.value = false
}
function scheduleHide() {
  window.clearTimeout(hideTimer)
  hideTimer = window.setTimeout(() => {
    if (!overPortrait) revealed.value = false
  }, HIDE_DELAY_MS)
}

/*
 * Hover only drives the reveal on wide layouts, where the portrait has its own column. Below lg
 * it opens above the name and pushes the name down, which would slide the name out from under
 * the pointer and flicker, so there a click/tap toggles it instead.
 */
const isWide = () => window.matchMedia?.('(min-width: 1024px)').matches ?? false
const hoverReveal = (event: PointerEvent) => event.pointerType === 'mouse' && isWide()

function onNameEnter(event: PointerEvent) {
  if (hoverReveal(event)) show()
}
function onNameLeave(event: PointerEvent) {
  if (hoverReveal(event)) scheduleHide()
}
function onNameClick(event: MouseEvent) {
  // With hover reveal, a click just keeps it open; otherwise (touch, pen, narrow layout) it toggles.
  if (hoverReveal(event as PointerEvent)) return show()
  if (revealed.value) hide()
  else show()
}
function onPortraitHover(hovered: boolean) {
  if (!isWide()) return
  overPortrait = hovered
  if (hovered) show()
  else scheduleHide()
}

// Hint wording for layouts where hovering does not reveal (see .name-hint).
const hintVerb = ref('Tap')

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && revealed.value) hide()
}
function onOutsidePointer(event: PointerEvent) {
  const target = event.target as Node | null
  const figure = section.value?.querySelector('[data-hero-figure]')
  if (target && (nameEl.value?.contains(target) || figure?.contains(target))) return
  hide()
}
// The outside-tap listener only exists while the portrait is open.
watch(revealed, (open) => {
  if (open) document.addEventListener('pointerdown', onOutsidePointer)
  else document.removeEventListener('pointerdown', onOutsidePointer)
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  if (window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) hintVerb.value = 'Click'
})
onBeforeUnmount(() => {
  window.clearTimeout(hideTimer)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('pointerdown', onOutsidePointer)
})
</script>

<template>
  <section
    ref="section"
    aria-labelledby="hero-title"
    class="relative isolate overflow-hidden border-b border-line"
  >
    <HeroScene />

    <div
      class="mx-auto grid min-h-[min(88dvh,52rem)] max-w-6xl items-center px-4 pt-10 pb-20 sm:px-6 sm:pt-14 sm:pb-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-10 lg:px-8 lg:py-28"
    >
      <div class="flex flex-col justify-center">
        <motion.p v-bind="enter(0)" class="flex items-center gap-2 text-sm text-muted">
          <MapPin class="size-4 text-subtle" aria-hidden="true" />
          {{ site.location }}
        </motion.p>

        <h1
          id="hero-title"
          tabindex="-1"
          data-page-heading
          class="mt-6 text-5xl font-semibold tracking-tight text-fg focus:outline-none sm:text-6xl lg:text-7xl"
        >
          <span class="sr-only">{{ site.name }}</span>
          <!-- Hover (mouse) or tap (touch) the name to reveal the portrait. -->
          <span
            ref="nameEl"
            aria-hidden="true"
            data-hero-name
            class="hero-name inline-flex flex-wrap gap-x-[0.25em]"
            :class="{ 'is-active': revealed }"
            @pointerenter="onNameEnter"
            @pointerleave="onNameLeave"
            @click="onNameClick"
          >
            <span v-for="(word, i) in nameWords" :key="word" class="inline-block overflow-hidden pb-[0.08em]">
              <motion.span
                class="inline-block"
                :initial="reduced ? false : { y: '110%' }"
                :animate="{ y: '0%' }"
                :transition="{ duration: 0.9, delay: 0.15 + i * 0.12, ease }"
                >{{ word }}</motion.span
              >
            </span>
          </span>
        </h1>

        <!-- Shown where hovering does not reveal (touch, or below lg; see .name-hint). -->
        <AnimatePresence>
          <motion.p
            v-if="!hintSeen"
            aria-hidden="true"
            data-name-hint
            class="name-hint mt-2 items-center gap-1.5 text-xs tracking-wide text-subtle"
            :initial="reduced ? false : { opacity: 0 }"
            :animate="{ opacity: 1, transition: { delay: 1.2, duration: 0.5 } }"
            :exit="{ opacity: 0, transition: { duration: 0.2 } }"
          >
            <ArrowUp class="size-3" aria-hidden="true" />
            {{ hintVerb }} my name
          </motion.p>
        </AnimatePresence>

        <motion.div v-bind="enter(3)" class="mt-5 flex items-center gap-4">
          <p class="text-lg font-medium text-accent sm:text-xl">{{ site.title }}</p>
          <span
            aria-hidden="true"
            class="hidden h-px w-24 origin-left bg-linear-to-r from-accent/70 to-transparent motion-safe:animate-draw-line sm:block"
          ></span>
        </motion.div>

        <motion.p
          v-bind="enter(4)"
          class="mt-8 max-w-2xl text-lg leading-relaxed text-fg/90 sm:text-xl sm:leading-relaxed"
        >
          {{ site.tagline }}
        </motion.p>
        <motion.p
          v-if="site.subtagline"
          v-bind="enter(5)"
          class="mt-3 max-w-2xl text-base leading-relaxed text-muted"
        >
          {{ site.subtagline }}
        </motion.p>

        <motion.div v-bind="enter(6)" class="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <MagneticHover class="w-full sm:w-auto">
            <ButtonLink :to="{ name: 'projects' }" variant="primary" class="w-full sm:w-auto">
              Explore My Projects
              <ArrowRight class="size-4" aria-hidden="true" />
            </ButtonLink>
          </MagneticHover>
          <MagneticHover class="w-full sm:w-auto">
            <ButtonLink :to="{ name: 'contact' }" variant="secondary" class="w-full sm:w-auto">Contact Me</ButtonLink>
          </MagneticHover>
          <ResumeButton variant="ghost" />
        </motion.div>
      </div>

      <!-- Above the text on small screens (order-first); the DOM keeps the text first for reading order. -->
      <HeroPortrait
        :revealed="revealed"
        class="max-lg:order-first lg:-mb-28 lg:self-end"
        @hover-change="onPortraitHover"
      />
    </div>
  </section>
</template>
