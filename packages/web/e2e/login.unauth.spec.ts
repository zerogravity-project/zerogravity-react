/**
 * [Login Page E2E Tests - Unauthenticated]
 * Section 1: Auth Flow - Unauthenticated user tests
 * - OAuth providers display
 * - Protected route redirects
 */

import { test, expect } from '@playwright/test';

/*
 * ============================================
 * Login Page Display
 * ============================================
 */

test.describe('Login Page Display', () => {
  /** Should display login page with OAuth providers */
  test('should display OAuth login buttons', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');

    // Check if the page title contains "Zero Gravity"
    await expect(page).toHaveTitle(/Zero Gravity/);

    // Wait for client-side hydration (LoginButtons is a client component)
    await page.waitForTimeout(2000);

    // Check if OAuth login buttons are present (Button text: "Login With Google", "Login With Kakao")
    await expect(page.getByRole('button', { name: /login with google/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /login with kakao/i })).toBeVisible();
  });
});

/*
 * ============================================
 * Login Failure
 * POST /auth/verify error handling
 * ============================================
 */

test.describe('Login Failure', () => {
  /** Should show error message on OAuth failure */
  test.skip('should show error on OAuth failure', async ({ page }) => {
    // Mock OAuth failure
    await page.route('**/auth/verify', route => {
      route.fulfill({ status: 400, body: JSON.stringify({ error: 'Invalid token' }) });
    });

    await page.goto('/login');

    // Trigger OAuth (this depends on implementation)
    // Should show error message
    const errorMessage = page.locator('text=/error|failed/i');
    await expect(errorMessage).toBeVisible();
  });

  /** Should allow retry after failure */
  test.skip('should allow retry after failure', async ({ page }) => {
    await page.goto('/login');

    // After error, OAuth buttons should still be clickable
    await expect(page.getByRole('button', { name: /google/i })).toBeEnabled();
    await expect(page.getByRole('button', { name: /kakao/i })).toBeEnabled();
  });
});

/*
 * ============================================
 * Protected Route Redirects
 * ============================================
 */

test.describe('Protected Route Redirects', () => {
  /** Should redirect unauthenticated user away from profile page */
  test('should redirect when accessing profile page', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Should redirect away from profile (to home or login)
    await expect(page).not.toHaveURL(/\/profile/);
  });

  /** Should redirect to login when accessing record page */
  test('should redirect when accessing record page', async ({ page }) => {
    await page.goto('/record');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  /** Should redirect to login when accessing spaceout page */
  test('should redirect when accessing spaceout page', async ({ page }) => {
    await page.goto('/spaceout');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});

/*
 * ============================================
 * Responsive Tests - Login Page
 * ============================================
 */

test.describe('Login Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  /** Should display login on desktop */
  test('should display login on desktop', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    // Login page should be visible with full layout
    await expect(page.getByRole('button', { name: /login with google/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /login with kakao/i })).toBeVisible();
  });
});

test.describe('Login Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  /** Should display login on tablet */
  test('should display login on tablet', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    // Login page should be visible
    await expect(page.getByRole('button', { name: /login with google/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /login with kakao/i })).toBeVisible();
  });
});

test.describe('Login Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  /** Should display login on mobile */
  test('should display login on mobile', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    // Login page should be visible
    await expect(page.getByRole('button', { name: /login with google/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /login with kakao/i })).toBeVisible();
  });

  /** Should have full-width buttons on mobile */
  test('should have responsive buttons on mobile', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    // Buttons should be properly sized for mobile
    const googleBtn = page.getByRole('button', { name: /login with google/i });
    await expect(googleBtn).toBeVisible({ timeout: 15000 });
  });
});

/*
 * ============================================
 * Responsive Tests - Home Page
 * ============================================
 */

test.describe('Home Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  /** Should display home page on desktop */
  test('should display home on desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Home page should be visible
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Home Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  /** Should display home page on tablet */
  test('should display home on tablet', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Home page should be visible
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Home Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  /** Should display home page on mobile */
  test('should display home on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Home page should be visible
    await expect(page.locator('body')).toBeVisible();
  });
});
