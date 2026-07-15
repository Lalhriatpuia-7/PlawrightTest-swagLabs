const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test/test-scripts',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: [['html', { outputFolder: 'test-results/playwright-report', open: 'never' }]],
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  outputDir: 'test-results/artifacts',
});
