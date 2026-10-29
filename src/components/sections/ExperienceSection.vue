<script setup lang="ts">
import { Briefcase, Users } from 'lucide-vue-next'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import TagChip from '@/components/ui/TagChip.vue'
import { experience } from '@/data/experience'
import type { ExperienceEntry } from '@/types/content'
import { vReveal } from '@/directives/reveal'

const kindLabel: Record<ExperienceEntry['kind'], string> = {
  employment: 'Employment',
  leadership: 'Student leadership',
}
</script>

<template>
  <section id="experience" aria-labelledby="experience-title" class="border-t border-line bg-surface/40 py-20 sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="experience-title" index="04" title="Experience">
        Software development and quality assurance first, followed by the creative and leadership roles that came before.
      </SectionHeading>

      <ol class="relative space-y-6 border-l border-line-strong pl-6 sm:pl-8">
        <li v-for="entry in experience" :key="entry.id" v-reveal class="relative">
          <span
            aria-hidden="true"
            class="absolute top-6 -left-[calc(1.5rem+5px)] size-2.5 rounded-full ring-4 ring-bg sm:-left-[calc(2rem+5px)]"
            :class="entry.primary ? 'bg-accent' : 'bg-line-strong'"
          ></span>

          <article
            class="rounded-card border bg-surface"
            :class="entry.primary ? 'border-accent/30 p-5 sm:p-7' : 'border-line p-5 sm:p-6'"
          >
            <header class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 class="font-semibold tracking-tight text-fg" :class="entry.primary ? 'text-xl' : 'text-lg'">
                  {{ entry.organization }}
                </h3>
                <p v-if="entry.organizationDetail" class="mt-0.5 text-sm text-subtle">
                  {{ entry.organizationDetail }}
                </p>
              </div>
              <TagChip :tone="entry.kind === 'employment' ? 'accent' : 'default'" class="w-fit gap-1.5">
                <Briefcase v-if="entry.kind === 'employment'" class="size-3" aria-hidden="true" />
                <Users v-else class="size-3" aria-hidden="true" />
                {{ kindLabel[entry.kind] }}
              </TagChip>
            </header>

            <p v-if="entry.summary" class="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{{ entry.summary }}</p>

            <ol class="mt-6 space-y-6" :aria-label="`Roles at ${entry.organization}`">
              <li
                v-for="(role, index) in entry.roles"
                :key="role.title"
                class="grid gap-2 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6"
                :class="index > 0 ? 'border-t border-line pt-6' : ''"
              >
                <p class="font-mono text-xs leading-6 text-subtle">{{ role.period }}</p>
                <div>
                  <h4 class="font-medium text-fg">{{ role.title }}</h4>
                  <ul class="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted marker:text-line-strong">
                    <li v-for="point in role.points" :key="point">{{ point }}</li>
                  </ul>
                </div>
              </li>
            </ol>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>
