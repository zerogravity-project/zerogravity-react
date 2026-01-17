/**
 * [Playwright E2E Test Configuration]
 * See https://playwright.dev/docs/test-configuration
 *
 * Auth State Files:
 * - user-no-consent.json: Authenticated but consent not completed
 * - user.json: Authenticated with consent completed
 *
 * Projects:
 * - chromium-unauth: No authentication (*.unauth.spec.ts)
 * - chromium-no-consent: Auth O, Consent X (*.consent.spec.ts)
 * - chromium: Auth O, Consent O (default *.spec.ts)
 */

import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/** Auth state file paths */
const AUTH_FILE_NO_CONSENT = path.join(__dirname, 'packages/web/e2e/.auth/user-no-consent.json');
const AUTH_FILE = path.join(__dirname, 'packages/web/e2e/.auth/user.json');

/** Skip setup if auth files already exist (manual cookie auth) */
const fs = require('fs');
const SKIP_AUTH_SETUP = fs.existsSync(AUTH_FILE_NO_CONSENT);
const SKIP_CONSENT_SETUP = fs.existsSync(AUTH_FILE);

export default defineConfig({
  testDir: './packages/web/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on failure (handles flaky tests) */
  retries: process.env.CI ? 2 : 1,
  /* Use 4 workers in CI, default in local */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['list']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    /*
     * ============================================
     * Setup: Authentication (OAuth login only)
     * ============================================
     */
    {
      name: 'setup-auth',
      testMatch: /auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
      },
    },

    /*
     * ============================================
     * Setup: Consent (complete consent flow)
     * ============================================
     */
    {
      name: 'setup-consent',
      testMatch: /consent\.setup\.ts/,
      dependencies: SKIP_AUTH_SETUP ? [] : ['setup-auth'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE_NO_CONSENT,
      },
    },

    /*
     * ============================================
     * Unauthenticated Tests (*.unauth.spec.ts)
     * ============================================
     */
    {
      name: 'chromium-unauth',
      testMatch: /.*\.unauth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    /*
     * ============================================
     * Auth O, Consent X Tests (*.consent.spec.ts)
     * ============================================
     */
    {
      name: 'chromium-no-consent',
      testMatch: /.*\.consent\.spec\.ts/,
      dependencies: SKIP_AUTH_SETUP ? [] : ['setup-auth'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE_NO_CONSENT,
      },
    },

    /*
     * ============================================
     * 3D/WebGL Tests (Sequential execution)
     * ============================================
     */
    {
      name: 'chromium-3d',
      testMatch: [
        /.*emotion-planet.*\.spec\.ts/,
        /.*spaceout.*\.spec\.ts/,
        /.*home.*\.spec\.ts/,
        /.*record-daily.*\.spec\.ts/, // Uses 3D canvas
        /.*record-moment.*\.spec\.ts/, // Uses 3D canvas
      ],
      testIgnore: /.*\.(unauth|consent)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
      },
      dependencies: SKIP_CONSENT_SETUP ? [] : ['setup-consent'],
      fullyParallel: false, // Sequential to prevent WebGL resource contention
    },

    /*
     * ============================================
     * Desktop Browsers (Auth O, Consent O)
     * ============================================
     */
    {
      name: 'chromium',
      testIgnore: [
        /.*\.(unauth|consent)\.spec\.ts/,
        /.*emotion-planet.*\.spec\.ts/,
        /.*spaceout.*\.spec\.ts/,
        /.*home.*\.spec\.ts/,
        /.*record-daily.*\.spec\.ts/, // Moved to chromium-3d
        /.*record-moment.*\.spec\.ts/, // Moved to chromium-3d
      ],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
      },
      dependencies: SKIP_CONSENT_SETUP ? [] : ['setup-consent'],
    },
    {
      name: 'firefox',
      testIgnore: /.*\.(unauth|consent)\.spec\.ts/,
      use: {
        ...devices['Desktop Firefox'],
        storageState: AUTH_FILE,
      },
      dependencies: SKIP_CONSENT_SETUP ? [] : ['setup-consent'],
    },
    {
      name: 'webkit',
      testIgnore: /.*\.(unauth|consent)\.spec\.ts/,
      use: {
        ...devices['Desktop Safari'],
        storageState: AUTH_FILE,
      },
      dependencies: SKIP_CONSENT_SETUP ? [] : ['setup-consent'],
    },

    /*
     * ============================================
     * Mobile Browsers (Auth O, Consent O)
     * ============================================
     */
    {
      name: 'Mobile Chrome',
      testIgnore: /.*\.(unauth|consent)\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
        storageState: AUTH_FILE,
      },
      dependencies: SKIP_CONSENT_SETUP ? [] : ['setup-consent'],
    },
    {
      name: 'Mobile Safari',
      testIgnore: /.*\.(unauth|consent)\.spec\.ts/,
      use: {
        ...devices['iPhone 12'],
        storageState: AUTH_FILE,
      },
      dependencies: SKIP_CONSENT_SETUP ? [] : ['setup-consent'],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm dev:web',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
