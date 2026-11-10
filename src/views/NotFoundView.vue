<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import ButtonLink from '@/components/ui/ButtonLink.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
</script>

<template>
  <section aria-labelledby="not-found-title" class="flex min-h-[60dvh] items-center py-20 sm:py-24">
    <div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="not-found-title" index="404" title="Page not found" :level="1">
        The page you’re looking for doesn’t exist or may have moved.
      </SectionHeading>
      <div class="flex flex-col gap-3 sm:flex-row">
        <ButtonLink :to="{ name: 'home' }" variant="primary">
          <ArrowLeft class="size-4" aria-hidden="true" />
          Back to home
        </ButtonLink>
        <ButtonLink :to="{ name: 'projects' }" variant="secondary">View projects</ButtonLink>
      </div>
    </div>
  </section>
</template>
