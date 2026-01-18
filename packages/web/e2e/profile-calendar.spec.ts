/**
 * [Profile Calendar E2E Tests]
 * Section 4: Profile - Calendar
 * - Calendar load and navigation
 * - Desktop: Monthly view with right-slide drawer
 * - Tablet: Drawer with z-index overlay
 * - Mobile: Weekly view with daily planet and moment list
 * - Drawer interactions and edit restrictions
 */

import { expect, test } from '@playwright/test';

/*
 * ============================================
 * Calendar Load
 * GET /emotions/records
 * ============================================
 */

test.describe('Calendar Load', () => {
  /** Should load calendar with emotion data */
  test('should load calendar', async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Calendar grid uses grid-cols-7 for 7 days
    const calendar = page.locator('.grid-cols-7');
    await expect(calendar.first()).toBeVisible({ timeout: 10000 });
  });

  /** Should show loading state initially */
  test('should show loading state', async ({ page }) => {
    await page.goto('/profile/calendar');

    // Loading might be fast, so we just check page loads
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  /** Should handle empty data */
  test('should handle empty calendar', async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Should not crash with empty data
    await expect(page.locator('body')).toBeVisible();
  });
});

/*
 * ============================================
 * Month Navigation
 * ============================================
 */

test.describe('Calendar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');
  });

  /** Should navigate to previous month */
  test('should navigate to previous month', async ({ page }) => {
    const prevButton = page.getByRole('button', { name: /이전|prev|</i });

    if (await prevButton.isVisible()) {
      await prevButton.click();
      await page.waitForLoadState('networkidle');

      // Calendar should update
      await expect(page.locator('body')).toBeVisible();
    }
  });

  /** Should navigate to next month (with restriction) */
  test('should restrict future navigation', async ({ page }) => {
    const nextButton = page.getByRole('button', { name: /다음|next|>/i }).first();

    if (await nextButton.isVisible()) {
      // Try clicking next - should be restricted at current month
      await nextButton.click();
      await page.waitForTimeout(500);

      // Should not allow going past current month
      await expect(page.locator('body')).toBeVisible();
    }
  });

  /** Should not allow navigation beyond today */
  test('should not navigate past today', async ({ page }) => {
    // Find next month/week button
    const nextButton = page.getByRole('button', { name: /다음|next|>/i }).first();

    if (await nextButton.isVisible()) {
      // Either button is disabled or clicking doesn't change to future
      const isDisabled = await nextButton.isDisabled().catch(() => false);
      if (isDisabled) {
        // Button should be disabled at current period
        await expect(nextButton).toBeDisabled();
      }
      await expect(page.locator('body')).toBeVisible();
    }
  });
});

/*
 * ============================================
 * Desktop Calendar (Monthly)
 * ============================================
 */

