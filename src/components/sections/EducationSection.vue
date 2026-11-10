<script setup lang="ts">
import { Award, GraduationCap } from 'lucide-vue-next'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import TagChip from '@/components/ui/TagChip.vue'
import { achievements, education } from '@/data/education'
import RevealOnScroll from '@/components/motion/RevealOnScroll.vue'

withDefaults(defineProps<{ index?: string }>(), { index: '04' })
</script>

<template>
  <section id="education" aria-labelledby="education-title" class="border-t border-line py-20 sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="education-title" :index="index" title="Education & recognition" />

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RevealOnScroll
          as="article"
          v-for="item in education"
          :key="item.institution"
          class="rounded-card border border-line bg-surface p-5 sm:p-6"
        >
          <div class="flex items-start gap-4">
            <span class="grid size-10 shrink-0 place-items-center rounded-md border border-line-strong bg-surface-2">
              <GraduationCap class="size-5 text-accent" aria-hidden="true" />
            </span>
            <div>
              <h3 class="font-semibold text-fg">{{ item.degree }}</h3>
              <p class="mt-1 text-sm text-muted">{{ item.institution }}</p>
              <p class="mt-1 font-mono text-xs text-subtle">Graduated {{ item.year }}</p>
              <ul v-if="item.notes.length" class="mt-4 space-y-1 text-sm text-muted">
                <li v-for="note in item.notes" :key="note">{{ note }}</li>
              </ul>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll :delay="0.1" class="rounded-card border border-line bg-surface p-5 sm:p-6">
          <h3 class="flex items-center gap-2 font-semibold text-fg">
            <Award class="size-5 text-accent" aria-hidden="true" />
            Recognition
          </h3>
          <ul class="mt-4 divide-y divide-line">
            <li v-for="item in achievements" :key="item.title" class="py-4 first:pt-0 last:pb-0">
              <div class="flex flex-wrap items-center gap-2">
                <p class="font-medium text-fg">{{ item.title }}</p>
                <TagChip :tone="item.kind === 'professional' ? 'accent' : 'default'">
                  {{ item.kind === 'professional' ? 'Professional' : 'Academic' }}
                </TagChip>
              </div>
              <p class="mt-1 text-sm text-muted">{{ item.detail }}</p>
              <p class="mt-1 font-mono text-xs text-subtle">{{ item.date }}</p>
            </li>
          </ul>
        </RevealOnScroll>
      </div>
    </div>
  </section>
</template>
