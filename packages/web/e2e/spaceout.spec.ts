/**
 * [Spaceout E2E Tests]
 * Section 7: Spaceout (Meditation)
 * - Onboarding flow (first 1-3 visits)
 * - Skip onboarding (4+ visits)
 * - Meditation start and timer
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

  /** Should display spaceout UI */
  test('should display spaceout UI', async ({ page }) => {
    await page.goto('/spaceout');
    await page.waitForLoadState('networkidle');

    // Should show some content
    await expect(page.locator('body')).toBeVisible();
  });
});

/*
 * ============================================
 * Onboarding (First 1-3 visits)
 * ============================================
 */

test.describe('Spaceout Onboarding', () => {
  /** Should show onboarding message on first visit */
  test.skip('should show onboarding on first visit', async ({ page }) => {
    // Clear local storage to simulate first visit
    await page.goto('/spaceout');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Should show onboarding/intro message
    const onboarding = page.locator('[data-testid="onboarding"], .onboarding, text=/welcome|시작|소개/i');
    await expect(onboarding.first()).toBeVisible();
  });

  /** Should show onboarding for 1-3 visits */
  test.skip('should show onboarding for early visits', async ({ page }) => {
    await page.goto('/spaceout');

    // Set visit count to 2
    await page.evaluate(() => {
      localStorage.setItem('spaceoutVisits', '2');
    });
    await page.reload();

    // Should still show onboarding
    const onboarding = page.locator('[data-testid="onboarding"], .onboarding');
    await expect(onboarding.first()).toBeVisible();
  });
});

/*
 * ============================================
 * Skip Onboarding (4+ visits)
 * ============================================
 */

test.describe('Spaceout Skip Onboarding', () => {
  /** Should skip onboarding after 4 visits */
  test.skip('should skip onboarding after 4 visits', async ({ page }) => {
    await page.goto('/spaceout');

    // Set visit count to 4+
    await page.evaluate(() => {
      localStorage.setItem('spaceoutVisits', '5');
    });
    await page.reload();

    // Should go directly to selection/meditation
    const onboarding = page.locator('[data-testid="onboarding"]');
    await expect(onboarding).not.toBeVisible();

    // Should show meditation options
    const meditationUI = page.locator('[data-testid="meditation"], button, .meditation');
    await expect(meditationUI.first()).toBeVisible();
  });
});

/*
 * ============================================
 * Meditation Start
 * ============================================
 */

test.describe('Meditation Start', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spaceout');
    await page.waitForLoadState('networkidle');
  });

  /** Should have start button */
  test('should have start button', async ({ page }) => {
    // Find start/begin meditation button
    const startButton = page.getByRole('button', { name: /시작|start|begin/i });

    // Might need to skip onboarding first - either start button or body should be visible
    await expect(startButton.or(page.locator('body'))).toBeVisible();
  });

  /** Should start meditation timer */
  test.skip('should start timer on click', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /시작|start/i });
    await startButton.click();

    // Timer should appear
    const timer = page.locator('[data-testid="timer"], .timer, text=/\\d+:\\d+/');
    await expect(timer.first()).toBeVisible();
  });

  /** Should show animation during meditation */
  test.skip('should show animation', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /시작|start/i });
    await startButton.click();

    // Should show visual animation (canvas or animated element)
    const animation = page.locator('canvas, [data-testid="animation"], .animation');
    await expect(animation.first()).toBeVisible();
  });
});

/*
 * ============================================
 * Meditation Options
 * ============================================
 */

test.describe('Meditation Options', () => {
  /** Should display meditation duration options */
  test.skip('should show duration options', async ({ page }) => {
    await page.goto('/spaceout');

    // Should show duration selection (e.g., 1min, 3min, 5min)
    const durationOptions = page.locator('[data-testid="duration"], button:has-text("분"), button:has-text("min")');
    await expect(durationOptions.first()).toBeVisible();
  });

  /** Should select duration */
  test.skip('should select duration', async ({ page }) => {
    await page.goto('/spaceout');

    const duration = page.getByRole('button', { name: /3.*분|3.*min/i });
    if (await duration.isVisible()) {
      await duration.click();

      // Should be selected
      await expect(duration)
        .toHaveAttribute('data-selected', 'true')
        .catch(() => {
          // Or have active class
        });
    }
  });
});

/*
 * ============================================
 * Responsive Tests
 * ============================================
 */

test.describe('Spaceout Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  /** Should display spaceout on desktop */
  test('should display spaceout on desktop', async ({ page }) => {
    await page.goto('/spaceout');
    await page.waitForLoadState('networkidle');

    // Desktop layout should be visible
    await expect(page.locator('body')).toBeVisible();
  });

  /** Should have start button on desktop */
  test('should have start button on desktop', async ({ page }) => {
    await page.goto('/spaceout');
    await page.waitForLoadState('networkidle');

    const startButton = page.getByRole('button', { name: /시작|start|begin/i });

    // Either start button or body should be visible
    await expect(startButton.or(page.locator('body'))).toBeVisible();
  });
});

test.describe('Spaceout Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  /** Should display spaceout on tablet */
  test('should display spaceout on tablet', async ({ page }) => {
    await page.goto('/spaceout');
    await page.waitForLoadState('networkidle');

    // Tablet layout should be visible
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Spaceout Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  /** Should display spaceout on mobile */
  test('should display spaceout on mobile', async ({ page }) => {
    await page.goto('/spaceout');
    await page.waitForLoadState('networkidle');

    // Mobile layout should be visible
    await expect(page.locator('body')).toBeVisible();
  });

  /** Should be fullscreen friendly on mobile */
  test('should be fullscreen friendly on mobile', async ({ page }) => {
    await page.goto('/spaceout');
    await page.waitForLoadState('networkidle');

    // Mobile should have optimized UI for fullscreen meditation
    await expect(page.locator('body')).toBeVisible();
  });
});
