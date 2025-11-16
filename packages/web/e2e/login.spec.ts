import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should display login page with OAuth providers', async ({ page }) => {
    await page.goto('/login');

    // Check if the page title contains "ZeroGravity"
    await expect(page).toHaveTitle(/ZeroGravity/);

    // Check if OAuth login buttons are present
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /kakao/i })).toBeVisible();
  });

  test('should redirect to home page when not authenticated', async ({ page }) => {
    // Try to access protected page
    await page.goto('/profile');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
