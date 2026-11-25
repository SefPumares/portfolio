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
      'A Vue.js and TypeScript app captures answer sheets with the device camera (through Capacitor), and Python handles the Optical Mark Recognition, so exams are checked offline. The project included work associated with Bataan.',
    contribution: [
      'Member of the development team behind the tool.',
      'Contributed to the proof of concept, implementation and process support, and testing.',
    ],
    highlights: [
      {
        label: 'Reported speed-up',
        detail:
          'Checking a 50-item exam dropped from about 59 seconds to about 30 seconds, and the team can now go faster than that. These are observed times, not a controlled benchmark.',
      },
    ],
    technologies: ['Vue.js', 'TypeScript', 'Capacitor', 'Python'],
    recognition: 'Team recognition, December 2024',
    editorNotes: [
      'Speed-up confirmed by Yosef (Nov 2026). Replace "faster than that" with a measured figure if you have one.',
      'A "14 devices tested" highlight was removed in v2.1.0 because it could not be confirmed.',
    ],
  },
  {
    id: 'xepto-health-checker',
    title: 'Xepto Health Checker',
    category: 'Moodle Plugin · Educational Technology',
    context: 'professional',
    published: true,
    cover: { monogram: 'HC', pattern: 'rings' },
    summary:
      'A Moodle plugin that checks a course is set up correctly and free of errors before its automated gradebook is exported.',
    problem:
      'A misconfigured course only shows its mistakes when the automated gradebook is exported, when they are harder and slower to fix.',
    solution:
      'The plugin checks the course setup ahead of time and flags problems, so they can be fixed before the gradebook export runs.',
    contribution: ['Created the plugin.'],
    technologies: ['Moodle', 'PHP'],
    editorNotes: [
      'Add examples of what it checks (non-confidential) and any team or reviewer context.',
      'Add other confirmed technologies (e.g. JavaScript, SQL) if used.',
    ],
  },
  {
    id: 'xepto-module-repository',
    title: 'Xepto Module Repository',
    category: 'Moodle Plugin · Educational Technology',
    context: 'professional',
    published: true,
    cover: { monogram: 'MR', pattern: 'dots' },
    summary:
      'A Moodle plugin, similar to an LTI external tool, where teachers pick ready-made, validated activities aligned with their budget of work and add them to their course.',
    problem:
      'Building every activity from scratch takes teachers a lot of time, especially those who are less comfortable with technology.',
    solution:
      'A repository of pre-built, validated activities: teachers choose the ones that match their budget of work and add them to their course, instead of creating each one themselves.',
    contribution: ['Created the plugin.'],
    technologies: ['Moodle', 'PHP'],
    editorNotes: [
      'Add other confirmed technologies (e.g. JavaScript, SQL) if used.',
      'Add adoption or usage numbers only if you can back them up.',
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
    technologies: ['WordPress'],
    editorNotes: [
      'Add other confirmed technologies (e.g. PHP, WooCommerce, MySQL) if you worked with them directly.',
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
    contribution: [
      'Wrote MySQL queries for reports, using AI tools to help draft and refine them.',
      'Built dashboards in Metabase to present the data.',
    ],
    technologies: ['Metabase', 'MySQL', 'SQL'],
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
    solution:
      'A virtual reality experience of the Marawi Siege, built in Unity with C# by a team of six as a capstone project.',
    contribution: [
      'One of a six-person team.',
      'Created terrains and landscapes for the VR environment.',
      'Modeled characters.',
      'Recorded voiceovers.',
    ],
    technologies: ['Unity', 'C#'],
    recognition: 'Best in Capstone, 2024',
  },
]

export const publishedProjects = (list: Project[] = projects): Project[] =>
  list.filter((project) => project.published)

/** Looks up a published project by id (route param). Returns undefined for unknown or hidden ids. */
export const findPublishedProject = (id: string, list: Project[] = projects): Project | undefined =>
  list.find((project) => project.published && project.id === id)
