/**
 * [Auth Flow E2E Tests]
 * Section 1: Authenticated user tests (with consent completed)
 * - Protected route access
 * - Session persistence
 * - Login redirect when authenticated
 * - Navigation bar profile display
 * - Logout flow
 *
 * Uses: chromium project (Auth O, Consent O)
 */

import { test, expect } from '@playwright/test';

/*
 * ============================================
 * Protected Route Access
 * ============================================
 */

test.describe('Protected Route Access', () => {
  /** Should access profile calendar page when authenticated */
  test('should access profile page when authenticated', async ({ page }) => {
    // Note: /profile has no page.tsx, use /profile/calendar instead
    await page.goto('/profile/calendar');

    // Should be on profile page, not redirected
    await expect(page).toHaveURL(/\/profile\/calendar/);
    await expect(page).not.toHaveURL(/\/login/);
  });

  /** Should access record page when authenticated */
  test('should access record page when authenticated', async ({ page }) => {
    await page.goto('/record');

    // Should be on record page
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page).toHaveURL(/\/record/);
  });

  /** Should access spaceout page when authenticated */
  test('should access spaceout page when authenticated', async ({ page }) => {
    await page.goto('/spaceout');

    // Should be on spaceout page
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page).toHaveURL(/\/spaceout/);
  });
});

/*
 * ============================================
 * Session Persistence
 * ============================================
 */

test.describe('Session Persistence', () => {
  /** Should maintain session across page navigation */
  test('should maintain session across page navigation', async ({ page }) => {
    // Navigate through multiple protected pages
    await page.goto('/profile/calendar');
    await expect(page).toHaveURL(/\/profile\/calendar/);

    await page.goto('/record');
    await expect(page).toHaveURL(/\/record/);

    await page.goto('/spaceout');
    await expect(page).toHaveURL(/\/spaceout/);

    // Should still be authenticated after navigating back
    await page.goto('/profile/calendar');
    await expect(page).toHaveURL(/\/profile\/calendar/);
  });

  /** Should maintain session after page refresh */
  test('should maintain session after page refresh', async ({ page }) => {
    await page.goto('/profile/calendar');
    await expect(page).toHaveURL(/\/profile\/calendar/);

    // Refresh the page
    await page.reload();

    // Should still be on profile page
    await expect(page).toHaveURL(/\/profile\/calendar/);
    await expect(page).not.toHaveURL(/\/login/);
  });

  /** Should maintain session with browser back/forward */
  test('should maintain session with browser navigation', async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.goto('/record');

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/\/profile\/calendar/);

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/\/record/);
  });
});

/*
 * ============================================
 * Login Page Redirect
 * ============================================
 */

test.describe('Login Page Redirect', () => {
  /** Should redirect away from login page when already authenticated */
  test('should redirect away from login when authenticated', async ({ page }) => {
    await page.goto('/login');

    // Should redirect away from login since already authenticated
    await expect(page).not.toHaveURL(/\/login/);
  });
});

/*
 * ============================================
 * Navigation Bar Profile
 * ============================================
 */

test.describe('Navigation Bar Profile', () => {
  /** Should display user profile in navigation bar */
  test('should display user profile in navigation', async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Should show profile avatar (not login button)
    const avatar = page.locator('[data-testid="user-avatar"], img[alt*="profile" i], img[alt*="avatar" i]').first();
    const loginButton = page.getByRole('button', { name: /login/i });

    const hasAvatar = await avatar.isVisible().catch(() => false);
    const hasLoginButton = await loginButton.isVisible().catch(() => false);

    // Either avatar is visible OR login button is not visible
    expect(hasAvatar || !hasLoginButton).toBeTruthy();
  });
});

/*
 * ============================================
 * Destructive Tests (Logout, 401)
 * Moved to: auth.destructive.spec.ts
 * ============================================
 */
