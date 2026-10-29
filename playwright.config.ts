import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end tests against the production build (`vite preview`), which serves the same
 * security headers as vercel.json. Uses the locally installed Microsoft Edge by default;
 * set PW_CHANNEL=chromium (after `npx playwright install chromium`) to use Playwright's browser.
 */
const channel = process.env.PW_CHANNEL ?? 'msedge'
const baseURL = 'http://localhost:4173'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    channel: channel === 'chromium' ? undefined : channel,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile', use: { ...devices['Desktop Edge'], viewport: { width: 360, height: 800 }, hasTouch: true } },
    { name: 'tablet', use: { ...devices['Desktop Edge'], viewport: { width: 768, height: 1024 } } },
    { name: 'desktop', use: { ...devices['Desktop Edge'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: 'npm run build-only && npm run preview -- --port 4173 --strictPort',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