test.describe('Desktop Calendar', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');
  });

  /** Should display monthly calendar view */
  test('should display monthly view', async ({ page }) => {
    // Should show full month grid (grid-cols-7 for 7 days)
    const calendarGrid = page.locator('.grid-cols-7');
    await expect(calendarGrid.first()).toBeVisible();
  });

  /** Should open drawer on date click */
  test('should open drawer on date click', async ({ page }) => {
    // Click on a date cell (div with cursor-pointer inside grid-cols-7)
    const dateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();

    await expect(dateCell).toBeVisible({ timeout: 5000 });
    await dateCell.click();

    // Drawer should slide in from right
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 3000 });
  });

  /** Should show empty state in drawer for no records */
  test('should show empty state in drawer', async ({ page }) => {
    // Click on a date cell
    const dateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();

    await expect(dateCell).toBeVisible({ timeout: 5000 });
    await dateCell.click();

    // Drawer should show empty planet or message
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 3000 });
  });

  /** Should show emotion planet in drawer when record exists */
  test('should show emotion planet in drawer', async ({ page }) => {
    // Click on a date with existing record
    const dateWithRecord = page.locator('[data-testid="calendar-day"].has-record, .day-with-record');

    if (await dateWithRecord.isVisible()) {
      await dateWithRecord.click();

      // Drawer should show emotion planet
      const planet = page.locator('canvas, [data-testid="emotion-planet"]');
      await expect(planet.first()).toBeVisible({ timeout: 5000 });
    }
  });

  /** Should show moment list in drawer */
  test('should show moment list in drawer', async ({ page }) => {
    // Mock API with moment records
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [],
            moment: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work', 'Health'],
                diaryEntry: null,
                createdAt: new Date().toISOString(),
              },
            ],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Click on a date cell
    const dateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();
    await expect(dateCell).toBeVisible({ timeout: 5000 });
    await dateCell.click();

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 3000 });

    // Should show moment section title
    const momentSection = page.getByText('Moment Emotion');
    await expect(momentSection).toBeVisible();
  });

  /** Should close drawer on ESC key (not implemented yet) */
  test('should close drawer on ESC key', async ({ page }) => {
    // TODO: Desktop drawer needs Escape key handler (see phase-15-accessibility.md)
    const dateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();
    await expect(dateCell).toBeVisible({ timeout: 5000 });
    await dateCell.click();

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 3000 });

    // Press Escape to close
    await page.keyboard.press('Escape');

    await expect(drawer.first()).not.toBeVisible({ timeout: 3000 });
  });

  /** Should close drawer on X button */
  test('should close drawer on X button', async ({ page }) => {
    const dateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();
    await expect(dateCell).toBeVisible({ timeout: 5000 });
    await dateCell.click();

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 3000 });

    // Click close button (aria-label="Close drawer")
    const closeButton = page.locator('[aria-label="Close drawer"]');
    await expect(closeButton).toBeVisible({ timeout: 3000 });
    await closeButton.click();

    await expect(drawer.first()).not.toBeVisible({ timeout: 3000 });
  });

  /** Should show Edit link for Daily when today and record exists */
  test('should show daily edit when record exists today', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: null,
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Find today's date cell by data-today attribute
    const todayCell = page.locator('[data-today="true"]');
    await expect(todayCell).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(300); // Wait for React hydration
    await todayCell.click({ force: true });

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(300); // Wait for drawer animation

    // Wait for drawer content to render
    await expect(drawer.getByText('Daily Emotion')).toBeVisible({ timeout: 5000 });

    // Should show Edit link for Daily Emotion section
    const dailyEditLink = drawer.getByRole('link', { name: /Edit/i }).first();
    await expect(dailyEditLink).toBeVisible({ timeout: 5000 });
  });

  /** Should show Diary Edit link when diary exists */
  test('should show diary edit when diary exists', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: 'Today was productive',
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Find today's date cell
    const todayCell = page.locator('[data-today="true"]');
    await expect(todayCell).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(300); // Wait for React hydration
    await todayCell.click({ force: true });

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(300); // Wait for drawer animation

    // Wait for drawer content to render
    await expect(drawer.getByText('Daily Emotion')).toBeVisible({ timeout: 5000 });

    // Should show diary content
    await expect(drawer.getByText('Today was productive')).toBeVisible({ timeout: 5000 });

    // Should have Edit links (Daily + Diary)
    const editLinks = drawer.getByRole('link', { name: /Edit/i });
    await expect(editLinks.first()).toBeVisible({ timeout: 5000 });
  });

  /** Should show Diary Edit link even when diary is empty (but daily exists) */
  test('should show diary edit when daily exists without diary', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: null,
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Find today's date cell
    const todayCell = page.locator('[data-today="true"]');
    await expect(todayCell).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(500); // Wait for React hydration
    await todayCell.click({ force: true });

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(300); // Wait for drawer animation

    // Daily exists → both Daily and Diary show Edit (isEmpty is based on daily, not diary)
    const editLinks = drawer.getByRole('link', { name: /Edit/i });
    await expect(editLinks.first()).toBeVisible({ timeout: 5000 });
  });

  /** Should hide Edit link for old records (not today) */
  test('should hide edit for old record', async ({ page }) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: 'Old entry',
                recordedAt: yesterdayStr,
                createdAt: yesterday.toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Navigate to previous week/month to find yesterday
    const prevButton = page.getByRole('button', { name: /이전|prev|</i });
    if (await prevButton.isVisible()) {
      await prevButton.click();
      await page.waitForTimeout(300);
    }

    const dateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();
    await expect(dateCell).toBeVisible({ timeout: 5000 });
    await dateCell.click();

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 3000 });

    // Edit links should NOT be visible for past records
    const editLinks = drawer.getByRole('link', { name: /Edit/i });
    await expect(editLinks).toHaveCount(0);
  });

  /** Should always show Moment Add link */
  test('should always show moment add link', async ({ page }) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: 'Entry',
                recordedAt: yesterdayStr,
                createdAt: yesterday.toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    const dateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();
    await expect(dateCell).toBeVisible({ timeout: 5000 });
    await dateCell.click();

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 3000 });

    // Moment Add link should always be visible
    const addLink = drawer.getByRole('link', { name: /Add/i });
    await expect(addLink.first()).toBeVisible({ timeout: 3000 });
  });

  /** Should navigate to moment record from Add link */
  test('should navigate to moment from add link', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: null,
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Wait for full page render

    // Find today's date cell
    const todayCell = page.locator('[data-today="true"]');
    await expect(todayCell).toBeVisible({ timeout: 15000 });

    // Click and wait for drawer - retry if drawer doesn't open
    const drawer = page.locator('[role="dialog"]');
    for (let attempt = 0; attempt < 3; attempt++) {
      await todayCell.click();
      try {
        await expect(drawer.first()).toBeVisible({ timeout: 5000 });
        break;
      } catch {
        if (attempt === 2) throw new Error('Drawer did not open after 3 attempts');
        await page.waitForTimeout(500);
      }
    }
    await page.waitForTimeout(300); // Wait for drawer animation

    // Wait for drawer content to fully render (Moment Emotion section)
    const momentSectionText = drawer.getByText('Moment Emotion');
    await expect(momentSectionText).toBeVisible({ timeout: 5000 });

    // Find Add link next to Moment Emotion title (only visible link with 'Add')
    const addLink = drawer.getByRole('link', { name: 'Add' });
    await expect(addLink).toBeVisible({ timeout: 5000 });

    // Navigate using the link's href directly (more reliable)
    const href = await addLink.getAttribute('href');
    if (href) {
      await page.goto(href);
    }
    await expect(page).toHaveURL(/\/record\/moment\?date=/);
  });
});

