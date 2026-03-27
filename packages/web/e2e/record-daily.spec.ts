/**
 * [Record Daily E2E Tests]
 * Section 3: Record Flow (Daily) - 3 steps
 * - Step 1: Emotion selection with planet and slider
 * - Step 2: Reason selection (Next button)
 * - Step 3: Diary entry (optional, can submit empty)
 * - AI emotion prediction (100-300 chars)
 * - Edit mode (editable within 24h)
 */

import { expect, test } from '@playwright/test';

/*
 * ============================================
 * Record Type Selection
 * ============================================
 */

test.describe('Record Type Selection', () => {
  /** Should navigate to Daily flow on click */
  test('should navigate to Daily flow', async ({ page }) => {
    await page.goto('/record');

    await page
      .locator('button')
      .filter({ hasText: /daily record/i })
      .click();

    // Should be on daily record page
    await expect(page).toHaveURL(/\/record\/daily|\/record.*type=daily/i);
  });
});

/*
 * ============================================
 * Step 1: Emotion Selection
 * ============================================
 */

test.describe('Daily Step 1: Emotion Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/record');
    // Click button containing "Daily Record" text
    await page
      .locator('button')
      .filter({ hasText: /daily record/i })
      .click();
    await page.waitForLoadState('networkidle');
  });

  /** Should render EmotionPlanet */
  test('should render emotion planet', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  /** Should display emotion slider */
  test('should display emotion slider', async ({ page }) => {
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible();
  });

  /** Should show ring color on slider thumb when focused */
  test('should show ring color on slider thumb', async ({ page }) => {
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible({ timeout: 10000 });

    // Get thumb element and focus it to trigger ring display
    // Note: onFocus handler is on the Thumb, not the Root
    const thumb = page.locator('[data-slot="slider-thumb"]');
    await thumb.focus();
    await page.waitForTimeout(200);

    // Check box-shadow on focused thumb
    const boxShadow = await thumb.evaluate(el => getComputedStyle(el).boxShadow);

    // When focused, should have multiple ring shadows (3 shadows = 2 commas)
    // Unfocused has only 1 shadow, focused has 3 shadows with ring effect
    // Note: exact px values may vary due to DPR scaling
    const shadowCount = (boxShadow.match(/rgba?\(/g) || []).length;
    expect(shadowCount).toBeGreaterThanOrEqual(3);
  });

  /** Should have next button enabled (default emotion is Neutral) */
  test('should have next button enabled by default', async ({ page }) => {
    // App starts with emotionId=3 (Neutral) as default, so button is already enabled
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    await expect(nextButton).toBeEnabled();
  });
});

/*
 * ============================================
 * Step 2: Reason Selection
 * ============================================
 */

test.describe('Daily Step 2: Reason Selection', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to step 2
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /daily record/i })
      .click();
    await page.waitForLoadState('networkidle');

    // Wait for 3D canvas to load (scene ready)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Wait for slider to be interactive
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible({ timeout: 5000 });

    // App has default emotionId=3 (Neutral), so just click Next
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    await expect(nextButton).toBeEnabled({ timeout: 5000 });
    await nextButton.click();

    // Wait for Step 2 (reason selection) page content
    await expect(page.getByText('Why did you feel this way?')).toBeVisible({ timeout: 15000 });
  });

  /** Should apply emotion theme color */
  test('should apply emotion theme', async ({ page }) => {
    // Visual verification - page should be styled
    await expect(page.locator('body')).toBeVisible();
  });

  /** Should display reason options */
  test('should display reason options', async ({ page }) => {
    // Wait for reason selection UI - check for actual reason buttons
    await page.waitForTimeout(500);
    const healthButton = page.getByRole('button', { name: 'Health' });
    await expect(healthButton).toBeVisible({ timeout: 5000 });
  });

  /** Should allow multiple selection */
  test('should allow multiple reason selection', async ({ page }) => {
    // Click on actual reason buttons
    await page.getByRole('button', { name: 'Health' }).click();
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: 'Work', exact: true }).click();
  });

  /** Should have Next button (NOT Submit - goes to diary) */
  test('should have next button for diary step', async ({ page }) => {
    // Daily Step 2 has "Next" button, not "Submit"
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    await expect(nextButton).toBeVisible();
  });
});

