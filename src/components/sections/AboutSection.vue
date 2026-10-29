<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { site } from '@/data/site'
import { education } from '@/data/education'
import { vReveal } from '@/directives/reveal'

const degree = education[0]

const facts = [
  { label: 'Role', value: `${site.title}, Xepto Computing Inc.` },
  { label: 'Path', value: 'QA intern → software development' },
  { label: 'Focus', value: 'Web applications, testing, data & reporting, EdTech' },
  ...(degree ? [{ label: 'Education', value: `BS Information Technology, PUP Biñan · ${degree.year}` }] : []),
  { label: 'Based in', value: site.location },
]
</script>

<template>
  <section id="about" aria-labelledby="about-title" class="py-20 sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="about-title" index="01" title="About me" />

      <div v-reveal class="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div class="max-w-prose space-y-5 text-base leading-relaxed text-muted sm:text-[1.0625rem]">
          <p v-for="(paragraph, index) in site.about" :key="index" :class="index === 0 ? 'text-fg/90' : ''">
            {{ paragraph }}
          </p>
        </div>

        <dl class="h-fit divide-y divide-line rounded-card border border-line bg-surface">
          <div v-for="fact in facts" :key="fact.label" class="px-5 py-4">
            <dt class="text-xs font-medium tracking-wide text-subtle uppercase">{{ fact.label }}</dt>
            <dd class="mt-1 text-sm text-fg">{{ fact.value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