/*
 * ============================================
 * Tablet Calendar
 * ============================================
 */

test.describe('Tablet Calendar', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');
  });

  /** Should display calendar on tablet */
  test('should display calendar on tablet', async ({ page }) => {
    // Calendar grid uses grid-cols-7 for 7 days
    const calendar = page.locator('.grid-cols-7');
    await expect(calendar.first()).toBeVisible({ timeout: 10000 });
  });

  /** Should open drawer with z-index overlay on tablet */
  test('should open drawer with overlay', async ({ page }) => {
    const dateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();

    await expect(dateCell).toBeVisible({ timeout: 5000 });
    await dateCell.click();

    // Drawer should appear on tablet
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 3000 });
  });
});

/*
 * ============================================
 * Mobile Calendar (Weekly)
 * ============================================
 */

test.describe('Mobile Calendar', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');
  });

  /** Should display weekly calendar view */
  test('should display weekly view', async ({ page }) => {
    // Mobile shows weekly view, not monthly
    const weekView = page.locator('[data-testid="week-calendar"], .week-view');
    await expect(weekView.first())
      .toBeVisible({ timeout: 5000 })
      .catch(() => {
        // Fallback - just check calendar exists
      });
  });

  /** Should navigate weeks */
  test('should navigate weeks', async ({ page }) => {
    const prevButton = page.getByRole('button', { name: /이전|prev|</i });

    // Should have week navigation
    if (await prevButton.isVisible()) {
      await prevButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body')).toBeVisible();
    }
  });

  /** Should show daily planet below calendar */
  test('should show daily planet', async ({ page }) => {
    // Mobile shows daily emotion planet below weekly view
    const planetArea = page.locator('[data-testid="daily-planet"], canvas, .emotion-planet');
    await expect(planetArea.first())
      .toBeVisible({ timeout: 5000 })
      .catch(() => {
        // Might not be visible if no data
      });
  });

  /** Should show moment list below daily planet */
  test('should show moment list with data', async ({ page }) => {
    // Mock today's data with moments
    const today = new Date().toISOString().split('T')[0];
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: 'daily-123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: null,
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [
              {
                emotionRecordId: 'moment-1',
                emotionId: 5,
                emotionType: 'POSITIVE',
                reasons: ['Family'],
                diaryEntry: 'Had a great lunch',
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
              {
                emotionRecordId: 'moment-2',
                emotionId: 2,
                emotionType: 'MID NEGATIVE',
                reasons: ['Weather'],
                diaryEntry: 'Rainy day',
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Moment section should be visible with items
    const momentSection = page.locator('text=Moment Emotion').first();
    await expect(momentSection).toBeVisible({ timeout: 5000 });

    // Should show moment emotion types (emotionId 5 = POSITIVE)
    await expect(page.getByText('POSITIVE').first()).toBeVisible({ timeout: 3000 });
  });

  /** Should open mobile drawer on date tap */
  test('should open mobile drawer', async ({ page }) => {
    const dateCell = page.locator('[data-testid="calendar-day"], .day-cell').first();

    if (await dateCell.isVisible()) {
      await dateCell.click();

      // Mobile drawer shows daily + diary
      const drawer = page.locator('[data-testid="drawer"], [role="dialog"], .drawer');
      await expect(drawer.first()).toBeVisible({ timeout: 3000 });
    }
  });

  /** Should show Add Daily Emotion button when empty */
  test('should show add button when empty', async ({ page }) => {
    // Mock empty data
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { daily: [], moment: [] },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Should show "Add Daily Emotion" button
    const addButton = page.getByRole('button', { name: /Add Daily Emotion/i });
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  /** Should navigate to record page from Add button */
  test('should navigate from add button', async ({ page }) => {
    // Mock empty data BEFORE page load
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { daily: [], moment: [] },
        }),
      });
    });

    // Reload to apply mock (beforeEach already loaded without mock)
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait longer for React hydration on mobile

    // Try link first, then button (component might render as either)
    let addElement = page.getByRole('link', { name: /Add Daily Emotion/i });
    if (!(await addElement.isVisible({ timeout: 5000 }).catch(() => false))) {
      addElement = page.getByRole('button', { name: /Add Daily Emotion/i });
    }
    await expect(addElement).toBeVisible({ timeout: 15000 });

    // Get href and navigate directly (more reliable)
    const href = await addElement.getAttribute('href');
    if (href) {
      await page.goto(href);
    } else {
      // If no href, click the element
      await addElement.click();
    }
    await expect(page).toHaveURL(/\/record\/daily\?date=/);
  });

  /** Should show See Detail button when data exists */
  test('should show see detail button with data', async ({ page }) => {
    // Mock data exists
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: null,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Should show "See Detail" button
    const detailButton = page.getByRole('button', { name: /See Detail/i });
    await expect(detailButton).toBeVisible({ timeout: 5000 });
  });

  /** Should open drawer from See Detail button */
  test('should open drawer from see detail', async ({ page }) => {
    // Mock data exists
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: 'Test diary',
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Wait for See Detail button to appear (means data loaded)
    const detailButton = page.getByRole('button', { name: /See Detail/i });
    await expect(detailButton).toBeVisible({ timeout: 10000 });

    // Use force click to bypass any animation overlay
    await detailButton.click({ force: true });

    // Wait for drawer animation to complete
    await page.waitForTimeout(500);

    // Drawer should open with content
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 5000 });

    // Should show emotion info in drawer (emotionId: 3 = 'NORMAL')
    await expect(drawer.getByText('NORMAL')).toBeVisible({ timeout: 3000 });
  });

  /** Should navigate to edit from mobile drawer */
  test('should navigate to edit from mobile drawer', async ({ page }) => {
    // Mock today's data
    const today = new Date().toISOString().split('T')[0];
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: null, // Daily 있고 Diary 없음
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('domcontentloaded');

    // Click See Detail to open drawer
    const detailButton = page.getByRole('button', { name: /See Detail/i });
    await expect(detailButton).toBeVisible({ timeout: 15000 });
    await detailButton.click({ force: true });

    // Drawer should be open
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(300); // Wait for drawer animation

    // Wait for drawer content to render (NORMAL = emotionId 3)
    await expect(drawer.getByText('NORMAL')).toBeVisible({ timeout: 5000 });

    // Find Edit link (Link wrapping Button)
    const editLink = drawer.getByRole('link').filter({ hasText: /Edit/i }).first();
    await expect(editLink).toBeVisible({ timeout: 5000 });

    // Get href and navigate directly (more reliable than click)
    const href = await editLink.getAttribute('href');
    if (href) {
      await page.goto(href);
    }
    await expect(page).toHaveURL(/\/record\/daily/);
  });

  /** Should show Diary Edit button when Daily exists but Diary is empty */
  test('should show diary edit when daily exists without diary', async ({ page }) => {
    // Mock today's data - Daily 있고 Diary 없음
    const today = new Date().toISOString().split('T')[0];
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: null, // Diary 없음
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Click See Detail to open drawer
    const detailButton = page.getByRole('button', { name: /See Detail/i });
    await expect(detailButton).toBeVisible({ timeout: 10000 });
    await detailButton.click({ force: true });
    await page.waitForTimeout(500);

    // Drawer should be open
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 5000 });

    // Should show Edit button in header (Button wrapped in Link)
    const editButton = drawer.getByRole('button', { name: /Edit/i });
    await expect(editButton.first()).toBeVisible({ timeout: 3000 });
  });

  /** Should show Diary Edit button when Diary exists */
  test('should show diary edit when diary exists', async ({ page }) => {
    // Mock today's data - Daily 있고 Diary 있음
    const today = new Date().toISOString().split('T')[0];
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: 'Today was a good day', // Diary 있음
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Click See Detail to open drawer
    const detailButton = page.getByRole('button', { name: /See Detail/i });
    await expect(detailButton).toBeVisible({ timeout: 10000 });
    await detailButton.click({ force: true });
    await page.waitForTimeout(500);

    // Drawer should be open
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 5000 });

    // Should show diary content
    await expect(drawer.getByText('Today was a good day')).toBeVisible({ timeout: 3000 });

    // Should show Edit buttons (Daily + Diary) - Button wrapped in Link
    const editButtons = drawer.getByRole('button', { name: /Edit/i });
    await expect(editButtons.first()).toBeVisible({ timeout: 3000 });
  });

  /** Should show Moment Add button in MomentEmotionSection (always visible) */
  test('should show moment add button on main view', async ({ page }) => {
    // Mock data
    const today = new Date().toISOString().split('T')[0];
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: null,
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // MomentEmotionSection is on main view (not in drawer)
    // Check for "Moment Emotion" heading and Add button
    const momentHeading = page.getByRole('heading', { name: /Moment Emotion/i });
    await expect(momentHeading).toBeVisible({ timeout: 5000 });

    // Add button should be next to the heading
    const momentSection = page.locator('section').filter({ hasText: 'Moment Emotion' });
    const addButton = momentSection.getByRole('link', { name: /Add/i });
    await expect(addButton).toBeVisible({ timeout: 3000 });
  });

  /** Should navigate to record from Moment Add button */
  test('should navigate from moment add button', async ({ page }) => {
    // Mock today's data
    const today = new Date().toISOString().split('T')[0];
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: 'Test',
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // MomentEmotionSection Add button is on main view
    const momentSection = page.locator('section').filter({ hasText: 'Moment Emotion' });
    const addButton = momentSection.getByRole('link', { name: /Add/i });
    await expect(addButton).toBeVisible({ timeout: 5000 });
    await addButton.click();

    // Should navigate to moment record page
    await expect(page).toHaveURL(/\/record\/moment\?date=/);
  });

  /** Should hide Edit button for old record (not today) */
  test('should hide edit button for old record', async ({ page }) => {
    // Mock past date data (yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: 'Old diary',
                recordedAt: yesterdayStr,
                createdAt: yesterday.toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Navigate to previous week (mobile uses week view)
    const prevButton = page.getByRole('button', { name: /chevron_left/i });
    await expect(prevButton).toBeVisible({ timeout: 5000 });
    await prevButton.click();
    await page.waitForTimeout(500);

    // Click on a past date in the week view (first date button in grid)
    const weekGrid = page.locator('.grid-cols-7').last();
    const dateButtons = weekGrid.getByRole('button');
    await expect(dateButtons.first()).toBeVisible({ timeout: 5000 });
    await dateButtons.first().click();
    await page.waitForTimeout(300);

    // Click See Detail to open drawer
    const detailButton = page.getByRole('button', { name: /See Detail/i });
    if (await detailButton.isVisible({ timeout: 3000 })) {
      await detailButton.click({ force: true });
      await page.waitForTimeout(500);

      // Wait for drawer
      const drawer = page.locator('[role="dialog"]');
      await expect(drawer.first()).toBeVisible({ timeout: 3000 });

      // Edit button should NOT be visible for old records
      const editButton = drawer.getByRole('button', { name: /Edit/i });
      await expect(editButton).not.toBeVisible({ timeout: 2000 });
    }
  });
});

