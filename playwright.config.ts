import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:4321' },
  webServer: { command: 'npm run build && npm run preview', url: 'http://localhost:4321', reuseExistingServer: true, timeout: 180_000 },
  projects: [{ name: 'mobile', use: { ...devices['Pixel 7'] } }],
});
