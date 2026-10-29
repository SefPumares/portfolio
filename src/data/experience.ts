import type { ExperienceEntry } from '@/types/content'

/**
 * Experience timeline, in display order. Keep `kind` accurate so paid employment
 * and student leadership stay visually distinct.
 */
export const experience: ExperienceEntry[] = [
  {
    id: 'xepto',
    organization: 'Xepto Computing Inc.',
    organizationDetail: 'Xepto Digital Education',
    kind: 'employment',
    primary: true,
    summary:
      'Joined as a quality assurance intern and moved into development after receiving a job offer in October 2024.',
    roles: [
      {
        title: 'Junior Software Developer',
        period: 'Oct 2024 – Present',
        points: [
          'Maintain and support Xepto Biblio, an online book-ordering platform used by students at several Philippine universities.',
          'Helped develop the Xepto Grader Tool, an offline examination-checking solution, contributing to its proof of concept, implementation and process support, and testing.',
          'Assisted with and contributed to Xepto Metabase, a data-focused web platform and dashboard initiative.',
          'Investigate issues, test functionality, and maintain applications with the development team.',
        ],
      },
      {
        title: 'Quality Assurance OJT',
        period: 'From Mar 2024',
        points: [
          'Performed manual and regression testing across devices, browsers, and relevant environments.',
          'Prepared and executed test cases; documented and reported defects, working with developers to help resolve issues.',
        ],
      },
    ],
  },
  {
    id: 'stickerista2autosign',
    organization: 'Stickerista2Autosign',
    kind: 'employment',
    summary:
      'Earlier professional experience in graphic design. Design work builds an eye for visual consistency and clear presentation — both useful when building and testing user interfaces.',
    roles: [
      {
        title: 'Graphic Artist',
        period: 'Oct 2019 – Mar 2020',
        points: ['Produced graphic design work in a creative role before moving into information technology.'],
      },
    ],
    editorNotes: ['Add design tools or types of work only if you want them listed.'],
  },
  {
    id: 'ibits',
    organization: 'IBITS',
    organizationDetail: 'PUP Biñan Campus · IT student organization',
    kind: 'leadership',
    summary:
      'Student leadership and creative work: two years contributing creative work before serving as President.',
    roles: [
      {
        title: 'President',
        period: '2023 – 2024',
        points: [
          'Led the organization with fellow officers.',
          'Helped organize and support IBITS Week and other student activities.',
        ],
      },
      {
        title: 'Creatives Specialist',
        period: '2021 – 2023',
        points: ['Contributed creative work for the organization.'],
      },
    ],
    editorNotes: ['Add specific creative deliverables or event details if you want them public.'],
  },
]