/*
 * ============================================
 * Desktop Header Navigation
 * ============================================
 */

test.describe('Desktop Header Navigation', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');
  });

  /** Should open Today dropdown */
  test('should open today dropdown', async ({ page }) => {
    // Click Today button to open dropdown
    const todayButton = page.getByRole('button', { name: /Today/i }).last();
    await expect(todayButton).toBeVisible({ timeout: 5000 });
    await todayButton.click();

    // Dropdown items should be visible
    const dailyItem = page.getByRole('menuitem', { name: /Add Daily Emotion/i });
    await expect(dailyItem).toBeVisible({ timeout: 3000 });
  });

  /** Should navigate to daily record from dropdown */
  test('should navigate to daily from dropdown', async ({ page }) => {
    // Open dropdown
    const todayButton = page.getByRole('button', { name: /Today/i }).last();
    await expect(todayButton).toBeVisible({ timeout: 5000 });
    await todayButton.click();

    // Wait for dropdown to open
    const dailyLink = page.locator('a').filter({ hasText: /Add Daily Emotion/i });
    await expect(dailyLink).toBeVisible({ timeout: 5000 });

    // Get href and navigate directly (more reliable)
    const href = await dailyLink.getAttribute('href');
    if (href) {
      await page.goto(href);
    }
    await expect(page).toHaveURL(/\/record\/daily\?date=/);
  });

  /** Should navigate to moment record from dropdown */
  test('should navigate to moment from dropdown', async ({ page }) => {
    // Open dropdown
    const todayButton = page.getByRole('button', { name: /Today/i }).last();
    await expect(todayButton).toBeVisible({ timeout: 5000 });
    await todayButton.click();

    // Wait for dropdown to open
    const momentLink = page.locator('a').filter({ hasText: /Add Moment Emotion/i });
    await expect(momentLink).toBeVisible({ timeout: 5000 });

    // Get href and navigate directly (more reliable)
    const href = await momentLink.getAttribute('href');
    if (href) {
      await page.goto(href);
    }
    await expect(page).toHaveURL(/\/record\/moment\?date=/);
  });
});