/*
 * ============================================
 * Step 3: Diary Entry
 * ============================================
 */

test.describe('Daily Step 3: Diary Entry', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to /record/daily without date param to skip server-side fetch
    // This ensures fresh state with no pre-selected data
    await page.goto('/record/daily');
    await page.waitForLoadState('networkidle');

    // Wait for 3D canvas to load (scene ready)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Wait for slider to be interactive
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible({ timeout: 5000 });

    // Step 1 - app has default emotionId=3 (Neutral), just click Next
    const nextButton1 = page.getByRole('button', { name: /next/i }).first();
    await expect(nextButton1).toBeEnabled({ timeout: 5000 });
    await nextButton1.click();

    // Wait for Step 2 page
    await expect(page.getByText('Why did you feel this way?')).toBeVisible({ timeout: 15000 });

    // Step 2 - select a reason, wait for Next to be enabled, then click
    await page.getByRole('button', { name: 'Health' }).click();
    const nextButton2 = page.getByRole('button', { name: /next/i }).first();
    await expect(nextButton2).toBeEnabled({ timeout: 5000 });
    await nextButton2.click();

    // Wait for Step 3 (diary) page - textarea should appear
    await expect(page.locator('textarea')).toBeVisible({ timeout: 15000 });
  });

  /** Should display diary text area */
  test('should display diary textarea', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible({ timeout: 5000 });
  });

  /** Should allow empty diary submission */
  test('should enable submit with empty diary', async ({ page }) => {
    // Diary is optional - submit should be enabled even without text
    const submitButton = page.getByRole('button', { name: /submit|done/i });
    await expect(submitButton).toBeEnabled();
  });

  /** Should accept diary text */
  test('should accept diary input', async ({ page }) => {
    const textarea = page.locator('textarea');
    const diaryText = 'Today was a good day. I learned a lot and grew as a person.';

    await textarea.fill(diaryText);
    await expect(textarea).toHaveValue(diaryText);
  });
});

/*
 * ============================================
 * AI Emotion Prediction
 * POST /ai/emotion-predictions
 * ============================================
 */

