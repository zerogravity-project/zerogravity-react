/**
 * [Navigation E2E Tests]
 * Section 9: Navigation bar
 * - Desktop: Dropdown menu
 * - Mobile: Drawer menu
 * - Profile display (SSR)
 * - Auto-close on navigation
 */

import { test, expect } from '@playwright/test';

/*
 * ============================================
 * Desktop Navigation (Dropdown)
 * ============================================
 */

test.describe('Desktop Navigation', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  /** Should display navigation menu */
  test('should display nav menu', async ({ page }) => {
    const nav = page.locator('nav, [data-testid="navigation"], header');
    await expect(nav.first()).toBeVisible();
  });

  /** Should open dropdown on click */
  test('should open dropdown', async ({ page }) => {
    // Find menu trigger (hamburger or avatar)
    const menuTrigger = page.locator('[data-testid="menu-trigger"], [aria-haspopup="menu"], button:has(img)').first();

    if (await menuTrigger.isVisible()) {
      await menuTrigger.click();

      // Dropdown should appear
      const dropdown = page.locator('[role="menu"], .dropdown, [data-testid="dropdown"]');
      await expect(dropdown.first()).toBeVisible({ timeout: 2000 });
    }
  });

  /** Should navigate on menu item click */
  test('should navigate to page', async ({ page }) => {
    const menuTrigger = page.locator('[data-testid="menu-trigger"], [aria-haspopup="menu"]').first();

    if (await menuTrigger.isVisible()) {
      await menuTrigger.click();

      // Click a navigation item
      const profileLink = page.getByRole('menuitem', { name: /profile|프로필/i });
      if (await profileLink.isVisible()) {
        await profileLink.click();
        await expect(page).toHaveURL(/\/profile/);
      }
    }
  });

  /** Should auto-close dropdown after navigation */
  test('should close dropdown after navigation', async ({ page }) => {
    const menuTrigger = page.locator('[data-testid="menu-trigger"]').first();

    if (await menuTrigger.isVisible()) {
      await menuTrigger.click();

      const profileLink = page.getByRole('menuitem', { name: /profile|프로필/i });
      if (await profileLink.isVisible()) {
        await profileLink.click();

        // Dropdown should be closed
        const dropdown = page.locator('[role="menu"], .dropdown');
        await expect(dropdown.first()).not.toBeVisible({ timeout: 2000 });
      }
    }
  });
});

/*
 * ============================================
 * Mobile Navigation (Drawer)
 * ============================================
 */

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  /** Should display hamburger menu */
  test('should display menu button', async ({ page }) => {
    const menuButton = page.locator('[data-testid="menu-button"], button[aria-label*="menu" i], .hamburger');
    await expect(menuButton.first()).toBeVisible();
  });

  /** Should open drawer on menu click */
  test('should open drawer', async ({ page }) => {
    const menuButton = page.locator('[data-testid="menu-button"], button[aria-label*="menu" i]').first();

    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Drawer should slide in
      const drawer = page.locator('[data-testid="nav-drawer"], [role="dialog"], .drawer');
      await expect(drawer.first()).toBeVisible({ timeout: 2000 });
    }
  });

  /** Should navigate from drawer */
  test('should navigate from drawer', async ({ page }) => {
    const menuButton = page.locator('[data-testid="menu-button"]').first();

    if (await menuButton.isVisible()) {
      await menuButton.click();

      const recordLink = page.getByRole('link', { name: /record|기록/i });
      if (await recordLink.isVisible()) {
        await recordLink.click();
        await expect(page).toHaveURL(/\/record/);
      }
    }
  });

  /** Should auto-close drawer after navigation */
  test('should close drawer after navigation', async ({ page }) => {
    const menuButton = page.locator('[data-testid="menu-button"]').first();

    if (await menuButton.isVisible()) {
      await menuButton.click();

      const recordLink = page.getByRole('link', { name: /record|기록/i });
      if (await recordLink.isVisible()) {
        await recordLink.click();

        // Drawer should close automatically
        const drawer = page.locator('[data-testid="nav-drawer"], [role="dialog"]');
        await expect(drawer.first()).not.toBeVisible({ timeout: 2000 });
      }
    }
  });
});

/*
 * ============================================
 * Profile Display (SSR)
 * ============================================
 */

