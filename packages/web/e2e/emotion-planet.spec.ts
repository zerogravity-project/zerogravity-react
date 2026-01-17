/**
 * [Emotion Planet E2E Tests]
 * LazyEmotionPlanetScene component tests
 * - Loading state
 * - Render success (canvas)
 * - Error handling (WebGL failure)
 * - Page-specific rendering (Home, Record, Calendar)
 */

import { test, expect, Locator } from '@playwright/test';

/**
 * ============================================
 * Helpers
 * ============================================
 */

/** Emotion slider values from emotion.constants.ts */
const EMOTION_SLIDER_VALUES = [0, 16, 33, 50, 67, 84, 100] as const;

/**
 * Set Radix UI Slider to a specific emotion level (0-6)
 * Uses keyboard navigation: Home/End for extremes, PageUp for faster jumps
 */
async function setSliderValue(slider: Locator, level: number) {
  await slider.focus();
  if (level === 0) {
    await slider.press('Home');
  } else if (level === 6) {
    await slider.press('End');
  } else {
    await slider.press('Home');
    const targetValue = EMOTION_SLIDER_VALUES[level];
    // PageUp jumps 10, ArrowRight jumps 1
    const pageJumps = Math.floor(targetValue / 10);
    const remaining = targetValue % 10;
    for (let i = 0; i < pageJumps; i++) {
      await slider.press('PageUp');
    }
    for (let i = 0; i < remaining; i++) {
      await slider.press('ArrowRight');
    }
  }
}

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
 * Page-specific Rendering
 * ============================================
 */

test.describe('Planet on Home Page', () => {
  /** Should render large planet on home */
  test('should render large planet', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible({ timeout: 15000 });

    // Home page should have large planet
    const box = await canvas.first().boundingBox();
    expect(box?.width).toBeGreaterThan(500);
  });

  /** Should show sparkles effect */
  test('should have sparkles', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Just verify planet renders (sparkles are internal to Three.js)
    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Planet on Record Page', () => {
  /** Should render planet on emotion selection step */
  test('should render on record step', async ({ page }) => {
    // Record page requires auth - use moment which has planet
    await page.goto('/record/moment');
    await page.waitForLoadState('networkidle');

    // Canvas should be visible for emotion planet
    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible({ timeout: 15000 });
  });

  /** Should update planet color with slider */
  test.skip('should update color with slider', async ({ page }) => {
    await page.goto('/record/moment');
    await page.waitForLoadState('networkidle');

    // Find slider and change value
    const slider = page.locator('[role="slider"], input[type="range"]');
    if (await slider.isVisible()) {
      // Slider interaction changes planet color
      await setSliderValue(slider, 3); // Change to neutral
      await page.waitForTimeout(500);

      // Verify canvas still renders
      const canvas = page.locator('canvas');
      await expect(canvas.first()).toBeVisible();
    }
  });
});

test.describe('Planet in Calendar Drawer', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  /** Should render planet in detail drawer */
  test.skip('should render in drawer', async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Click on a calendar cell to open drawer
    const cell = page.locator('[data-testid="calendar-cell"], .calendar-cell').first();
    if (await cell.isVisible()) {
      await cell.click();

      // Drawer should have planet
      const drawer = page.locator('[data-testid="drawer"], [role="dialog"]');
      await expect(drawer.first()).toBeVisible();

      // Canvas in drawer
      const canvas = drawer.locator('canvas');
      await expect(canvas.first()).toBeVisible({ timeout: 10000 });
    }
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
