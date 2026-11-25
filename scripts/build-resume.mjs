/**
 * Renders resume/resume.html to public/resume.pdf with a headless browser.
 * Usage: npm run resume   (set PW_CHANNEL=chromium if Microsoft Edge is not installed)
 */
import { chromium } from '@playwright/test'
import { fileURLToPath, pathToFileURL } from 'node:url'

const source = fileURLToPath(new URL('../resume/resume.html', import.meta.url))
const output = fileURLToPath(new URL('../public/resume.pdf', import.meta.url))
const channel = process.env.PW_CHANNEL ?? 'msedge'

const browser = await chromium.launch(channel === 'chromium' ? {} : { channel })
try {
  const page = await browser.newPage()
  await page.goto(pathToFileURL(source).href)
  const pdf = await page.pdf({ path: output, preferCSSPageSize: true, printBackground: true })
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length
  console.log(`Wrote ${output} (${pages} page${pages === 1 ? '' : 's'}, ${Math.round(pdf.length / 1024)} KB)`)
  if (pages > 1) console.warn('Warning: the resume runs past one page.')
} finally {
  await browser.close()
}
