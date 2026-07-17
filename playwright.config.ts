import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:3001', trace: 'retain-on-failure' },
  webServer: { command: 'npm run dev -- --port 3001', url: 'http://127.0.0.1:3001', reuseExistingServer: true, timeout: 120_000, env: { ...process.env, ALLOWED_ORIGINS: 'http://127.0.0.1:3001', COMMERCE_ENABLED: 'false', CATALOG_VISIBLE: 'true', CATALOG_APPROVED: 'true', MAPS_TEST_MODE: 'true', DELIVERY_RATE_CARD_APPROVED: 'true' } },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 5'] } },
  ],
});