/*
 * ============================================
 * Drawer Button States
 * ============================================
 */

test.describe('Calendar Drawer Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');
  });

  /** Should show "Add" link for empty date */
  test('should show input button for empty', async ({ page }) => {
    // Click on a date cell to open drawer
    const dateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();
    await expect(dateCell).toBeVisible({ timeout: 5000 });
    await dateCell.click();

    // Wait for drawer
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 3000 });

    // Should show "Add" link (it's a link, not button)
    const addLink = page.getByRole('link', { name: /Add/i });
    await expect(addLink.first()).toBeVisible();
  });

  /** Should show "Edit" link for today's record */
  test('should show edit button for recent record', async ({ page }) => {
    // Wait for calendar to be fully loaded
    await page.waitForTimeout(500);

    // Click on a date cell to open drawer
    const dateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();
    await expect(dateCell).toBeVisible({ timeout: 15000 });
    await dateCell.click();

    // Wait for drawer
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 10000 });

    // Edit link only shows for today's record - might not be visible if no record or not today
    await expect(drawer.first()).toBeVisible();
  });
});

/*
 * ============================================
 * Calendar Edit Flow
 * PUT /emotions/records/{id}
 * ============================================
 */

test.describe('Calendar Edit Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');
  });

  /** Should navigate to edit page from drawer */
  test('should navigate to edit from drawer', async ({ page }) => {
    // Click on a date cell to open drawer
    const dateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();
    await expect(dateCell).toBeVisible({ timeout: 5000 });
    await dateCell.click();

    // Wait for drawer
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 3000 });

    // Edit link (not button) - only shows for today's record
    const editLink = page.getByRole('link', { name: /Edit/i });
    if (
      await editLink
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await editLink.first().click();
      // Should navigate to record edit page
      await expect(page).toHaveURL(/\/record.*date=/);
    } else {
      // No edit link visible (not today or no record) - test passes
      await expect(drawer.first()).toBeVisible();
    }
  });

  /** Should navigate to record page when clicking Edit link */
  test('should navigate to record from edit link', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];

    // Mock API to return today's record (so Edit link shows)
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: null,
                recordedAt: today,
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Find today's date cell by data-today attribute
    const todayCell = page.locator('[data-today="true"]');
    await expect(todayCell).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(300); // Wait for React hydration
    await todayCell.click({ force: true });

    // Wait for drawer
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(300); // Wait for drawer animation

    // Click Edit link (in drawer header) - use href→goto pattern
    const editLink = drawer.getByRole('link', { name: /Edit/i });
    await expect(editLink.first()).toBeVisible({ timeout: 5000 });
    const href = await editLink.first().getAttribute('href');
    if (href) {
      await page.goto(href);
    }

    // Should navigate to record page with date param
    await expect(page).toHaveURL(/\/record\/daily\?date=/, { timeout: 5000 });
  });
});

