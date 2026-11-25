import type { SkillGroup } from '@/types/content'

/** Technologies and practices, grouped by area. Intentionally unranked — no levels or percentages. */
export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    icon: 'frontend',
    items: ['JavaScript', 'TypeScript', 'Vue.js', 'Ionic', 'Capacitor', 'HTML5', 'CSS3'],
  },
  {
    id: 'backend',
    title: 'Backend',
    icon: 'backend',
    items: ['Node.js', 'Express.js', 'PHP', 'Python'],
  },
  {
    id: 'data',
    title: 'Databases & reporting',
    icon: 'data',
    items: ['MySQL', 'SQL reporting', 'Dashboard development', 'Metabase'],
  },
  {
    id: 'qa',
    title: 'Quality assurance',
    icon: 'qa',
    items: [
      'Manual testing',
      'Regression testing',
      'Test case preparation',
      'Bug reporting',
      'Cross-browser testing',
      'Cross-device testing',
    ],
  },
  {
    id: 'tools',
    title: 'Tools & environments',
    icon: 'tools',
    items: ['Git', 'GitHub', 'Linux', 'Server environments', 'Moodle / XLMS plugin development', 'Unity'],
  },
]
