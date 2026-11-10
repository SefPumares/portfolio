<script setup lang="ts">
import { ArrowRight, MapPin } from 'lucide-vue-next'
import { motion, useReducedMotion } from 'motion-v'
import MagneticHover from '@/components/motion/MagneticHover.vue'
import HeroScene from '@/components/three/HeroScene.vue'
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
</script>

<template>
  <section aria-labelledby="hero-title" class="relative isolate overflow-hidden border-b border-line">
    <HeroScene />

    <div
      class="mx-auto flex min-h-[min(88dvh,52rem)] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <motion.p v-bind="enter(0)" class="flex items-center gap-2 text-sm text-muted">
        <MapPin class="size-4 text-subtle" aria-hidden="true" />
        {{ site.location }}
      </motion.p>

      <h1
        id="hero-title"
        tabindex="-1"
        data-page-heading
        class="mt-6 text-5xl font-semibold tracking-tight text-fg focus:outline-none sm:text-6xl lg:text-7xl"
        :aria-label="site.name"
      >
        <span class="sr-only">{{ site.name }}</span>
        <span aria-hidden="true" class="flex flex-wrap gap-x-[0.25em]">
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
      <motion.p v-if="site.subtagline" v-bind="enter(5)" class="mt-3 max-w-2xl text-base leading-relaxed text-muted">
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
  </section>
</template>