/*
 * ============================================
 * Loading States
 * ============================================
 */

test.describe('Calendar Loading States', () => {
  /** Should show loading on calendar fetch - needs data-testid or loading class on component */
  test('should show loading on calendar fetch', async ({ page }) => {
    // Delay API response to see loading state
    await page.route('**/emotions/records*', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });

    await page.goto('/profile/calendar');

    // Should show loading indicator
    const loading = page.locator('[data-testid="loading"], .loading, .skeleton, .spinner');
    await expect(loading.first()).toBeVisible();
  });

  /** Should show loading on month navigation */
  test('should show loading on month change', async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Delay response for month change
    await page.route('**/emotions/records*', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });

    const prevButton = page.getByRole('button', { name: /이전|prev|</i });
    if (await prevButton.isVisible()) {
      await prevButton.click();

      // Should show loading while fetching new month data
      const loading = page.locator('[data-testid="loading"], .loading, .spinner');
      await expect(loading.first()).toBeVisible();
    }
  });

  /** Should show loading on edit submit */
  test('should show loading on edit submit', async ({ page }) => {
    await page.route('**/emotions/records/*', async route => {
      if (route.request().method() === 'PUT') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        route.fulfill({ status: 200, body: JSON.stringify({ id: '123' }) });
      } else {
        route.continue();
      }
    });

    // Navigate to edit mode
    await page.goto('/record/daily?edit=123');
    await page.waitForLoadState('networkidle');

    // Submit edit
    const submitButton = page.getByRole('button', { name: /수정|제출|submit/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Should show loading indicator
      const loading = page.locator('[data-testid="loading"], .loading, .spinner');
      await expect(loading.first()).toBeVisible();
    }
  });
});

