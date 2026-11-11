<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { RouterView } from 'vue-router'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion-v'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import { notifyPageExited } from '@/lib/page-transition'

const reduced = useReducedMotion()

/** Page transition: the outgoing page sinks and blurs out, the new one rises in. */
const page = computed(() =>
  reduced.value
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : {
        initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
        animate: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
        exit: {
          opacity: 0,
          y: -16,
          filter: 'blur(6px)',
          transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
        },
      },
)

/**
 * After the old page has left and the new page is in the DOM: release the router's pending
 * scroll (restoring a saved position needs the new page's full height to exist, otherwise the
 * browser clamps it), then move focus to the new page's main heading so screen-reader users
 * hear that the page changed.
 */
async function onExitComplete() {
  await nextTick()
  requestAnimationFrame(() => {
    notifyPageExited()
    const heading = document.querySelector<HTMLElement>('#main [data-page-heading]')
    heading?.focus({ preventScroll: true })
  })
}
</script>

<template>
  <MotionConfig reduced-motion="user">
    <div id="top" class="flex min-h-dvh flex-col">
      <a
        href="#main"
        class="sr-only z-50 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >Skip to content</a
      >
      <SiteHeader />
      <main id="main" tabindex="-1" class="flex-1 focus:outline-none">
        <RouterView v-slot="{ Component, route }">
          <AnimatePresence mode="wait" :initial="false" @exit-complete="onExitComplete">
            <motion.div
              :key="route.path"
              :initial="page.initial"
              :animate="page.animate"
              :exit="page.exit"
            >
              <component :is="Component" />
            </motion.div>
          </AnimatePresence>
        </RouterView>
      </main>
      <SiteFooter />
    </div>
  </MotionConfig>
</template>
