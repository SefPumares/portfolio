<script setup lang="ts">
import ProjectCard from '@/components/projects/ProjectCard.vue'
import RevealOnScroll from '@/components/motion/RevealOnScroll.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { projects, publishedProjects } from '@/data/projects'

withDefaults(defineProps<{ pageHeading?: boolean; index?: string }>(), { pageHeading: false, index: '01' })

const visibleProjects = publishedProjects(projects)
</script>

<template>
  <section aria-labelledby="projects-title" class="py-20 sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="projects-title" :index="index" title="Projects" :level="pageHeading ? 1 : 2">
        Work from my role at Xepto Computing Inc. and my academic capstone. Descriptions are kept to what can be
        shared publicly.
      </SectionHeading>

      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <RevealOnScroll
          v-for="(project, i) in visibleProjects"
          :key="project.id"
          :delay="Math.min(i, 4) * 0.07"
          class="flex"
          :class="project.featured ? 'md:col-span-2' : ''"
        >
          <ProjectCard :project="project" :heading-level="pageHeading ? 2 : 3" class="w-full" />
        </RevealOnScroll>
      </div>
    </div>
  </section>
</template>
