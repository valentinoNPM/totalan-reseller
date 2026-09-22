import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:8889',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }, // ~390px width
    },
    {
      name: 'Tablet',
      use: { ...devices['iPad (gen 7)'] },
    },
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  webServer: {
    command: 'npx -y netlify-cli dev --offline',
    url: 'http://127.0.0.1:8889',
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
  },
});
