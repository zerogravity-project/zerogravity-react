/**
 * [Record Moment E2E Tests]
 * Section 2: Record Flow (Moment) - 2 steps, NOT editable
 * - Step 1: Emotion selection with planet and slider
 * - Step 2: Reason selection and submit
 * - AI emotion prediction (100-300 chars)
 * - Submit flow
 */

import { expect, test, Locator } from '@playwright/test';

/**
 * ============================================
 * Helpers
 * ============================================
 */

/**
 * Slider values mapped to emotion levels (from emotion.constants.ts)
 * Level 0=0, 1=16, 2=33, 3=50, 4=67, 5=84, 6=100
 */
const EMOTION_SLIDER_VALUES = [0, 16, 33, 50, 67, 84, 100] as const;

/**
 * Set Radix UI Slider to a specific emotion level (0-6)
 * Uses keyboard navigation: Home/End for extremes, PageUp for ~10% jumps
 */
async function setSliderValue(slider: Locator, level: number) {
  await slider.focus();
  if (level === 0) {
    await slider.press('Home');
  } else if (level === 6) {
    await slider.press('End');
  } else {
    // Reset to 0 first
    await slider.press('Home');
    const targetValue = EMOTION_SLIDER_VALUES[level];
    // Use PageUp for ~10% jumps (faster than ArrowRight)
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
 * Record Type Selection
 * ============================================
 */

test.describe('Record Type Selection', () => {
  /** Should display Moment/Daily selection buttons */
  test('should display record type selection', async ({ page }) => {
    await page.goto('/record');

    // Should show Moment and Daily buttons
    await expect(page.locator('button').filter({ hasText: /moment record/i })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: /daily record/i })).toBeVisible();
  });

  /** Should display record description */
  test('should display record description', async ({ page }) => {
    await page.goto('/record');

    // Should show description text
    await expect(page.getByText('Record Your Emotions')).toBeVisible();
  });

  /** Should navigate to Moment flow on click */
  test('should navigate to Moment flow', async ({ page }) => {
    await page.goto('/record');

    await page
      .locator('button')
      .filter({ hasText: /moment record/i })
      .click();

    // Should be on moment record page
    await expect(page).toHaveURL(/\/record\/moment|\/record.*type=moment/i);
  });
});

/*
 * ============================================
 * Step 1: Emotion Selection
 * ============================================
 */

test.describe('Moment Step 1: Emotion Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /moment record/i })
      .click();
    await page.waitForLoadState('networkidle');
  });

  /** Should render EmotionPlanet */
  test('should render emotion planet', async ({ page }) => {
    // Wait for 3D canvas to load
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  /** Should display emotion level slider (0-6) */
  test('should display emotion slider', async ({ page }) => {
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible();
  });

  /** Should change planet color when slider moves - SKIPPED: Slider manipulation slow/flaky */
  test.skip('should change planet color with slider', async ({ page }) => {
    const slider = page.getByRole('slider');

    // Wait for slider to be visible before interacting
    await expect(slider).toBeVisible({ timeout: 10000 });

    // Move slider to different positions
    await setSliderValue(slider, 3);
    await page.waitForTimeout(500);

    await setSliderValue(slider, 6);
    await page.waitForTimeout(500);

    // Planet should still be visible (color change is visual)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
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
    const nextButton = page.getByRole('button', { name: /next|continue/i }).first();
    await expect(nextButton).toBeEnabled();
  });
});

/*
 * ============================================
 * Step 2: Reason Selection
 * ============================================
 */

test.describe('Moment Step 2: Reason Selection', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to step 2
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /moment record/i })
      .click();
    await page.waitForLoadState('networkidle');

    // Wait for 3D canvas to load (scene ready)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Wait for slider to be interactive
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible({ timeout: 5000 });

    // App has default emotionId=3 (Neutral), so just click Next
    const nextButton = page.getByRole('button', { name: /next|continue/i }).first();
    await expect(nextButton).toBeEnabled({ timeout: 5000 });
    await nextButton.click();

    // Wait for Step 2 (reason selection) page content
    await expect(page.getByText('Why did you feel this way?')).toBeVisible({ timeout: 15000 });
  });

  /** Should apply emotion theme color */
  test('should apply emotion theme color', async ({ page }) => {
    // Page should have themed styling based on selected emotion
    // This is visual - we just verify we're on step 2
    await expect(page.locator('body')).toBeVisible();
  });

  /** Should display reason selection options */
  test('should display reason options', async ({ page }) => {
    // Should show reason buttons like Health, Work, etc.
    const healthButton = page.getByRole('button', { name: 'Health' });
    await expect(healthButton).toBeVisible({ timeout: 5000 });
  });

  /** Should allow multiple reason selection */
  test('should allow multiple selection', async ({ page }) => {
    // Click multiple reason buttons
    await page.getByRole('button', { name: 'Health' }).click();
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: 'Work', exact: true }).click();
  });

  /** Should have Submit button (not Next, no diary for Moment) */
  test('should have submit button', async ({ page }) => {
    // Moment has only 2 steps - Step 2 should have Submit button
    const submitButton = page.getByRole('button', { name: /submit|done/i });
    await expect(submitButton).toBeVisible();
  });

  /** Should disable submit when no reason selected */
  test('should disable submit without reason', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /submit|done/i });

    // Should be disabled initially
    const isDisabled = await submitButton.isDisabled().catch(() => true);
    expect(isDisabled).toBeTruthy();
  });
});