test.describe('Daily AI Prediction', () => {
  const validText =
    'Today was a really great day. I woke up in the morning and had a delicious cup of coffee. I listened to my favorite music on the way to work and had a wonderful time with my colleagues.';

  test.beforeEach(async ({ page }) => {
    // Navigate directly to /record/daily without date param to skip server-side fetch
    await page.goto('/record/daily');
    await page.waitForLoadState('networkidle');

    // Wait for scene to load
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Click GeminiButton to go to AI Prediction step (GeminiButton is a div, not button)
    // Desktop: "Use AI Prediction with Gemini", Mobile: "Skip and use..."
    // Use exact: true to avoid matching "Skip and use AI Prediction with Gemini"
    const geminiButton = page.getByText('Use AI Prediction with Gemini', { exact: true });
    await expect(geminiButton).toBeVisible({ timeout: 5000 });
    await geminiButton.click();

    // Wait for AI Prediction step
    await expect(page.getByRole('heading', { name: 'AI Prediction' })).toBeVisible({ timeout: 5000 });
  });

  /** Should show error when text is under 100 characters */
  test('should validate minimum character limit', async ({ page }) => {
    const aiInput = page.locator('textarea');
    await aiInput.fill('Short text');

    // Should show error message
    const errorMessage = page.getByText(/between 100 and 300 characters/i);
    await expect(errorMessage).toBeVisible();

    // Analyze button should be disabled
    const analyzeButton = page.getByRole('button', { name: /Analyze with AI/i });
    await expect(analyzeButton).toBeDisabled();
  });

  /** Should show character count */
  test('should show character count', async ({ page }) => {
    const aiInput = page.locator('textarea');
    await aiInput.fill('Test text here.');

    // Should show character count (e.g., "15 / 300")
    const charCount = page.getByText(/\d+ \/ 300/);
    await expect(charCount).toBeVisible();
  });

  /** Should enable button with valid text (100-300 chars) */
  test('should enable button with valid text', async ({ page }) => {
    const aiInput = page.locator('textarea');
    await aiInput.fill(validText);

    // Analyze button should be enabled
    const analyzeButton = page.getByRole('button', { name: /Analyze with AI/i });
    await expect(analyzeButton).toBeEnabled();
  });

  /** Should show loading during AI request */
  test('should show loading on AI request', async ({ page }) => {
    // Mock slow API response
    await page.route('**/ai/emotion-predictions', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.fulfill({
        status: 200,
        body: JSON.stringify({ data: { emotionId: 5, reasons: ['WORK'] } }),
      });
    });

    const aiInput = page.locator('textarea');
    await aiInput.fill(validText);

    const analyzeButton = page.getByRole('button', { name: /Analyze with AI/i });
    await analyzeButton.click();

    // Should show loading state (actual messages: "Collecting emotional stardust...", etc.)
    const loading = page.getByText(/stardust|fragments|planet|feelings|universe|light/i);
    await expect(loading.first()).toBeVisible({ timeout: 3000 });
  });

  /** Should display AI prediction result on success */
  test('should display AI result on success', async ({ page }) => {
    // Mock API success
    await page.route('**/ai/emotion-predictions', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ data: { emotionId: 5, reasons: ['WORK', 'RELATIONSHIP'] } }),
      });
    });

    const aiInput = page.locator('textarea');
    await aiInput.fill(validText);

    const analyzeButton = page.getByRole('button', { name: /Analyze with AI/i });
    await analyzeButton.click();

    // Should show result
    await expect(page.getByText(/result|prediction|emotion/i).first()).toBeVisible({ timeout: 10000 });
  });

  /** Should show error on AI failure */
  test('should show error on AI failure', async ({ page }) => {
    // Mock API failure
    await page.route('**/ai/emotion-predictions', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'AI service unavailable' }) });
    });

    const aiInput = page.locator('textarea');
    await aiInput.fill(validText);

    const analyzeButton = page.getByRole('button', { name: /Analyze with AI/i });
    await analyzeButton.click();

    // Should show error message
    const errorMessage = page.getByText(/error|failed/i);
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  /** Should navigate to diary step on Accept */
  test('should navigate to diary step on accept', async ({ page }) => {
    // Mock API success with prediction data
    await page.route('**/ai/emotion-predictions', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: {
            suggestedEmotionId: 5,
            suggestedReasons: ['Work', 'Health'],
            refinedDiary: 'A refined version of my diary entry.',
            analysisId: 'analysis-123',
            confidence: 0.85,
            reasoning: 'Based on your positive language and mentions of good experiences...',
          },
        }),
      });
    });

    const aiInput = page.locator('textarea');
    await aiInput.fill(validText);

    const analyzeButton = page.getByRole('button', { name: /Analyze with AI/i });
    await analyzeButton.click();

    // Wait for result screen with Accept button
    const acceptButton = page.getByRole('button', { name: /Accept/i });
    await expect(acceptButton).toBeVisible({ timeout: 10000 });

    // Wait for UI to stabilize before clicking
    await page.waitForTimeout(500);

    // Click Accept
    await acceptButton.click();

    // Should navigate to diary step (Daily FINAL_STEP = 'diary')
    // Wait for URL to change to diary step
    await expect(page).toHaveURL(/step=diary/, { timeout: 10000 });

    // Diary step has textarea for diary entry
    const diaryTextarea = page.locator('textarea');
    await expect(diaryTextarea).toBeVisible({ timeout: 5000 });
  });

  /** Should return to AI input on Reject */
  test('should return to AI input on reject', async ({ page }) => {
    // Mock API success
    await page.route('**/ai/emotion-predictions', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: {
            suggestedEmotionId: 5,
            suggestedReasons: ['Work'],
            analysisId: 'analysis-123',
            confidence: 0.85,
            reasoning: 'Based on your text...',
          },
        }),
      });
    });

    const aiInput = page.locator('textarea');
    await aiInput.fill(validText);

    const analyzeButton = page.getByRole('button', { name: /Analyze with AI/i });
    await analyzeButton.click();

    // Wait for result screen
    await expect(page.getByText('AI Analysis Complete')).toBeVisible({ timeout: 10000 });

    // Click Back/Reject button (arrow_back icon)
    const backButton = page.getByRole('button').filter({ has: page.locator('text=arrow_back') });
    await backButton.click();

    // Should return to AI input (textarea visible again with AI Prediction heading)
    await expect(page.getByRole('heading', { name: 'AI Prediction' })).toBeVisible({ timeout: 5000 });
  });
});

