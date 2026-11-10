<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowUpRight, Award } from 'lucide-vue-next'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion-v'
import ProjectCover from '@/components/projects/ProjectCover.vue'
import TagChip from '@/components/ui/TagChip.vue'
import { rememberCoverOrigin } from '@/lib/page-transition'
import type { Project } from '@/types/content'

const props = withDefaults(defineProps<{ project: Project; headingLevel?: 2 | 3 }>(), { headingLevel: 3 })

const titleId = computed(() => `project-${props.project.id}-title`)
const cover = ref<{ $el: Element } | null>(null)

// Subtle 3D tilt toward the pointer (mouse only, motion allowed).
const reduced = useReducedMotion()
const finePointer = ref(false)
onMounted(() => {
  finePointer.value = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false
})
const px = useMotionValue(0)
const py = useMotionValue(0)
const springConfig = { stiffness: 180, damping: 20 }
const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), springConfig)
const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [4, -4]), springConfig)

function onMove(event: PointerEvent) {
  if (reduced.value || !finePointer.value || event.pointerType !== 'mouse') return
  const r = (event.currentTarget as HTMLElement).getBoundingClientRect()
  px.set((event.clientX - r.left) / r.width - 0.5)
  py.set((event.clientY - r.top) / r.height - 0.5)
}
function onLeave() {
  px.set(0)
  py.set(0)
}

/** Records where the cover is, so the case-study page can fly it into place. */
function onNavigate() {
  if (cover.value?.$el) rememberCoverOrigin(props.project.id, cover.value.$el)
}
</script>

<template>
  <motion.article
    :aria-labelledby="titleId"
    class="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-[border-color,box-shadow] duration-300 transform-3d hover:border-line-strong hover:shadow-[0_24px_60px_-30px_rgb(92_200_255/0.35)] focus-within:border-accent/50"
    :class="project.featured ? 'md:col-span-2 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]' : ''"
    :style="{ rotateX, rotateY, transformPerspective: 1000 }"
    :while-hover="reduced ? undefined : { y: -4 }"
    :transition="{ type: 'spring', stiffness: 260, damping: 22 }"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <ProjectCover ref="cover" :project="project" :class="project.featured ? 'md:h-full' : 'h-36'" />

    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <p class="text-xs font-medium text-accent">{{ project.category }}</p>
      <component
        :is="`h${headingLevel}`"
        :id="titleId"
        class="mt-2 text-lg font-semibold tracking-tight text-fg"
      >
        {{ project.title }}
      </component>
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
        <!-- The ::after overlay stretches this link over the whole card, so the card is one click target. -->
        <RouterLink
          :to="{ name: 'project', params: { id: project.id } }"
          class="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-semibold text-fg transition-colors after:absolute after:inset-0 after:content-[''] hover:text-accent-strong"
          @click="onNavigate"
        >
          View case study
          <span class="sr-only">: {{ project.title }}</span>
          <ArrowUpRight
            class="size-4 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </RouterLink>
      </div>
    </div>
  </motion.article>
</template>