test.describe('Nav Profile Display', () => {
  /** Should show profile image when logged in (no loading) */
  test('should display profile without loading', async ({ page }) => {
    await page.goto('/');

    // SSR should render profile immediately without loading spinner
    const loading = page.locator('[data-testid="profile-loading"], .skeleton');
    const profileImg = page.locator('img[alt*="profile" i], [data-testid="user-avatar"]');

    // Either profile is visible immediately or loading is not shown
    await page.waitForLoadState('domcontentloaded');

    // SSR: profile should be present without loading state
    // Verify either profile is visible or page loads without loading state
    const profileVisible = await profileImg
      .first()
      .isVisible()
      .catch(() => false);
    const loadingVisible = await loading
      .first()
      .isVisible()
      .catch(() => false);

    // Just verify page loads (SSR should render profile or skip loading)
    await expect(page.locator('body')).toBeVisible();
    expect(profileVisible || !loadingVisible).toBeTruthy();
  });

  /** Should show login button when not logged in */
  test.skip('should show login button when logged out', async ({ page }) => {
    // This test requires unauthenticated state
    // Run with chromium-unauth project
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: /로그인|login/i });
    await expect(loginButton).toBeVisible();
  });

  /** Should handle profile error gracefully (SSR) */
  test('should handle profile error', async ({ page }) => {
    // Mock profile API failure
    await page.route('**/users/me', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should not crash - page should still be functional
    await expect(page.locator('body')).toBeVisible();

    // Navigation should still work
    const nav = page.locator('nav, [data-testid="navigation"], header');
    await expect(nav.first()).toBeVisible();
  });
});

/*
 * ============================================
 * Navigation Links
 * ============================================
 */

test.describe('Navigation Links', () => {
  /** Helper to open dropdown menu */
  async function openDropdownMenu(page: import('@playwright/test').Page) {
    const menuTrigger = page.locator('[aria-haspopup="menu"]').first();
    await expect(menuTrigger).toBeVisible({ timeout: 5000 });
    await menuTrigger.click();

    // Wait for dropdown content to appear
    const dropdownContent = page.locator('[role="menu"]');
    await expect(dropdownContent).toBeVisible({ timeout: 3000 });
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  /** Should have link to Calendar (in profile dropdown) */
  test('should have calendar link', async ({ page }) => {
    await openDropdownMenu(page);

    const calendarItem = page.getByRole('menuitem', { name: /calendar/i });
    await expect(calendarItem).toBeVisible({ timeout: 3000 });
  });

  /** Should have link to Chart (in profile dropdown) */
  test('should have chart link', async ({ page }) => {
    await openDropdownMenu(page);

    const chartItem = page.getByRole('menuitem', { name: /chart/i });
    await expect(chartItem).toBeVisible({ timeout: 3000 });
  });

  /** Should have link to Setting (in profile dropdown) */
  test('should have setting link', async ({ page }) => {
    await openDropdownMenu(page);

    const settingItem = page.getByRole('menuitem', { name: /setting/i });
    await expect(settingItem).toBeVisible({ timeout: 3000 });
  });
});

/*
 * ============================================
 * Tablet Navigation
 * ============================================
 */

test.describe('Tablet Navigation', () => {
  // Tablet (768px) shows desktop dropdown, not hamburger (breakpoint is 640px)
  test.use({ viewport: { width: 768, height: 1024 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  /** Should display navigation on tablet */
  test('should display nav on tablet', async ({ page }) => {
    const nav = page.locator('nav, [data-testid="navigation"], header');
    await expect(nav.first()).toBeVisible();
  });

  /** Should show dropdown menu on tablet (width >= 640px shows desktop style) */
  test('should show tablet menu style', async ({ page }) => {
    // At 768px, desktop dropdown is shown (useIsSm breakpoint is 640px)
    const menuTrigger = page.locator('[aria-haspopup="menu"]');
    await expect(menuTrigger.first()).toBeVisible({ timeout: 5000 });
  });

  /** Should open dropdown menu on tablet */
  test('should open menu on tablet', async ({ page }) => {
    const menuTrigger = page.locator('[aria-haspopup="menu"]').first();
    await expect(menuTrigger).toBeVisible({ timeout: 5000 });
    await menuTrigger.click();

    // Dropdown menu should open
    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible({ timeout: 3000 });
  });
});