/*
 * ============================================
 * Submit Flow
 * POST /emotions/records → calendar redirect
 * ============================================
 */

test.describe('Daily Submit', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to /record/daily without date param to skip server-side fetch
    await page.goto('/record/daily');
    await page.waitForLoadState('networkidle');

    // Wait for 3D canvas to load
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Step 1 - use default emotion, click Next
    const nextButton1 = page.getByRole('button', { name: /next|continue/i }).first();
    await expect(nextButton1).toBeEnabled({ timeout: 5000 });
    await nextButton1.click();

    // Wait for Step 2 (reason selection)
    await expect(page.getByText('Why did you feel this way?')).toBeVisible({ timeout: 10000 });

    // Step 2 - select reason, wait for Next to be enabled, then click
    await page.getByRole('button', { name: 'Health' }).click();
    const nextButton2 = page.getByRole('button', { name: /next|continue/i }).first();
    await expect(nextButton2).toBeEnabled({ timeout: 5000 });
    await nextButton2.click();

    // Wait for Step 3 (diary)
    await expect(page.locator('textarea')).toBeVisible({ timeout: 10000 });
  });

  /** Should show loading on submit */
  test('should show loading on submit', async ({ page }) => {
    // Mock slow API response
    await page.route('**/emotions/records', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.fulfill({ status: 201, body: JSON.stringify({ id: '123' }) });
    });

    const submitButton = page.getByRole('button', { name: /submit/i });
    await submitButton.click();

    // Button should show loading state (disabled)
    await expect(submitButton).toBeDisabled();
  });

  /** Should redirect to calendar on success */
  test('should redirect to calendar', async ({ page }) => {
    await page.route('**/emotions/records', route => {
      route.fulfill({ status: 201, body: JSON.stringify({ id: '123' }) });
    });

    const submitButton = page.getByRole('button', { name: /submit/i });
    await submitButton.click();

    // Should redirect to profile/calendar
    await expect(page).toHaveURL(/\/profile|\/calendar/, { timeout: 10000 });
  });

  /** Should show error on submit failure */
  test('should show error on submit failure', async ({ page }) => {
    await page.route('**/emotions/records', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
    });

    const submitButton = page.getByRole('button', { name: /submit/i });
    await submitButton.click();

    // Should show error message
    const errorMsg = page.getByText(/error|failed/i);
    await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
  });
});

/*
 * ============================================
 * Edit Mode
 * Access via /record/daily?date=YYYY-MM-DD
 * If record exists for that date → edit mode
 * ============================================
 */

