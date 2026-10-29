<script setup lang="ts">
import { ArrowRight, MapPin } from 'lucide-vue-next'
import ButtonLink from '@/components/ui/ButtonLink.vue'
import ResumeButton from '@/components/ui/ResumeButton.vue'
import { site } from '@/data/site'
</script>

<template>
  <section aria-labelledby="hero-title" class="relative isolate overflow-hidden border-b border-line">
    <div aria-hidden="true" class="hero-grid absolute inset-0 -z-10"></div>

    <div class="mx-auto max-w-6xl px-4 pt-20 pb-20 sm:px-6 sm:pt-28 sm:pb-24 lg:px-8 lg:pt-32">
      <p class="flex items-center gap-2 text-sm text-muted">
        <MapPin class="size-4 text-subtle" aria-hidden="true" />
        {{ site.location }}
      </p>

      <h1 id="hero-title" class="mt-6 text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl">
        {{ site.name }}
      </h1>

      <div class="mt-4 flex items-center gap-4">
        <p class="text-lg font-medium text-accent sm:text-xl">{{ site.title }}</p>
        <span
          aria-hidden="true"
          class="hidden h-px w-24 origin-left bg-linear-to-r from-accent/70 to-transparent motion-safe:animate-draw-line sm:block"
        ></span>
      </div>

      <p class="mt-8 max-w-2xl text-lg leading-relaxed text-fg/90 sm:text-xl sm:leading-relaxed">
        {{ site.tagline }}
      </p>
      <p v-if="site.subtagline" class="mt-3 max-w-2xl text-base leading-relaxed text-muted">
        {{ site.subtagline }}
      </p>

      <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ButtonLink href="#projects" variant="primary">
          Explore My Projects
          <ArrowRight class="size-4" aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href="#contact" variant="secondary">Contact Me</ButtonLink>
        <ResumeButton variant="ghost" />
      </div>
    </div>
  </section>
</template>
