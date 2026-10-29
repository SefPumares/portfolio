<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Award } from 'lucide-vue-next'
import ProjectCover from '@/components/projects/ProjectCover.vue'
import TagChip from '@/components/ui/TagChip.vue'
import type { Project } from '@/types/content'

const props = defineProps<{ project: Project }>()

const emit = defineEmits<{ open: [project: Project, trigger: HTMLElement] }>()

const titleId = computed(() => `project-${props.project.id}-title`)
</script>

<template>
  <article
    :aria-labelledby="titleId"
    class="group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-[border-color,transform] duration-300 hover:border-line-strong focus-within:border-line-strong motion-safe:hover:-translate-y-0.5"
    :class="project.featured ? 'md:col-span-2 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]' : ''"
  >
    <ProjectCover :project="project" :class="project.featured ? 'md:h-full' : 'h-36'" />

    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <p class="text-xs font-medium text-accent">{{ project.category }}</p>
      <h3 :id="titleId" class="mt-2 text-lg font-semibold tracking-tight text-fg">
        {{ project.title }}
      </h3>
      <p v-if="project.recognition" class="mt-2 flex items-center gap-1.5 text-xs text-muted">
        <Award class="size-3.5 text-accent" aria-hidden="true" />
        {{ project.recognition }}
      </p>
      <p class="mt-3 text-sm leading-relaxed text-muted">{{ project.summary }}</p>

      <ul
        v-if="project.technologies?.length"
        class="mt-4 flex flex-wrap gap-2"
        :aria-label="`Technologies used in ${project.title}`"
      >
        <li v-for="tech in project.technologies" :key="tech">
          <TagChip>{{ tech }}</TagChip>
        </li>
      </ul>

      <div class="mt-auto pt-6">
        <button
          type="button"
          class="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-semibold text-fg transition-colors hover:text-accent-strong"
          aria-haspopup="dialog"
          @click="emit('open', project, $event.currentTarget as HTMLElement)"
        >
          View details
          <span class="sr-only">about {{ project.title }}</span>
          <ArrowUpRight
            class="size-4 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </article>
</template>