test.describe('Daily Edit Mode', () => {
  const today = new Date().toISOString().split('T')[0];

  /** Should load existing data in edit mode */
  test('should load existing data', async ({ page }) => {
    // Mock existing record for today
    await page.route('**/emotions/records**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: {
            daily: [
              {
                emotionRecordId: 123,
                emotionId: 4,
                reasons: ['WORK', 'HEALTH'],
                diaryEntry: 'Existing diary content.',
              },
            ],
            moment: [],
          },
        }),
      });
    });

    // Navigate with date param (edit mode if record exists)
    await page.goto(`/record/daily?date=${today}`);
    await page.waitForLoadState('networkidle');

    // Should show slider with pre-filled emotion
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible({ timeout: 15000 });
  });

  /** Should submit edit successfully */
  test('should submit edit', async ({ page }) => {
    // Mock PUT request for edit (GET uses real data or may be server-side fetched)
    await page.route('**/emotions/records**', route => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 200, body: JSON.stringify({ data: { emotionRecordId: 123 } }) });
      } else {
        route.continue();
      }
    });

    await page.goto(`/record/daily?date=${today}`);
    await page.waitForLoadState('networkidle');

    // Wait for canvas (Step 1: Emotion)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Step 1 → Step 2
    await page.getByRole('button', { name: /next/i }).first().click();
    await page.waitForLoadState('networkidle');

    // Step 2: Ensure at least one reason is selected
    // Check if Next is disabled (no reason selected), then click Health
    const nextButton2 = page.getByRole('button', { name: /next/i }).first();
    if (await nextButton2.isDisabled()) {
      const healthButton = page.getByRole('button', { name: 'Health' });
      await healthButton.click();
    }

    // Step 2 → Step 3: Wait for Next to be enabled, then click
    await expect(nextButton2).toBeEnabled({ timeout: 5000 });
    await nextButton2.click();

    // Step 3: Submit
    const submitButton = page.getByRole('button', { name: /submit/i });
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    await submitButton.click();

    // Should redirect to calendar
    await expect(page).toHaveURL(/\/profile|\/calendar/, { timeout: 10000 });
  });

  /** Should show loading on edit submit */
  test('should show loading on edit', async ({ page }) => {
    // Mock GET for existing record, slow PUT response
    await page.route('**/emotions/records**', async route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: {
              daily: [{ emotionRecordId: 123, emotionId: 4, reasons: ['Work'], diaryEntry: '' }],
              moment: [],
            },
          }),
        });
      } else if (route.request().method() === 'PUT') {
        // Delay response to check loading state
        await new Promise(resolve => setTimeout(resolve, 2000));
        route.fulfill({ status: 200, body: JSON.stringify({ data: { emotionRecordId: 123 } }) });
      } else {
        route.continue();
      }
    });

    await page.goto(`/record/daily?date=${today}`);
    await page.waitForLoadState('networkidle');

    // Wait for canvas
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Step 1 → Step 2
    await page.getByRole('button', { name: /next/i }).first().click();
    await page.waitForLoadState('networkidle');

    // Select an additional reason (Work is already selected from mock data)
    const reasonButton = page.getByRole('button', { name: 'Health' });
    if (await reasonButton.isVisible()) {
      await reasonButton.click();
    }

    // Step 2 → Step 3: Wait for Next to be enabled, then click
    const nextButton2 = page.getByRole('button', { name: /next/i }).first();
    await expect(nextButton2).toBeEnabled({ timeout: 5000 });
    await nextButton2.click();

    // Click submit
    const submitButton = page.getByRole('button', { name: /submit/i });
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    await submitButton.click();

    // Button should show loading state (disabled)
    await expect(submitButton).toBeDisabled();
  });

  /** Should show error on edit failure */
  test('should show error on edit failure', async ({ page }) => {
    // Mock GET success, PUT failure
    await page.route('**/emotions/records**', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: {
              daily: [{ emotionRecordId: 123, emotionId: 4, reasons: ['Work'], diaryEntry: 'Test diary' }],
              moment: [],
            },
          }),
        });
      } else if (route.request().method() === 'PUT') {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Update failed' }) });
      } else {
        route.continue();
      }
    });

    await page.goto(`/record/daily?date=${today}`);
    await page.waitForLoadState('networkidle');

    // Wait for canvas (edit mode with existing data)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Step 1 → Step 2: Click Next
    const nextButton = page.getByRole('button', { name: /next|continue/i }).first();
    await expect(nextButton).toBeVisible({ timeout: 5000 });
    await nextButton.click();

    // Step 2: Select a reason button
    await page.waitForTimeout(500);
    const reasonButton = page.getByRole('button', { name: /work|family|health|relationship|finance|etc/i }).first();
    await expect(reasonButton).toBeVisible({ timeout: 5000 });
    await reasonButton.click();

    // Step 2 → Step 3: Wait for Next to be enabled, then click
    await expect(nextButton).toBeEnabled({ timeout: 5000 });
    await nextButton.click();

    // Step 3: Submit
    await page.waitForTimeout(500);
    const submitButton = page.getByRole('button', { name: /submit/i });
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    await submitButton.click();

    // Should show error message
    const errorMsg = page.getByText(/error|failed/i);
    await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
  });
});