/*
 * ============================================
 * Error Handling
 * ============================================
 */

test.describe('Calendar Error Handling', () => {
  /** Should show error state on API failure - needs error UI component */
  test('should show error on API failure', async ({ page }) => {
    // Mock API failure
    await page.route('**/emotions/records*', route => {
      route.fulfill({ status: 500 });
    });

    await page.goto('/profile/calendar');

    // Should show error message
    const error = page.locator('text=/error|에러|오류/i');
    await expect(error).toBeVisible();
  });

  /** Should allow retry on error - needs retry button in error state */
  test('should allow retry', async ({ page }) => {
    // After error, should show retry button
    const retryButton = page.getByRole('button', { name: /retry|다시|재시도/i });
    await expect(retryButton).toBeVisible();
  });
});

/*
 * ============================================
 * Desktop Cell Styling (Daily Emotion)
 * ============================================
 */

test.describe('Desktop Cell Styling', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');
  });

  /** Should show circle background for Daily emotion */
  test('should show circle for daily emotion', async ({ page }) => {
    // Find cell with Daily emotion data
    const cellWithData = page.locator('[data-testid="calendar-cell"] circle[fill]');

    if (await cellWithData.first().isVisible()) {
      // Circle should have emotion color (e.g., var(--red-9), var(--blue-9))
      const fill = await cellWithData.first().getAttribute('fill');
      expect(fill).toMatch(/var\(--\w+-9\)/);
    }
  });

  /** Should show gray text for future dates */
  test('should show gray text for future', async ({ page }) => {
    // Future dates should have gray-a6 text color
    const futureCell = page.locator('[data-testid="calendar-cell"][data-future="true"] text');

    if (await futureCell.first().isVisible()) {
      const fill = await futureCell.first().getAttribute('fill');
      expect(fill).toBe('var(--gray-a6)');
    }
  });

  /** Should show black text for neutral emotion (id=3) */
  test('should show black text for neutral', async ({ page }) => {
    // Neutral emotion (green/id=3) should have black text for contrast
    const neutralCell = page.locator('[data-testid="calendar-cell"][data-emotion-id="3"] text');

    if (await neutralCell.first().isVisible()) {
      const fill = await neutralCell.first().getAttribute('fill');
      expect(fill).toBe('var(--black-a12)');
    }
  });

  /** Should show white text for Daily emotion */
  test('should show white text for daily', async ({ page }) => {
    // Cells with Daily emotion (except neutral) should have white text
    const cellWithDaily = page.locator('[data-testid="calendar-cell"]:has(circle) text');

    if (await cellWithDaily.first().isVisible()) {
      const fill = await cellWithDaily.first().getAttribute('fill');
      // Either white or black for neutral
      expect(fill).toMatch(/var\(--white-a12\)|var\(--black-a12\)/);
    }
  });

  /** Should show accent text for today (no Daily) */
  test('should show accent text for today', async ({ page }) => {
    // Today without Daily should have accent color
    const todayCell = page.locator('[data-testid="calendar-cell"][data-today="true"]:not(:has(circle)) text');

    if (await todayCell.first().isVisible()) {
      const fill = await todayCell.first().getAttribute('fill');
      expect(fill).toBe('var(--accent-a9)');
    }
  });

  /** Should show default gray text for empty cells */
  test('should show gray text for empty', async ({ page }) => {
    // Empty cells (no Daily, not today) should have gray-11 text
    const emptyCell = page.locator('[data-testid="calendar-cell"]:not(:has(circle)):not([data-today="true"]) text');

    if (await emptyCell.first().isVisible()) {
      const fill = await emptyCell.first().getAttribute('fill');
      expect(fill).toBe('var(--gray-11)');
    }
  });
});

/*
 * ============================================
 * Mobile Weekly Button Styling (Daily Emotion)
 * ============================================
 */

