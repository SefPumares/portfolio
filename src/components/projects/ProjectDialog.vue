<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ArrowUpRight, Award, X } from 'lucide-vue-next'
import TagChip from '@/components/ui/TagChip.vue'
import { isUsableUrl } from '@/lib/links'
import type { Project } from '@/types/content'

/**
 * Project details in a native modal <dialog>. showModal() provides the focus trap,
 * Escape-to-close and inert background; we restore focus to the triggering button on close.
 */
const props = defineProps<{ project: Project | null; trigger: HTMLElement | null }>()
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

const links = computed(() => (props.project?.links ?? []).filter((link) => isUsableUrl(link.href)))

watch(
  () => props.project,
  async (project) => {
    const el = dialog.value
    if (!el) return
    if (project && !el.open) {
      await nextTick()
      el.showModal()
      closeButton.value?.focus()
    } else if (!project && el.open) {
      el.close()
    }
  },
)

function onClose() {
  emit('close')
  props.trigger?.focus()
}

/** Clicking the backdrop (the dialog element itself, outside the panel) closes it. */
function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) dialog.value?.close()
}
</script>

<template>
  <dialog
    ref="dialog"
    aria-labelledby="project-dialog-title"
    class="m-auto max-h-[min(90dvh,48rem)] w-[min(100%-2rem,44rem)] overflow-hidden rounded-card border border-line-strong bg-surface p-0 text-fg shadow-2xl shadow-black/60 backdrop:bg-black/70 backdrop:backdrop-blur-[2px]"
    @close="onClose"
    @click="onDialogClick"
  >
    <div v-if="project" class="flex max-h-[min(90dvh,48rem)] flex-col">
      <header class="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <div>
          <p class="text-xs font-medium text-accent">{{ project.category }}</p>
          <h2 id="project-dialog-title" class="mt-1.5 text-xl font-semibold tracking-tight">
            {{ project.title }}
          </h2>
          <p v-if="project.recognition" class="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <Award class="size-4 text-accent" aria-hidden="true" />
            {{ project.recognition }}
          </p>
        </div>
        <button
          ref="closeButton"
          type="button"
          class="-mr-2 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-2 text-sm text-muted transition-colors hover:text-fg"
          aria-label="Close project details"
          @click="dialog?.close()"
        >
          <X class="size-5" aria-hidden="true" />
          <span aria-hidden="true">Close</span>
        </button>
      </header>

      <div class="space-y-7 overflow-y-auto px-5 py-6 text-sm leading-relaxed sm:px-6">
        <p class="text-base text-fg/90">{{ project.summary }}</p>

        <section v-if="project.problem">
          <h3 class="detail-heading">Problem</h3>
          <p class="mt-2 text-muted">{{ project.problem }}</p>
        </section>

        <section v-if="project.solution">
          <h3 class="detail-heading">{{ project.problem ? 'Approach' : 'What it is' }}</h3>
          <p class="mt-2 text-muted">{{ project.solution }}</p>
        </section>

        <section v-if="project.contribution?.length">
          <h3 class="detail-heading">My contribution</h3>
          <ul class="mt-2 list-disc space-y-1.5 pl-5 text-muted marker:text-accent">
            <li v-for="item in project.contribution" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section v-if="project.highlights?.length">
          <h3 class="detail-heading">Outcomes &amp; findings</h3>
          <dl class="mt-3 grid gap-3">
            <div
              v-for="item in project.highlights"
              :key="item.label"
              class="rounded-md border border-line bg-surface-2 p-4"
            >
              <dt class="font-medium text-fg">{{ item.label }}</dt>
              <dd class="mt-1 text-muted">{{ item.detail }}</dd>
            </div>
          </dl>
        </section>

        <section v-if="project.technologies?.length">
          <h3 class="detail-heading">Technologies</h3>
          <ul class="mt-3 flex flex-wrap gap-2">
            <li v-for="tech in project.technologies" :key="tech">
              <TagChip>{{ tech }}</TagChip>
            </li>
          </ul>
        </section>

        <section v-if="links.length">
          <h3 class="detail-heading">Links</h3>
          <ul class="mt-3 flex flex-wrap gap-3">
            <li v-for="link in links" :key="link.href">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 font-medium text-accent hover:text-accent-strong"
              >
                {{ link.label }}
                <ArrowUpRight class="size-4" aria-hidden="true" />
                <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
@reference '../../styles/main.css';

.detail-heading {
  @apply text-xs font-semibold tracking-wider text-subtle uppercase;
}
</style>
