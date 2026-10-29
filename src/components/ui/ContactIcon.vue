<script setup lang="ts">
import { computed } from 'vue'
import { Github, Linkedin, Link, Mail } from 'lucide-vue-next'

const props = defineProps<{ linkId: string }>()

const icon = computed(() => {
  if (props.linkId === 'email') return Mail
  if (props.linkId === 'github') return Github
  if (props.linkId === 'linkedin') return Linkedin
  return Link
})
</script>

<template>
  <component :is="icon" aria-hidden="true" />
</template>
