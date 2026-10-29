<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import ContactIcon from '@/components/ui/ContactIcon.vue'
import ResumeButton from '@/components/ui/ResumeButton.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { site } from '@/data/site'
import { contactLinks, displayUrl } from '@/lib/links'
import { vReveal } from '@/directives/reveal'

// Only destinations that are actually configured — missing ones are simply not shown.
const links = contactLinks(site)
const hasEmail = links.some((link) => link.id === 'email')
</script>

<template>
  <section id="contact" aria-labelledby="contact-title" class="border-t border-line bg-surface/40 py-20 sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="contact-title" index="06" title="Get in touch">
        {{
          hasEmail
            ? 'The best way to reach me is by email. You can also find me on the profiles below.'
            : 'You can reach me through the profiles below.'
        }}
      </SectionHeading>

      <ul v-if="links.length" v-reveal class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="link in links" :key="link.id" class="min-w-0">
          <a
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            class="group flex h-full items-center gap-4 rounded-card border border-line bg-surface p-5 transition-colors hover:border-accent/50"
          >
            <span class="grid size-11 shrink-0 place-items-center rounded-md border border-line-strong bg-surface-2 text-accent">
              <ContactIcon :link-id="link.id" class="size-5" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-fg">{{ link.label }}</span>
              <span class="block truncate text-sm text-muted">{{ displayUrl(link.href) }}</span>
            </span>
            <ArrowUpRight
              class="size-4 shrink-0 text-subtle transition-colors group-hover:text-accent"
              aria-hidden="true"
            />
            <span v-if="link.external" class="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      </ul>

      <div class="mt-8 empty:hidden">
        <ResumeButton variant="secondary" />
      </div>
    </div>
  </section>
</template>
