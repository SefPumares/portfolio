<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import ProjectDialog from '@/components/projects/ProjectDialog.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { projects, publishedProjects } from '@/data/projects'
import type { Project } from '@/types/content'
import { vReveal } from '@/directives/reveal'

const visibleProjects = publishedProjects(projects)

const selected = shallowRef<Project | null>(null)
const trigger = ref<HTMLElement | null>(null)

function openProject(project: Project, el: HTMLElement) {
  trigger.value = el
  selected.value = project
}
</script>

<template>
  <section id="projects" aria-labelledby="projects-title" class="border-t border-line py-20 sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="projects-title" index="03" title="Featured projects">
        Work from my role at Xepto Computing Inc. and my academic capstone. Descriptions are kept to what can be shared publicly.
      </SectionHeading>

      <div v-reveal class="grid gap-5 md:grid-cols-2">
        <ProjectCard
          v-for="project in visibleProjects"
          :key="project.id"
          :project="project"
          @open="openProject"
        />
      </div>
    </div>

    <ProjectDialog :project="selected" :trigger="trigger" @close="selected = null" />
  </section>
</template>
