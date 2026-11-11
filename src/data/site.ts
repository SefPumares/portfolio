import type { SiteConfig } from '@/types/content'

/**
 * EDIT THIS FILE FIRST.
 *
 * Personal details, contact links and site metadata. Values left as '' are hidden
 * automatically — never put placeholder URLs or emails here.
 */
export const site: SiteConfig = {
  name: 'Yosef Pumares',
  title: 'Junior Software Developer',
  location: 'Philippines',

  tagline:
    'I build practical software with a focus on functionality, reliability, and user experience.',
  subtagline:
    'I started in quality assurance and now work across development, testing, and education technology.',

  about: [
    'I’m a Junior Software Developer at Xepto Computing Inc., where I work on education technology products. I joined in March 2024 as a quality assurance intern — testing applications across devices and browsers, preparing test cases, and reporting defects — and moved into development after receiving a job offer in October 2024.',
    'Today my work spans frontend and backend code, databases, and reporting: maintaining applications, investigating issues, and contributing to new tools with the development team.',
    'Starting in QA taught me to look at software from two sides — how it is implemented, and how it actually behaves for the people using it. I try to keep both in view when I build.',
    'I graduated with a BS in Information Technology from the Polytechnic University of the Philippines, Biñan Campus, in 2024. Before moving into IT, I worked as a graphic artist.',
  ],

  email: 'yosef.pumares22@gmail.com',

  social: {
    github: 'https://github.com/SefPumares',
    linkedin: 'https://www.linkedin.com/in/ryan-yosef-pumares-a09a1a354',
    other: [],
  },

  // Set after deployment, e.g. 'https://your-project.vercel.app' or your custom domain.
  canonicalUrl: '',

  metaDescription:
    'Yosef Pumares is a Junior Software Developer in the Philippines working across development, quality assurance, and education technology.',

  resumePath: '/resume.pdf',
}
