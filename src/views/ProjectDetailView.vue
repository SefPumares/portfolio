<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, ArrowUpRight, Award } from 'lucide-vue-next'
import { animate, useReducedMotion } from 'motion-v'
import RevealOnScroll from '@/components/motion/RevealOnScroll.vue'
import ProjectCover from '@/components/projects/ProjectCover.vue'
import TagChip from '@/components/ui/TagChip.vue'
import { findPublishedProject, projects, publishedProjects } from '@/data/projects'
import { isUsableUrl } from '@/lib/links'
import { takeCoverOrigin } from '@/lib/page-transition'

const route = useRoute()
// The route guard guarantees the id is a published project; the view is re-created per id
// because App.vue keys the page on the route path.
const project = computed(() => findPublishedProject(String(route.params.id))!)

const links = computed(() => (project.value.links ?? []).filter((link) => isUsableUrl(link.href)))

const ordered = publishedProjects(projects)
const position = computed(() => ordered.findIndex((p) => p.id === project.value.id))
const previous = computed(() => ordered[position.value - 1])
const next = computed(() => ordered[position.value + 1])

// Shared-element fly-in: animate the cover from where the card's cover was (FLIP).
const coverEl = ref<{ $el: HTMLElement } | null>(null)
const reduced = useReducedMotion()
onMounted(() => {
  const origin = takeCoverOrigin(project.value.id)
  const el = coverEl.value?.$el
  if (!origin || !el || reduced.value) return
  const target = el.getBoundingClientRect()
  if (!target.width || !target.height) return
  animate(
    el,
    {
      x: [origin.x - target.left, 0],
      y: [origin.y - target.top, 0],
      scaleX: [origin.width / target.width, 1],
      scaleY: [origin.height / target.height, 1],
      borderRadius: ['8px', '12px'],
    },
    { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  )
})
</script>

<template>
  <article aria-labelledby="project-title" class="pb-20 sm:pb-24">
    <div class="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <RevealOnScroll :y="8">
        <RouterLink
          :to="{ name: 'projects' }"
          class="group inline-flex min-h-11 items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft class="size-4 transition-transform motion-safe:group-hover:-translate-x-1" aria-hidden="true" />
          All projects
        </RouterLink>
      </RevealOnScroll>

      <header class="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-end">
        <div>
          <RevealOnScroll as="p" :delay="0.05" class="text-sm font-medium text-accent">{{ project.category }}</RevealOnScroll>
          <h1
            id="project-title"
            tabindex="-1"
            data-page-heading
            class="mt-3 text-3xl font-semibold tracking-tight text-fg focus:outline-none sm:text-4xl lg:text-5xl"
          >
            {{ project.title }}
          </h1>
          <RevealOnScroll v-if="project.recognition" as="p" :delay="0.1" class="mt-4 flex items-center gap-2 text-sm text-muted">
            <Award class="size-4 text-accent" aria-hidden="true" />
            {{ project.recognition }}
          </RevealOnScroll>
          <RevealOnScroll as="p" :delay="0.12" class="mt-6 max-w-2xl text-lg leading-relaxed text-fg/90">
            {{ project.summary }}
          </RevealOnScroll>
        </div>
        <ProjectCover
          ref="coverEl"
          :project="project"
          class="h-48 origin-top-left overflow-hidden rounded-xl border border-line sm:h-56 lg:h-64"
        />
      </header>

      <div class="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <div class="space-y-12 text-base leading-relaxed">
          <RevealOnScroll v-if="project.problem" as="section">
            <h2 class="detail-heading">Problem</h2>
            <p class="mt-3 text-muted">{{ project.problem }}</p>
          </RevealOnScroll>

          <RevealOnScroll v-if="project.solution" as="section">
            <h2 class="detail-heading">{{ project.problem ? 'Approach' : 'What it is' }}</h2>
            <p class="mt-3 text-muted">{{ project.solution }}</p>
          </RevealOnScroll>

          <RevealOnScroll v-if="project.contribution?.length" as="section">
            <h2 class="detail-heading">My contribution</h2>
            <ul class="mt-3 list-disc space-y-2 pl-5 text-muted marker:text-accent">
              <li v-for="item in project.contribution" :key="item">{{ item }}</li>
            </ul>
          </RevealOnScroll>

          <RevealOnScroll v-if="project.highlights?.length" as="section">
            <h2 class="detail-heading">Outcomes &amp; findings</h2>
            <dl class="mt-4 grid gap-4">
              <div
                v-for="item in project.highlights"
                :key="item.label"
                class="rounded-card border border-line bg-surface p-5"
              >
                <dt class="font-medium text-fg">{{ item.label }}</dt>
                <dd class="mt-1.5 text-sm text-muted">{{ item.detail }}</dd>
              </div>
            </dl>
          </RevealOnScroll>
        </div>

        <aside class="space-y-8 lg:sticky lg:top-24 lg:h-fit" aria-label="Project facts">
          <RevealOnScroll :delay="0.1" class="rounded-card border border-line bg-surface p-5">
            <h2 class="detail-heading">Context</h2>
            <p class="mt-2 text-sm text-fg">
              {{ project.context === 'academic' ? 'Academic project' : 'Professional work' }}
            </p>
          </RevealOnScroll>

          <RevealOnScroll v-if="project.technologies?.length" :delay="0.15" class="rounded-card border border-line bg-surface p-5">
            <h2 class="detail-heading">Technologies</h2>
            <ul class="mt-3 flex flex-wrap gap-2">
              <li v-for="tech in project.technologies" :key="tech">
                <TagChip>{{ tech }}</TagChip>
              </li>
            </ul>
          </RevealOnScroll>

          <RevealOnScroll v-if="links.length" :delay="0.2" class="rounded-card border border-line bg-surface p-5">
            <h2 class="detail-heading">Links</h2>
            <ul class="mt-3 flex flex-col gap-2">
              <li v-for="link in links" :key="link.href">
                <a
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex min-h-11 items-center gap-1 font-medium text-accent hover:text-accent-strong"
                >
                  {{ link.label }}
                  <ArrowUpRight class="size-4" aria-hidden="true" />
                  <span class="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </RevealOnScroll>
        </aside>
      </div>

      <nav aria-label="More projects" class="mt-20 grid grid-cols-1 gap-4 border-t border-line pt-10 sm:grid-cols-2">
        <RouterLink
          v-if="previous"
          :to="{ name: 'project', params: { id: previous.id } }"
          class="group rounded-card border border-line bg-surface p-5 transition-colors hover:border-accent/50"
        >
          <span class="flex items-center gap-1.5 text-xs text-subtle">
            <ArrowLeft class="size-3.5 transition-transform motion-safe:group-hover:-translate-x-1" aria-hidden="true" />
            Previous project
          </span>
          <span class="mt-2 block font-semibold text-fg">{{ previous.title }}</span>
        </RouterLink>
        <span v-else class="hidden sm:block"></span>
        <RouterLink
          v-if="next"
          :to="{ name: 'project', params: { id: next.id } }"
          class="group rounded-card border border-line bg-surface p-5 text-right transition-colors hover:border-accent/50"
        >
          <span class="flex items-center justify-end gap-1.5 text-xs text-subtle">
            Next project
            <ArrowRight class="size-3.5 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
          </span>
          <span class="mt-2 block font-semibold text-fg">{{ next.title }}</span>
        </RouterLink>
      </nav>
    </div>
  </article>
</template>

<style scoped>
@reference '../styles/main.css';

.detail-heading {
  @apply text-xs font-semibold tracking-wider text-subtle uppercase;
}
</style>
