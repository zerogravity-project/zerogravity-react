/**
 * [Consent Page E2E Tests]
 * Section 1-1: Consent Flow
 * - Consent page display
 * - Required vs optional consents
 * - Form validation
 * - Submit and redirect
 * - Protected route redirects without consent
 *
 * Uses: chromium-no-consent project (Auth O, Consent X)
 */

import { test, expect } from '@playwright/test';

/*
 * ============================================
 * Consent Page Display
 * ============================================
 */

test.describe('Consent Page Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/consent');
    await page.waitForLoadState('networkidle');
  });

  /** Should display consent page with title */
  test('should display consent page', async ({ page }) => {
    await expect(page.getByText('Welcome to ZeroGravity')).toBeVisible();
    await expect(page.getByText('Before you begin, please review and accept our terms')).toBeVisible();
  });

  /** Should display required agreements section */
  test('should display required agreements', async ({ page }) => {
    await expect(page.getByText('Required Agreements')).toBeVisible();
    await expect(page.getByText('Terms of Service')).toBeVisible();
    await expect(page.getByText('Privacy Policy')).toBeVisible();
    await expect(page.getByText('Sensitive Personal Data')).toBeVisible();
  });

  /** Should display optional features section */
  test('should display optional features', async ({ page }) => {
    await expect(page.getByText('Optional Features')).toBeVisible();
    await expect(page.getByText('AI-Powered Analysis')).toBeVisible();
  });

  /** Should display submit button */
  test('should display submit button', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /accept and continue/i });
    await expect(submitButton).toBeVisible();
  });
});

/*
 * ============================================
 * Consent Form Validation
 * ============================================
 */

test.describe('Consent Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/consent');
    await page.waitForLoadState('networkidle');
  });

  /** Submit button should be disabled when required consents not checked */
  test('should disable submit button without required consents', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /accept and continue/i });
    await expect(submitButton).toBeDisabled();
  });

  /** Submit button should be enabled when all required consents checked */
  test('should enable submit button with all required consents', async ({ page }) => {
    // Check all required checkboxes
    const checkboxes = page.locator('button[role="checkbox"]');

    // Terms, Privacy, Sensitive (first 3)
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();
    await checkboxes.nth(2).click();

    // Submit button should be enabled
    const submitButton = page.getByRole('button', { name: /accept and continue/i });
    await expect(submitButton).toBeEnabled();
  });

  /** AI consent should be optional */
  test('should allow submission without AI consent', async ({ page }) => {
    // Check only required checkboxes (not AI)
    const checkboxes = page.locator('button[role="checkbox"]');

    await checkboxes.nth(0).click(); // Terms
    await checkboxes.nth(1).click(); // Privacy
    await checkboxes.nth(2).click(); // Sensitive

    // Submit should be enabled without AI consent
    const submitButton = page.getByRole('button', { name: /accept and continue/i });
    await expect(submitButton).toBeEnabled();
  });
});

/*
 * ============================================
 * Consent Checkbox Interaction
 * ============================================
 */

test.describe('Consent Checkbox Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/consent');
    await page.waitForLoadState('networkidle');
  });

  /** Should toggle checkbox on click */
  test('should toggle checkboxes', async ({ page }) => {
    const termsCheckbox = page.locator('button[role="checkbox"]').nth(0);

    // Initially unchecked
    await expect(termsCheckbox).toHaveAttribute('data-state', 'unchecked');

    // Click to check
    await termsCheckbox.click();
    await expect(termsCheckbox).toHaveAttribute('data-state', 'checked');

    // Click to uncheck
    await termsCheckbox.click();
    await expect(termsCheckbox).toHaveAttribute('data-state', 'unchecked');
  });
});

/*
 * ============================================
 * Consent Links
 * ============================================
 */

test.describe('Consent Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/consent');
    await page.waitForLoadState('networkidle');
  });

  /** Terms links should open in new tab */
  test('should have terms links with target blank', async ({ page }) => {
    const termsLink = page.getByRole('link', { name: 'Terms of Service' });
    await expect(termsLink).toHaveAttribute('target', '_blank');
    await expect(termsLink).toHaveAttribute('href', '/terms/service');
  });

  /** Privacy link should open in new tab */
  test('should have privacy link with target blank', async ({ page }) => {
    const privacyLink = page.getByRole('link', { name: 'Privacy Policy' });
    await expect(privacyLink).toHaveAttribute('target', '_blank');
    await expect(privacyLink).toHaveAttribute('href', '/terms/privacy');
  });
});

/*
 * ============================================
 * Protected Route Redirects (Without Consent)
 * Note: Skipped because test account already has consent on backend
 * To test this, need a fresh account without backend consent
 * ============================================
 */

test.describe('Protected Route Redirects Without Consent', () => {
  /** Should redirect to consent when accessing profile */
  test.skip('should redirect to consent from profile', async ({ page }) => {
    // Note: Skipped - test account has consent on backend
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Should be redirected to consent page
    await expect(page).toHaveURL(/\/consent/);
  });

  /** Should redirect to consent when accessing record */
  test.skip('should redirect to consent from record', async ({ page }) => {
    // Note: Skipped - test account has consent on backend
    await page.goto('/record');
    await page.waitForLoadState('networkidle');

    // Should be redirected to consent page
    await expect(page).toHaveURL(/\/consent/);
  });

  /** Should redirect to consent when accessing spaceout */
  test.skip('should redirect to consent from spaceout', async ({ page }) => {
    // Note: Skipped - test account has consent on backend
    await page.goto('/spaceout');
    await page.waitForLoadState('networkidle');

    // Should be redirected to consent page
    await expect(page).toHaveURL(/\/consent/);
  });
});

/*
 * ============================================
 * Consent Submit Flow
 * Note: This test actually submits, so it may affect test account state
 * ============================================
 */

test.describe('Consent Submit Flow', () => {
  /** Should redirect to home after consent submission */
  test.skip('should redirect to home after submission', async ({ page }) => {
    // Note: Skipped because it changes the account consent state
    // This would break other no-consent tests
    await page.goto('/consent');
    await page.waitForLoadState('networkidle');

    // Check all required checkboxes
    const checkboxes = page.locator('button[role="checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();
    await checkboxes.nth(2).click();

    // Submit
    const submitButton = page.getByRole('button', { name: /accept and continue/i });
    await submitButton.click();

    // Should redirect to home
    await expect(page).toHaveURL('/');
  });
});