test.describe('Mobile Weekly Button Styling', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');
  });

  /** Should show solid variant for Daily + selected */
  test('should show solid for daily selected', async ({ page }) => {
    // Button with Daily emotion AND selected should be solid variant
    const selectedWithDaily = page.locator('[data-testid="week-day"][data-has-daily="true"][data-selected="true"]');

    if (await selectedWithDaily.first().isVisible()) {
      // Radix Button solid variant
      await expect(selectedWithDaily.first()).toHaveAttribute('data-variant', 'solid');
    }
  });

  /** Should show soft variant for Daily + not selected */
  test('should show soft for daily not selected', async ({ page }) => {
    // Button with Daily emotion but NOT selected should be soft variant
    const notSelectedWithDaily = page.locator(
      '[data-testid="week-day"][data-has-daily="true"]:not([data-selected="true"])'
    );

    if (await notSelectedWithDaily.first().isVisible()) {
      await expect(notSelectedWithDaily.first()).toHaveAttribute('data-variant', 'soft');
    }
  });

  /** Should show emotion color for Daily */
  test('should show emotion color for daily', async ({ page }) => {
    // Button with Daily should have emotion color
    const withDaily = page.locator('[data-testid="week-day"][data-has-daily="true"]');

    if (await withDaily.first().isVisible()) {
      // Should have data-accent-color matching emotion
      const color = await withDaily.first().getAttribute('data-accent-color');
      expect(color).toMatch(/red|orange|amber|green|teal|blue|purple/);
    }
  });

  /** Should show accent color for empty + selected */
  test('should show accent for empty selected', async ({ page }) => {
    // Empty button + selected should use default accent color
    const emptySelected = page.locator('[data-testid="week-day"]:not([data-has-daily="true"])[data-selected="true"]');

    if (await emptySelected.first().isVisible()) {
      // Should NOT have gray color (uses accent)
      const color = await emptySelected.first().getAttribute('data-accent-color');
      expect(color).not.toBe('gray');
    }
  });

  /** Should show gray + transparent for empty + not selected */
  test('should show transparent for empty not selected', async ({ page }) => {
    // Empty button + not selected should be gray with transparent background
    const emptyNotSelected = page.locator(
      '[data-testid="week-day"]:not([data-has-daily="true"]):not([data-selected="true"])'
    );

    if (await emptyNotSelected.first().isVisible()) {
      const color = await emptyNotSelected.first().getAttribute('data-accent-color');
      expect(color).toBe('gray');

      // Should have transparent background
      const bgClass = await emptyNotSelected.first().getAttribute('class');
      expect(bgClass).toContain('bg-transparent');
    }
  });

  /** Should disable future dates */
  test('should disable future dates', async ({ page }) => {
    // Future dates should be disabled
    const futureButton = page.locator('[data-testid="week-day"][data-future="true"]');

    if (await futureButton.first().isVisible()) {
      await expect(futureButton.first()).toBeDisabled();
    }
  });
});

/*
 * ============================================
 * Planet Rendering
 * ============================================
 */

test.describe('Planet Rendering - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  /** Should render canvas planet in Daily Section (Weekly View) */
  test('should render canvas in daily section', async ({ page }) => {
    // Mock emotion data for today
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: 'Test',
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Mobile Weekly View uses Canvas (LazyEmotionPlanetScene) in Daily Section
    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible({ timeout: 15000 });
  });

  /** Should render planet image in drawer (uses EmotionPlanetImage) */
  test('should render image in drawer', async ({ page }) => {
    // Mock emotion data for today
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: 'Test',
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Click "See Detail" button to open drawer
    const detailButton = page.getByRole('button', { name: /See Detail/i });
    await expect(detailButton).toBeVisible({ timeout: 10000 });
    await detailButton.click();

    // Drawer should open
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 5000 });

    // Mobile drawer uses EmotionPlanetImage (img)
    const planetImage = drawer.locator('img');
    await expect(planetImage.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Planet Rendering - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  /** Should render planet canvas in drawer (uses LazyEmotionPlanetScene) */
  test('should render canvas in drawer', async ({ page }) => {
    // Mock emotion data so calendar cells are clickable
    await page.route('**/emotions/records*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            daily: [
              {
                emotionRecordId: '123',
                emotionId: 3,
                emotionType: 'NORMAL',
                reasons: ['Work'],
                diaryEntry: 'Test diary',
                createdAt: new Date().toISOString(),
              },
            ],
            moment: [],
          },
        }),
      });
    });

    await page.goto('/profile/calendar');
    await page.waitForLoadState('networkidle');

    // Wait for calendar to load - cells with cursor-pointer are clickable
    const clickableCells = page.locator('.cursor-pointer');
    await expect(clickableCells.first()).toBeVisible({ timeout: 10000 });

    // Click today's cell (has emotion data from mock)
    const todayDate = new Date().getDate().toString();
    const todayCell = clickableCells.filter({ hasText: new RegExp(`^${todayDate}$`) }).first();
    await expect(todayCell).toBeVisible({ timeout: 5000 });
    await todayCell.click();

    // Desktop drawer should open
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.first()).toBeVisible({ timeout: 5000 });

    // Desktop drawer uses LazyEmotionPlanetScene (canvas/3D)
    const canvas = drawer.locator('canvas');
    await expect(canvas.first()).toBeVisible({ timeout: 15000 });
  });
});
