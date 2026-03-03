const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 30000,
  retries: 0,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    headless: true,
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
    timezoneId: 'UTC',
  },
  projects: [
    {
      name: 'e2e',
      testDir: './e2e',
      use: { browserName: 'chromium' },
    },
    {
      name: 'frontend',
      testDir: './e2e-frontend',
      use: { browserName: 'chromium' },
    },
  ],
});
