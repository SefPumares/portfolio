<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import MagneticHover from '@/components/motion/MagneticHover.vue'
import RevealOnScroll from '@/components/motion/RevealOnScroll.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ButtonLink from '@/components/ui/ButtonLink.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { projects, publishedProjects } from '@/data/projects'
import { skillGroups } from '@/data/skills'

const visible = publishedProjects(projects)
// Featured project first, then the next two: a short preview, the full list is on /projects.
const preview = [...visible.filter((p) => p.featured), ...visible.filter((p) => !p.featured)].slice(0, 3)
</script>

<template>
  <div>
    <HeroSection />

    <section aria-labelledby="home-work-title" class="py-20 sm:py-24">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading id="home-work-title" index="01" title="Selected work" class="mb-0!">
            A few things I have built, maintained and tested.
          </SectionHeading>
          <RevealOnScroll :delay="0.1" class="sm:mb-10">
            <RouterLink
              :to="{ name: 'projects' }"
              class="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-strong"
            >
              All projects
              <ArrowRight class="size-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
            </RouterLink>
          </RevealOnScroll>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-5 sm:mt-0 md:grid-cols-2">
          <RevealOnScroll
            v-for="(project, i) in preview"
            :key="project.id"
            :delay="i * 0.08"
            class="flex"
            :class="project.featured ? 'md:col-span-2' : ''"
          >
            <ProjectCard :project="project" class="w-full" />
          </RevealOnScroll>
        </div>
      </div>
    </section>

    <section aria-labelledby="home-skills-title" class="border-t border-line bg-surface/40 py-20 sm:py-24">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="home-skills-title" index="02" title="What I work with">
          From QA to development: I care about how software is built and how it behaves for the people using it.
        </SectionHeading>
        <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <RevealOnScroll
            v-for="(group, i) in skillGroups"
            :key="group.id"
            as="li"
            :delay="i * 0.06"
            class="rounded-card border border-line bg-surface p-5"
          >
            <p class="text-sm font-semibold text-fg">{{ group.title }}</p>
            <p class="mt-2 text-sm leading-relaxed text-muted">{{ group.items.slice(0, 4).join(' · ') }}</p>
          </RevealOnScroll>
        </ul>
        <RevealOnScroll :delay="0.2" class="mt-8">
          <RouterLink
            :to="{ name: 'about' }"
            class="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-strong"
          >
            More about me, my experience and education
            <ArrowRight class="size-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
          </RouterLink>
        </RevealOnScroll>
      </div>
    </section>

    <section aria-labelledby="home-cta-title" class="relative isolate overflow-hidden border-t border-line py-24 sm:py-32">
      <div aria-hidden="true" class="hero-glow absolute inset-0 -z-10 opacity-70"></div>
      <RevealOnScroll class="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <h2 id="home-cta-title" class="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Let’s build something reliable.
        </h2>
        <p class="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          I’m open to new opportunities. If my work fits what your team needs, I’d love to hear from you.
        </p>
        <MagneticHover class="mt-8">
          <ButtonLink :to="{ name: 'contact' }" variant="primary">
            Get in touch
            <ArrowRight class="size-4" aria-hidden="true" />
          </ButtonLink>
        </MagneticHover>
      </RevealOnScroll>
    </section>
  </div>
</template>
