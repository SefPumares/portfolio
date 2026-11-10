import type { Project } from '@/types/content'

/**
 * Featured projects, in display order.
 *
 * - Set `published: false` to hide a project without deleting it.
 * - Only add `technologies`, `contribution` or `links` once they are confirmed.
 * - `editorNotes` are reminders for you and are never shown on the site.
 */
export const projects: Project[] = [
  {
    id: 'xepto-grader-tool',
    title: 'Xepto Grader Tool',
    category: 'Educational Technology · OMR · Software Testing',
    context: 'professional',
    published: true,
    featured: true,
    cover: { monogram: 'GT', pattern: 'grid' },
    summary:
      'An offline examination-checking tool that uses Optical Mark Recognition (OMR) to check paper-based exams, built for areas with limited internet connectivity.',
    problem:
      'Schools in areas with limited internet connectivity need a way to check paper-based examinations without depending on an online service.',
    solution:
      'The tool reads answer sheets through Optical Mark Recognition and checks them offline. The project included work associated with Bataan.',
    contribution: [
      'Member of the development team behind the tool.',
      'Contributed to the proof of concept, implementation and process support, and testing.',
    ],
    highlights: [
      {
        label: 'Reported speed-up',
        detail:
          'A 50-item exam-checking run was reported to drop from about 59 seconds to about 30 seconds. This is a reported observation, not a controlled benchmark.',
      },
      {
        label: 'Device testing',
        detail:
          '14 devices were tested — phones, laptops, XDCs and a MacBook. Three worked successfully in that test setup. This is a compatibility finding for the observed environment, not a statement about which devices the tool supports.',
      },
    ],
    recognition: 'Team recognition, December 2024',
    editorNotes: [
      'Confirm the technologies used before adding `technologies`.',
      'Confirm whether you personally ran the 14-device test, then mention it in `contribution`.',
    ],
  },
  {
    id: 'xepto-biblio',
    title: 'Xepto Biblio',
    category: 'Web Application · Educational Technology',
    context: 'professional',
    published: true,
    cover: { monogram: 'XB', pattern: 'lines' },
    summary:
      'An online book-ordering platform used by students at institutions including Ateneo de Manila University, De La Salle University, San Beda University, and the University of Santo Tomas.',
    problem: 'Students at participating institutions need a way to order their books online.',
    solution:
      'An online platform where students order books from participating institutions, supported and maintained by the Xepto development team.',
    contribution: [
      'Maintain and support the platform as part of the development team.',
      'Investigate issues and test functionality.',
    ],
    editorNotes: [
      'Add confirmed `technologies`.',
      'Add specific technical challenges you handled (keep them non-confidential).',
    ],
  },
  {
    id: 'xepto-metabase',
    title: 'Xepto Metabase Dashboards',
    category: 'Data · SQL · Reporting',
    context: 'professional',
    published: true,
    cover: { monogram: 'MB', pattern: 'bars' },
    summary:
      'A data-focused web platform and dashboard initiative that uses SQL queries and Metabase to present information through dashboards.',
    solution:
      'SQL queries feed Metabase dashboards, so data can be reviewed through reports and dashboards.',
    contribution: ['Assisted with and contributed to the initiative.'],
    technologies: ['Metabase', 'SQL'],
    editorNotes: [
      'Add your exact responsibilities (e.g. writing queries, building dashboards).',
      'Confirm the database engine (e.g. MySQL) before adding it to `technologies`.',
    ],
  },
  {
    id: 'moodle-xlms',
    title: 'Moodle / XLMS Work',
    category: 'Learning Management Systems · Web Development',
    context: 'professional',
    published: true,
    cover: { monogram: 'LMS', pattern: 'dots' },
    summary:
      'Professional development and support work in Moodle / XLMS learning management environments.',
    solution:
      'Working within Moodle / XLMS environments on LMS-related development and application support.',
    technologies: ['Moodle / XLMS'],
    editorNotes: [
      'Replace with a specific LMS project when you are ready to feature one.',
      'Do not list proposed features (AI recommendations, study-plan builder, flashcards, quizzes) unless they are implemented.',
      'Add your contribution and confirmed technologies (e.g. PHP) for that project.',
    ],
  },
  {
    id: 'ms17-reclaimed-valor',
    title: 'MS 17 Reclaimed Valor',
    category: 'Academic Project · Virtual Reality',
    context: 'academic',
    published: true,
    cover: { monogram: 'VR', pattern: 'rings' },
    summary:
      '“MS 17 Reclaimed Valor: A Virtual Reality Experience of the Marawi Siege” — my academic capstone project at PUP Biñan Campus.',
    solution: 'A virtual reality experience of the Marawi Siege, developed as a capstone project.',
    recognition: 'Best in Capstone, 2024',
    editorNotes: [
      'Add the technical stack and your responsibilities once confirmed.',
      'Add team context if it was a group project.',
    ],
  },
]

export const publishedProjects = (list: Project[] = projects): Project[] =>
  list.filter((project) => project.published)

/** Looks up a published project by id (route param). Returns undefined for unknown or hidden ids. */
export const findPublishedProject = (id: string, list: Project[] = projects): Project | undefined =>
  list.find((project) => project.published && project.id === id)
