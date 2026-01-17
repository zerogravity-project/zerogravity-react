/**
 * [Auth Setup]
 * Playwright authentication setup for E2E tests
 * Creates authenticated session state WITHOUT consent (for consent tests)
 *
 * Output: .auth/user-no-consent.json
 */

import path from 'path';

import { expect, test as setup } from '@playwright/test';

const AUTH_FILE_NO_CONSENT = path.join(__dirname, '.auth/user-no-consent.json');

/**
 * Setup: Authenticate via Google OAuth (no consent)
 *
 * This setup runs once and saves the authenticated state WITHOUT completing consent.
 * Manual login is required for OAuth - the browser will open and wait for you to log in.
 *
 * Flow:
 * 1. OAuth login → redirects to /consent (new user) or / (returning user)
 * 2. Save session state → user-no-consent.json
 */
setup('authenticate', async ({ page }) => {
  // Check if auth file already exists
  const fs = await import('fs');
  if (fs.existsSync(AUTH_FILE_NO_CONSENT)) {
    console.log('✅ Auth file (no-consent) exists, skipping login');
    return;
  }

  console.log('🔐 Starting authentication setup (no consent)...');
  console.log('📌 Please log in manually when the browser opens');
  console.log('⚠️  DO NOT complete the consent form - just log in!');

  // Navigate to login page
  await page.goto('/login');
  await expect(page).toHaveTitle(/ZeroGravity/);

  // Click Google login button
  const googleButton = page.getByRole('button', { name: /login with google/i });
  await expect(googleButton).toBeVisible({ timeout: 15000 });
  await googleButton.click();

  // Wait for OAuth flow to complete
  // New user → /consent, Returning user without consent → /consent
  // Returning user with consent → / or /profile
  // Timeout: 5 minutes for manual login
  await page.waitForURL(/\/(consent|profile)?/, { timeout: 300000 });

  console.log('✅ Authentication successful!');
  console.log('📍 Current URL:', page.url());

  // Save authentication state (without consent)
  await page.context().storageState({ path: AUTH_FILE_NO_CONSENT });
  console.log('💾 Auth state (no-consent) saved to:', AUTH_FILE_NO_CONSENT);
});
