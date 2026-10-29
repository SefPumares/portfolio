<script setup lang="ts">
import { Download } from 'lucide-vue-next'
import ButtonLink from '@/components/ui/ButtonLink.vue'
import { resumeAvailable, resumeHref } from '@/lib/resume'
import { site } from '@/data/site'

withDefaults(defineProps<{ variant?: 'primary' | 'secondary' | 'ghost' }>(), {
  variant: 'secondary',
})

const fileName = `${site.name.replace(/\s+/g, '-')}-Resume.pdf`
</script>

<template>
  <!-- Rendered only when public/resume.pdf exists at build time: never a broken link. -->
  <ButtonLink
    v-if="resumeAvailable"
    :href="resumeHref"
    :variant="variant"
    :download="fileName"
    :aria-label="`Download ${site.name}'s resume (PDF)`"
  >
    <Download class="size-4" aria-hidden="true" />
    Resume
  </ButtonLink>
</template>