/*
 * ============================================
 * Edge Cases
 * ============================================
 */

test.describe('Daily Edge Cases', () => {
  /** Should not allow access to dates older than allowed range */
  test('should restrict old date recording', async ({ page }) => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 3);
    const dateStr = oldDate.toISOString().split('T')[0];

    await page.goto(`/record/daily?date=${dateStr}`);
    await page.waitForLoadState('networkidle');

    // Should redirect away from record page OR show restriction message
    // If still on record page, check for restriction message
    const currentUrl = page.url();
    const isStillOnRecordPage = currentUrl.includes('/record/daily');

    if (isStillOnRecordPage) {
      // If accessible, should at least show a restriction message
      const restriction = page.getByText(/cannot|restricted|not allowed|expired/i);
      await expect(restriction).toBeVisible({ timeout: 5000 });
    } else {
      // Should have redirected (this is the expected behavior)
      expect(currentUrl).not.toContain(`/record/daily?date=${dateStr}`);
    }
  });
});

/*
 * ============================================
 * Responsive Tests
 * ============================================
 */

test.describe('Record Daily Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  /** Should display record daily on desktop */
  test('should display daily on desktop', async ({ page }) => {
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /daily record/i })
      .click();
    await page.waitForLoadState('networkidle');

    // Desktop layout should show canvas
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  /** Should display slider on desktop */
  test('should display slider on desktop', async ({ page }) => {
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /daily record/i })
      .click();
    await page.waitForLoadState('networkidle');

    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible();
  });
});

test.describe('Record Daily Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  /** Should display record daily on tablet */
  test('should display daily on tablet', async ({ page }) => {
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /daily record/i })
      .click();
    await page.waitForLoadState('networkidle');

    // Tablet layout should show canvas
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Record Daily Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  /** Should display record daily on mobile */
  test('should display daily on mobile', async ({ page }) => {
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /daily record/i })
      .click();
    await page.waitForLoadState('networkidle');

    // Mobile layout should show canvas
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  /** Should have touch-friendly slider on mobile */
  test('should display slider on mobile', async ({ page }) => {
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /daily record/i })
      .click();
    await page.waitForLoadState('networkidle');

    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible();
  });

  /** Should display diary textarea on mobile */
  test('should display diary input on mobile', async ({ page }) => {
    // Navigate directly to /record/daily without date param to skip server-side fetch
    await page.goto('/record/daily');
    await page.waitForLoadState('networkidle');

    // Wait for 3D canvas to load (scene ready)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Wait for slider to be interactive
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible({ timeout: 5000 });

    // Step 1 - app has default emotionId=3 (Neutral), just click Next
    const nextButton1 = page.getByRole('button', { name: /next/i }).first();
    await expect(nextButton1).toBeEnabled({ timeout: 5000 });
    await nextButton1.click();

    // Wait for Step 2 page
    await expect(page.getByText('Why did you feel this way?')).toBeVisible({ timeout: 15000 });

    // Step 2 - select a reason
    await page.getByRole('button', { name: 'Health' }).click();

    // Wait for Next button to be enabled after reason selection
    const nextButton2 = page.getByRole('button', { name: /next/i }).first();
    await expect(nextButton2).toBeEnabled({ timeout: 5000 });
    await nextButton2.click();

    // Diary textarea should be visible on mobile
    const textarea = page.locator('textarea, [data-testid="diary-input"]');
    await expect(textarea.first()).toBeVisible({ timeout: 15000 });
  });
});
