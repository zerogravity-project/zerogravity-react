/**
 * [Spaceout E2E Tests]
 * Section 7: Spaceout (Meditation)
 * - Onboarding flow (first 1-3 visits)
 * - Skip onboarding (3+ visits)
 * - Selection screen navigation
 * - Video page playback
 */

import { test, expect } from '@playwright/test';

/*
 * ============================================
 * Spaceout Access
 * ============================================
 */

test.describe('Spaceout Access', () => {
  /** Should load spaceout page */
  test('should load spaceout page', async ({ page }) => {
    await page.goto('/spaceout');
    await page.waitForLoadState('networkidle');

    // Should be on spaceout page
    await expect(page).toHaveURL(/\/spaceout/);
  });
});

/*
 * ============================================
 * Onboarding (First 1-3 visits)
 * ============================================
 */

test.describe('Spaceout Onboarding', () => {
  /** Should show onboarding message on first visit */
  test('should show onboarding on first visit', async ({ page }) => {
    // Clear local storage to simulate first visit
    await page.goto('/spaceout');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should show onboarding message (one of: Welcome to Spaceout, etc.)
    const onboarding = page.getByText(/Welcome to Spaceout|track your emotions|clear your mind|Choose your path/i);
    await expect(onboarding.first()).toBeVisible({ timeout: 10000 });
  });

  /** Should show onboarding for 1-3 visits (visits < 3 show onboarding) */
  test('should show onboarding for early visits', async ({ page }) => {
    await page.goto('/spaceout');

    // Set visit count to 1 (< 3 means onboarding shows)
    await page.evaluate(() => {
      localStorage.setItem('spaceout_visit_count', '1');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still show onboarding message
    const onboarding = page.getByText(/Welcome to Spaceout|track your emotions|clear your mind|Choose your path/i);
    await expect(onboarding.first()).toBeVisible({ timeout: 10000 });
  });
});

/*
 * ============================================
 * Skip Onboarding (3+ visits)
 * ============================================
 */

test.describe('Spaceout Skip Onboarding', () => {
  /** Should skip onboarding after 3+ visits (visits >= 3 skip onboarding) */
  test('should skip onboarding after 3 visits', async ({ page }) => {
    await page.goto('/spaceout');

    // Set visit count to 3+ (>= 3 means onboarding skipped)
    await page.evaluate(() => {
      localStorage.setItem('spaceout_visit_count', '3');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should show selection screen directly (Choose Your Path)
    const selectionScreen = page.getByText('Choose Your Path');
    await expect(selectionScreen).toBeVisible({ timeout: 5000 });

    // Should show action buttons
    const videoButton = page.getByRole('button', { name: /Watch Calming Video/i });
    await expect(videoButton).toBeVisible();
  });
});

/*
 * ============================================
 * Selection Screen Navigation
 * ============================================
 */

test.describe('Selection Screen Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spaceout');

    // Skip onboarding by setting visit count
    await page.evaluate(() => {
      localStorage.setItem('spaceout_visit_count', '10');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait for selection screen
    await expect(page.getByText('Choose Your Path')).toBeVisible({ timeout: 5000 });
  });

  /** Should navigate to video page on Watch Calming Video click */
  test('should navigate to video page', async ({ page }) => {
    const videoButton = page.getByRole('button', { name: /Watch Calming Video/i });
    await videoButton.click();

    // Should navigate to /spaceout/video
    await expect(page).toHaveURL(/\/spaceout\/video/);
  });

  /** Should navigate to record page on Record Now click */
  test('should navigate to record page', async ({ page }) => {
    const recordButton = page.getByRole('button', { name: /Record Now/i });
    await recordButton.click();

    // Should navigate to /record
    await expect(page).toHaveURL(/\/record/);
  });
});

/*
 * ============================================
 * Video Page
 * ============================================
 */

test.describe('Video Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spaceout/video');
    await page.waitForLoadState('networkidle');
  });

  /** Should load video page */
  test('should load video page', async ({ page }) => {
    await expect(page).toHaveURL(/\/spaceout\/video/);
  });

  /** Should display video element */
  test('should display video element', async ({ page }) => {
    const video = page.locator('video');
    await expect(video).toBeVisible({ timeout: 5000 });
  });

  /** Should show sound activation overlay */
  test('should show sound activation overlay', async ({ page }) => {
    // Should show "Touch to enable sound" message
    const soundGuide = page.getByText(/Touch to enable sound/i);
    await expect(soundGuide).toBeVisible({ timeout: 5000 });
  });

  /** Should hide overlay after click */
  test('should hide overlay after click', async ({ page }) => {
    const soundGuide = page.getByText(/Touch to enable sound/i);
    await expect(soundGuide).toBeVisible({ timeout: 5000 });

    // Click to enable sound
    await page.click('body');

    // Overlay should disappear
    await expect(soundGuide).not.toBeVisible({ timeout: 3000 });
  });

  /** Should navigate to record after all videos end */
  test.skip('should navigate to record after videos end', async ({ page }) => {
    // Note: Skipped - video playback timing is unreliable in E2E tests
    // Videos: sun.mp4, mercury.mp4 → after both end → /record

    // Click to start with sound
    await page.click('body');

    // Wait for videos to complete (this is flaky due to video loading times)
    // After all videos end, should navigate to /record
    await expect(page).toHaveURL(/\/record/, { timeout: 120000 });
  });
});
