<script setup lang="ts">
import AboutSection from '@/components/sections/AboutSection.vue'
import EducationSection from '@/components/sections/EducationSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
</script>

<template>
  <div>
    <AboutSection page-heading index="01" />
    <SkillsSection index="02" />
    <ExperienceSection index="03" />
    <EducationSection index="04" />
  </div>
</template>
