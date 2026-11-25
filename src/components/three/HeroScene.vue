<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Interactive WebGL background for the hero: a field of glowing points that moves in slow
 * waves and ripples around the pointer. It is purely decorative (aria-hidden).
 *
 * Progressive enhancement:
 * - The scene module (and three.js) is loaded lazily in its own chunk, after the page has painted.
 * - Skipped entirely with reduced motion, Save-Data, or without WebGL; the CSS glow
 *   behind the canvas is the fallback.
 * - Rendering pauses when the hero is off-screen or the tab is hidden, and every GPU
 *   resource is disposed when the component unmounts (see hero-scene.ts).
 */

const host = ref<HTMLDivElement | null>(null)
const ready = ref(false)
let cleanup: (() => void) | null = null
let cancelled = false

function shouldRender(): boolean {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return false
  try {
    const probe = document.createElement('canvas')
    return !!(probe.getContext('webgl2') || probe.getContext('webgl'))
  } catch {
    return false
  }
}

async function start(container: HTMLDivElement) {
  const { createHeroScene } = await import('./hero-scene')
  if (cancelled) return
  // The portrait lives in the same hero section (HeroPortrait.vue).
  const figure = container.closest('section')?.querySelector<HTMLElement>('[data-hero-figure]') ?? null
  cleanup = createHeroScene(
    container,
    () => {
      ready.value = true
    },
    figure,
  )
}

onMounted(() => {
  const container = host.value
  if (!container || !shouldRender()) return
  // Defer the 3D work until the browser is idle so text and buttons render first.
  const begin = () => {
    if (!cancelled) start(container).catch(() => undefined) // The fallback glow stays on failure.
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(begin, { timeout: 1200 })
  else setTimeout(begin, 200)
})

onBeforeUnmount(() => {
  cancelled = true
  cleanup?.()
  cleanup = null
})
</script>

<template>
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <!-- Fallback / underlay glow: always present, visible on its own when WebGL is skipped. -->
    <div class="hero-glow absolute inset-0"></div>
    <div
      ref="host"
      data-hero-scene
      :data-ready="ready ? 'true' : 'false'"
      class="absolute inset-0 transition-opacity duration-1000"
      :class="ready ? 'opacity-100' : 'opacity-0'"
    ></div>
    <!-- Keeps the text readable over the brightest part of the field. -->
    <div class="absolute inset-0 bg-linear-to-r from-bg/85 via-bg/45 to-transparent lg:from-bg lg:via-bg/30"></div>
    <div class="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-bg to-transparent"></div>
  </div>
</template>
