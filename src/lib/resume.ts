import { site } from '@/data/site'

/**
 * Whether the resume PDF exists. Computed at build/dev-server start by vite.config.ts,
 * which checks for `public/resume.pdf`. Restart the dev server after adding the file.
 */
export const resumeAvailable: boolean = __RESUME_AVAILABLE__

export const resumeHref: string = site.resumePath
