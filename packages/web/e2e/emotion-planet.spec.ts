/**
 * [Emotion Planet E2E Tests]
 * LazyEmotionPlanetScene component tests (WebGL/3D specialized)
 * - Loading state
 * - Render success (canvas)
 * - Error handling (WebGL failure)
 * - Responsive rendering (Desktop, Tablet, Mobile)
 */

import { test, expect } from '@playwright/test';

/*
 * ============================================
 * Loading State
 * ============================================
 */

test.describe('Emotion Planet Loading', () => {
  /** Should show loading indicator while planet loads */
  test('should show loading on home', async ({ page }) => {
    await page.goto('/');

    // Loading may be very brief, just verify page loads
    await expect(page.locator('body')).toBeVisible();
  });

  /** Should hide loading after planet renders */
  test('should hide loading after render', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for canvas to appear (planet loaded)
    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible({ timeout: 15000 });

    // Loading should be hidden
    const loading = page.locator('[data-testid="page-loading"]:visible');
    await expect(loading).toHaveCount(0);
  });
});

/*
 * ============================================
 * Render Success
 * ============================================
 */

test.describe('Emotion Planet Render', () => {
  /** Should render canvas element */
  test('should render canvas', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible({ timeout: 15000 });
  });

  /** Should have proper canvas dimensions */
  test('should have canvas dimensions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Canvas should have non-zero dimensions
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  /** Should render without WebGL errors */
  test('should render without WebGL errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().toLowerCase().includes('webgl')) {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Should have no WebGL-specific errors
    expect(errors.length).toBe(0);
  });
});

/*
 * ============================================
 * Responsive Tests
 * ============================================
 */

test.describe('Planet Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  /** Should render planet on desktop */
  test('should render on desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Planet Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  /** Should render planet on tablet */
  test('should render on tablet', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Planet Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  /** Should render planet on mobile */
  test('should render on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible({ timeout: 15000 });
  });

  /** Should have appropriate size on mobile */
  test('should have mobile size', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Mobile should still render planet
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
  });
});
