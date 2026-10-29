import type { Achievement, Education } from '@/types/content'

export const education: Education[] = [
  {
    institution: 'Polytechnic University of the Philippines, Biñan Campus',
    degree: 'Bachelor of Science in Information Technology',
    year: '2024',
    notes: ['Capstone: “MS 17 Reclaimed Valor: A Virtual Reality Experience of the Marawi Siege”'],
  },
]

/** Keep academic and professional recognition clearly labelled via `kind`. */
export const achievements: Achievement[] = [
  {
    title: 'Best in Capstone',
    detail: 'MS 17 Reclaimed Valor — PUP Biñan Campus',
    date: '2024',
    kind: 'academic',
  },
  {
    title: 'Team recognition — Xepto Grader Tool',
    detail: 'Member of the development team recognized for the offline examination-checking tool',
    date: 'Dec 2024',
    kind: 'professional',
  },
]