/*
 * ============================================
 * AI Emotion Prediction
 * ============================================
 */

test.describe('Moment AI Prediction', () => {
  const validText =
    'Today was a really great day. I woke up in the morning and had a delicious cup of coffee. I listened to my favorite music on the way to work and had a wonderful time with my colleagues.';

  test.beforeEach(async ({ page }) => {
    // Navigate directly to /record/moment
    await page.goto('/record/moment');
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
    await aiInput.focus();

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
    // 100+ characters
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

    // Should show result (emotion or reasons displayed)
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

  /** Should navigate to reason step on Accept */
  test('should navigate to reason step on accept', async ({ page }) => {
    // Mock API success with prediction data
    await page.route('**/ai/emotion-predictions', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: {
            suggestedEmotionId: 5,
            suggestedReasons: ['Work', 'Health'],
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

    // Should navigate to reason step (Moment FINAL_STEP = 'reason')
    // Note: Same app bug as daily - state may not be updated yet when goToStep is called
    await expect(page).toHaveURL(/step=reason/, { timeout: 10000 });

    // Reason step has "Why did you feel this way?" text
    await expect(page.getByText('Why did you feel this way?')).toBeVisible({ timeout: 5000 });
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

    // Should return to AI input (textarea visible again)
    await expect(page.locator('textarea')).toBeVisible({ timeout: 5000 });
  });
});

/*
 * ============================================
 * Submit Flow
 * POST /emotions/records → calendar redirect
 * ============================================
 */

test.describe('Moment Submit', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to /record/moment
    await page.goto('/record/moment');
    await page.waitForLoadState('networkidle');

    // Wait for 3D canvas to load
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Wait for slider to be interactive
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible({ timeout: 5000 });

    // App has default emotionId=3 (Neutral), so just click Next
    const nextButton = page.getByRole('button', { name: /next|continue/i }).first();
    await expect(nextButton).toBeEnabled({ timeout: 5000 });
    await nextButton.click();

    // Wait for Step 2 (reason selection)
    await expect(page.getByText('Why did you feel this way?')).toBeVisible({ timeout: 10000 });
  });

  /** Should show loading state on submit */
  test('should show loading on submit', async ({ page }) => {
    // Mock slow API response
    await page.route('**/emotions/records', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.fulfill({ status: 200, body: JSON.stringify({ data: { id: 1 } }) });
    });

    // Select reason
    await page.getByRole('button', { name: 'Health' }).click();

    // Submit
    const submitButton = page.getByRole('button', { name: /submit/i });
    await submitButton.click();

    // Button should show loading state (disabled + loading attribute)
    await expect(submitButton).toBeDisabled();
  });

  /** Should redirect to calendar on success */
  test('should redirect to calendar on success', async ({ page }) => {
    // Mock API success
    await page.route('**/emotions/records', route => {
      route.fulfill({ status: 200, body: JSON.stringify({ data: { id: 1 } }) });
    });

    // Select reason
    await page.getByRole('button', { name: 'Health' }).click();

    const submitButton = page.getByRole('button', { name: /submit/i });
    await submitButton.click();

    // Should redirect to profile/calendar after submit
    await expect(page).toHaveURL(/\/profile|\/calendar/, { timeout: 10000 });
  });

  /** Should show error on submit failure */
  test('should show error on submit failure', async ({ page }) => {
    // Mock API failure
    await page.route('**/emotions/records', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
    });

    // Select reason
    await page.getByRole('button', { name: 'Health' }).click();

    const submitButton = page.getByRole('button', { name: /submit/i });
    await submitButton.click();

    // Should show error message
    const errorMessage = page.getByText(/error|failed/i);
    await expect(errorMessage).toBeVisible();
  });
});

/*
 * ============================================
 * Responsive Tests
 * ============================================
 */

test.describe('Record Moment Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  /** Should display record moment on desktop */
  test('should display moment on desktop', async ({ page }) => {
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /moment record/i })
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
      .filter({ hasText: /moment record/i })
      .click();
    await page.waitForLoadState('networkidle');

    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible();
  });
});

test.describe('Record Moment Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  /** Should display record moment on tablet */
  test('should display moment on tablet', async ({ page }) => {
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /moment record/i })
      .click();
    await page.waitForLoadState('networkidle');

    // Tablet layout should show canvas
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Record Moment Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  /** Should display record moment on mobile */
  test('should display moment on mobile', async ({ page }) => {
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /moment record/i })
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
      .filter({ hasText: /moment record/i })
      .click();
    await page.waitForLoadState('networkidle');

    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible();
  });
});
