/**
 * [Consent Setup]
 * Playwright consent setup for E2E tests
 * Completes consent flow and saves authenticated state WITH consent
 *
 * Input: .auth/user-no-consent.json (from auth.setup.ts)
 * Output: .auth/user.json
 */

import path from 'path';

import { expect, test as setup } from '@playwright/test';

const AUTH_FILE = path.join(__dirname, '.auth/user.json');

/**
 * Setup: Complete consent flow
 *
 * This setup runs after auth.setup.ts and completes the consent flow.
 * It uses the authenticated state from user-no-consent.json.
 *
 * Flow:
 * 1. Navigate to /consent (or any protected route → redirects to /consent)
 * 2. Check all required checkboxes + AI analysis consent
 * 3. Submit → redirects to /
 * 4. Save session state → user.json
 */
setup('complete-consent', async ({ page }) => {
  // Check if auth file already exists
  const fs = await import('fs');
  if (fs.existsSync(AUTH_FILE)) {
    console.log('✅ Auth file (with consent) exists, skipping consent setup');
    return;
  }

  console.log('📝 Starting consent setup...');

  // Navigate to consent page (middleware should redirect here if no consent)
  await page.goto('/consent');
  await page.waitForLoadState('networkidle');

  // Check if we're on consent page
  const currentUrl = page.url();
  if (!currentUrl.includes('/consent')) {
    console.log('📍 Not on consent page, user may already have consent');
    console.log('📍 Current URL:', currentUrl);
    // Save current state anyway
    await page.context().storageState({ path: AUTH_FILE });
    console.log('💾 Auth state saved to:', AUTH_FILE);
    return;
  }

  console.log('📝 Completing consent form...');

  // Wait for consent form to load
  await expect(page.getByText('Welcome to Zero Gravity')).toBeVisible({ timeout: 10000 });

  // Check all required consent checkboxes
  // Terms of Service
  const termsCheckbox = page.locator('button[role="checkbox"]').nth(0);
  await termsCheckbox.click();

  // Privacy Policy
  const privacyCheckbox = page.locator('button[role="checkbox"]').nth(1);
  await privacyCheckbox.click();

  // Sensitive Data Consent
  const sensitiveCheckbox = page.locator('button[role="checkbox"]').nth(2);
  await sensitiveCheckbox.click();

  // AI Analysis Consent (optional but we'll enable it for full testing)
  const aiCheckbox = page.locator('button[role="checkbox"]').nth(3);
  await aiCheckbox.click();

  // Click submit button
  const submitButton = page.getByRole('button', { name: /accept and continue/i });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Wait for redirect to home page
  await page.waitForURL('/', { timeout: 10000 });

  console.log('✅ Consent completed successfully!');
  console.log('📍 Current URL:', page.url());

  // Save authentication state with consent
  await page.context().storageState({ path: AUTH_FILE });
  console.log('💾 Auth state (with consent) saved to:', AUTH_FILE);
});
