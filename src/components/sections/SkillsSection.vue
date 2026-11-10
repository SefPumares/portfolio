<script setup lang="ts">
import { Database, Monitor, Server, ShieldCheck, Wrench } from 'lucide-vue-next'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import TagChip from '@/components/ui/TagChip.vue'
import { skillGroups } from '@/data/skills'
import type { SkillGroup } from '@/types/content'
import RevealOnScroll from '@/components/motion/RevealOnScroll.vue'

withDefaults(defineProps<{ index?: string }>(), { index: '02' })

const icons: Record<SkillGroup['icon'], typeof Monitor> = {
  frontend: Monitor,
  backend: Server,
  data: Database,
  qa: ShieldCheck,
  tools: Wrench,
}
</script>

<template>
  <section id="skills" aria-labelledby="skills-title" class="border-t border-line bg-surface/40 py-20 sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="skills-title" :index="index" title="Technical skills">
        Technologies and practices I have used in my work and studies, grouped by area. They are not ranked.
      </SectionHeading>

      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RevealOnScroll
          v-for="(group, i) in skillGroups"
          :key="group.id"
          as="li"
          :delay="i * 0.06"
          class="rounded-card border border-line bg-surface p-5 transition-colors duration-300 hover:border-line-strong"
        >
          <h3 class="flex items-center gap-2.5 text-sm font-semibold text-fg">
            <span class="grid size-8 place-items-center rounded-md border border-line-strong bg-surface-2">
              <component :is="icons[group.icon]" class="size-4 text-accent" aria-hidden="true" />
            </span>
            {{ group.title }}
          </h3>
          <ul class="mt-4 flex flex-wrap gap-2" :aria-label="`${group.title} skills`">
            <li v-for="item in group.items" :key="item">
              <TagChip>{{ item }}</TagChip>
            </li>
          </ul>
        </RevealOnScroll>
      </ul>
    </div>
  </section>
</template>
