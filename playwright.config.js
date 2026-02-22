import { defineConfig } from '@playwright/test';

export default defineConfig({
    globalSetup: './e2e/global-setup.js',
    testDir: './e2e',
    timeout: 60000,
    retries: 0,
    workers: 2,
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:8080',
        headless: true,
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
});
