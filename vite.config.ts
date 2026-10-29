import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

import { site } from './src/data/site.ts'

const resumeFile = fileURLToPath(new URL(`./public${site.resumePath}`, import.meta.url))

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** Writes <title>, description, Open Graph and canonical tags from src/data/site.ts into index.html. */
function siteMeta(): Plugin {
  return {
    name: 'portfolio-site-meta',
    transformIndexHtml(html) {
      const title = `${site.name} — ${site.title}`
      const canonical = site.canonicalUrl.replace(/\/$/, '')
      const tags = [
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(site.metaDescription)}">`,
        `<meta name="author" content="${escapeHtml(site.name)}">`,
        `<meta property="og:type" content="profile">`,
        `<meta property="og:title" content="${escapeHtml(title)}">`,
        `<meta property="og:description" content="${escapeHtml(site.metaDescription)}">`,
        `<meta property="og:site_name" content="${escapeHtml(site.name)}">`,
        `<meta property="og:locale" content="en_PH">`,
        `<meta name="twitter:card" content="summary">`,
        `<meta name="twitter:title" content="${escapeHtml(title)}">`,
        `<meta name="twitter:description" content="${escapeHtml(site.metaDescription)}">`,
      ]
      // Only emit canonical/og:url once a real domain is configured.
      if (/^https:\/\/[^/]+\.[^/]+/.test(canonical)) {
        tags.push(`<link rel="canonical" href="${escapeHtml(`${canonical}/`)}">`)
        tags.push(`<meta property="og:url" content="${escapeHtml(`${canonical}/`)}">`)
      }
      return html.replace('<!-- site-meta -->', tags.join('\n    '))
    },
  }
}

/** Reuses the production headers from vercel.json for `vite preview`, so CSP issues show up locally. */
function vercelHeaders(): Record<string, string> {
  const config = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as {
    headers: { source: string; headers: { key: string; value: string }[] }[]
  }
  const global = config.headers.find((rule) => rule.source === '/(.*)')
  return Object.fromEntries((global?.headers ?? []).map(({ key, value }) => [key, value]))
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), siteMeta()],
  define: {
    __RESUME_AVAILABLE__: JSON.stringify(existsSync(resumeFile)),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  preview: {
    headers: vercelHeaders(),
  },
})
