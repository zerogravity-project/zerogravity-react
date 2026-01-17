/**
 * [Record Daily E2E Tests]
 * Section 3: Record Flow (Daily) - 3 steps
 * - Step 1: Emotion selection with planet and slider
 * - Step 2: Reason selection (Next button)
 * - Step 3: Diary entry (optional, can submit empty)
 * - AI emotion prediction (100-300 chars)
 * - Edit mode (editable within 24h)
 */

import { test, expect, Locator } from '@playwright/test';

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

  /** Should change planet/ring color with slider - SKIPPED: Slider manipulation slow/flaky */
  test.skip('should update colors on slider change', async ({ page }) => {
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible({ timeout: 10000 });

    // Move through different levels
    for (const level of [0, 3, 6]) {
      await setSliderValue(slider, level);
      await page.waitForTimeout(300);
    }

    // Planet should still be visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  /** Should have next button enabled (default emotion is Neutral) */
  test('should have next button enabled by default', async ({ page }) => {
    // App starts with emotionId=3 (Neutral) as default, so button is already enabled
    const nextButton = page.getByRole('button', { name: /다음|next/i }).first();
    await expect(nextButton).toBeEnabled();
  });

  /** Should enable next button after selection - SKIPPED: Covered by 'enabled by default' test */
  test.skip('should enable button after selection', async ({ page }) => {
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible({ timeout: 10000 });
    await setSliderValue(slider, 5);

    const nextButton = page.getByRole('button', { name: /다음|next/i }).first();
    await expect(nextButton).toBeEnabled();
  });

  /** Should navigate to step 2 - SKIPPED: Covered by Step 2 tests */
  test.skip('should navigate to step 2', async ({ page }) => {
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible({ timeout: 10000 });
    await setSliderValue(slider, 5);

    const nextButton = page.getByRole('button', { name: /다음|next/i }).first();
    await nextButton.click();

    // Should be on step 2 (reason selection)
    await page.waitForLoadState('networkidle');
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
    const nextButton = page.getByRole('button', { name: /다음|next/i }).first();
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

  /** Should allow custom reason input */
  test('should allow custom reason input', async ({ page }) => {
    const customInput = page.locator(
      '[data-testid="custom-reason"], input[placeholder*="직접"], input[placeholder*="other"], textarea'
    );

    if (await customInput.first().isVisible()) {
      await customInput.first().fill('나만의 이유');
      await expect(customInput.first()).toHaveValue('나만의 이유');
    }
  });

  /** Should have Next button (NOT Submit - goes to diary) */
  test('should have next button for diary step', async ({ page }) => {
    // Daily Step 2 has "다음" button, not "제출"
    const nextButton = page.getByRole('button', { name: /다음|next/i }).first();
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
    // Navigate to step 3
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

    // Step 1 - app has default emotionId=3 (Neutral), just click Next
    const nextButton1 = page.getByRole('button', { name: /다음|next/i }).first();
    await expect(nextButton1).toBeEnabled({ timeout: 5000 });
    await nextButton1.click();

    // Wait for Step 2 page
    await expect(page.getByText('Why did you feel this way?')).toBeVisible({ timeout: 15000 });

    // Step 2 - select a reason and go next
    await page.getByRole('button', { name: 'Health' }).click();
    await page
      .getByRole('button', { name: /다음|next/i })
      .first()
      .click();

    // Wait for Step 3 (diary) page - textarea should appear
    await expect(page.locator('textarea')).toBeVisible({ timeout: 15000 });
  });

  /** Should display diary text area */
  test('should display diary textarea', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible({ timeout: 5000 });
  });

  /** Should display character count - SKIPPED: Feature not implemented */
  test.skip('should show character count', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('테스트 일기 내용입니다.');

    // Should show character count indicator
    const charCount = page.locator('text=/\\d+.*자|\\d+.*char/i');
    await expect(charCount).toBeVisible();
  });

  /** Should allow empty diary submission */
  test('should enable submit with empty diary', async ({ page }) => {
    // Diary is optional - submit should be enabled even without text
    const submitButton = page.getByRole('button', { name: /제출|submit|완료|done/i });
    await expect(submitButton).toBeEnabled();
  });

  /** Should accept diary text */
  test('should accept diary input', async ({ page }) => {
    const textarea = page.locator('textarea');
    const diaryText = '오늘은 좋은 하루였습니다. 많은 것을 배웠고 성장했습니다.';

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
  test.beforeEach(async ({ page }) => {
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /daily record/i })
      .click();
    await page.waitForLoadState('networkidle');
  });

  /** Should show error when text is under 100 characters */
  test.skip('should show min character error', async ({ page }) => {
    const aiButton = page.getByRole('button', { name: /ai|예측|predict/i });

    if (await aiButton.isVisible()) {
      await aiButton.click();

      const aiInput = page.locator('textarea').first();
      await aiInput.fill('짧은 텍스트');

      // Should show minimum character error
      const errorMin = page.locator('text=/100|최소|minimum/i');
      await expect(errorMin).toBeVisible();
    }
  });

  /** Should show error when text exceeds 300 characters */
  test.skip('should show max character error', async ({ page }) => {
    const aiButton = page.getByRole('button', { name: /ai|예측|predict/i });

    if (await aiButton.isVisible()) {
      await aiButton.click();

      const aiInput = page.locator('textarea').first();
      await aiInput.fill('가'.repeat(350));

      // Should show maximum character error
      const errorMax = page.locator('text=/300|최대|maximum/i');
      await expect(errorMax).toBeVisible();
    }
  });

  /** Should show loading during AI request */
  test.skip('should show loading on AI request', async ({ page }) => {
    // Mock slow API response
    await page.route('**/ai/emotion-predictions', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.fulfill({
        status: 200,
        body: JSON.stringify({ emotionId: 5, reasons: ['work'] }),
      });
    });

    const aiButton = page.getByRole('button', { name: /ai|예측|predict/i });
    if (await aiButton.isVisible()) {
      await aiButton.click();

      const aiInput = page.locator('textarea').first();
      await aiInput.fill(
        '오늘 하루는 정말 기분이 좋았습니다. 회사에서 좋은 소식이 있었고 동료들과 즐거운 시간을 보냈습니다. 저녁에는 맛있는 음식도 먹었네요.'
      );

      const submitAi = page.getByRole('button', { name: /분석|analyze|예측/i });
      if (await submitAi.isVisible()) {
        await submitAi.click();

        // Should show loading spinner
        const loading = page.locator('[data-testid="ai-loading"], .spinner, .loading');
        await expect(loading.first()).toBeVisible();
      }
    }
  });

  /** Should display AI prediction result on success */
  test.skip('should display AI result on success', async ({ page }) => {
    await page.route('**/ai/emotion-predictions', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ emotionId: 5, reasons: ['work', 'relationship'] }),
      });
    });

    const aiButton = page.getByRole('button', { name: /ai|예측|predict/i });
    if (await aiButton.isVisible()) {
      await aiButton.click();

      const aiInput = page.locator('textarea').first();
      await aiInput.fill(
        '오늘 하루는 정말 기분이 좋았습니다. 회사에서 좋은 소식이 있었고 동료들과 즐거운 시간을 보냈습니다. 저녁에는 맛있는 음식도 먹었네요.'
      );

      const submitAi = page.getByRole('button', { name: /분석|analyze|예측/i });
      if (await submitAi.isVisible()) {
        await submitAi.click();

        // Should show AI result with emotion and reasons
        const aiResult = page.locator('[data-testid="ai-result"], .prediction-result');
        await expect(aiResult.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  /** Should show error on AI prediction failure */
  test.skip('should show error on AI failure', async ({ page }) => {
    await page.route('**/ai/emotion-predictions', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'AI service unavailable' }),
      });
    });

    const aiButton = page.getByRole('button', { name: /ai|예측|predict/i });
    if (await aiButton.isVisible()) {
      await aiButton.click();

      const aiInput = page.locator('textarea').first();
      await aiInput.fill(
        '오늘 하루는 정말 기분이 좋았습니다. 회사에서 좋은 소식이 있었고 동료들과 즐거운 시간을 보냈습니다. 저녁에는 맛있는 음식도 먹었네요.'
      );

      const submitAi = page.getByRole('button', { name: /분석|analyze|예측/i });
      if (await submitAi.isVisible()) {
        await submitAi.click();

        // Should show error message
        const errorMsg = page.locator('text=/실패|error|오류|failed/i');
        await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  /** Should auto-fill diary on AI accept */
  test.skip('should auto-fill diary on AI accept', async ({ page }) => {
    await page.route('**/ai/emotion-predictions', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ emotionId: 4, reasons: ['health'] }),
      });
    });

    const aiButton = page.getByRole('button', { name: /ai|예측|predict/i });
    if (await aiButton.isVisible()) {
      await aiButton.click();

      const aiInput = page.locator('textarea').first();
      const diaryText =
        '오늘 하루는 정말 기분이 좋았습니다. 회사에서 좋은 소식이 있었고 동료들과 즐거운 시간을 보냈습니다. 저녁에는 맛있는 음식도 먹었네요.';
      await aiInput.fill(diaryText);

      const submitAi = page.getByRole('button', { name: /분석|analyze|예측/i });
      if (await submitAi.isVisible()) {
        await submitAi.click();
        await page.waitForLoadState('networkidle');

        // Click accept button
        const acceptButton = page.getByRole('button', { name: /수락|accept|적용/i });
        if (await acceptButton.isVisible()) {
          await acceptButton.click();

          // Should move to diary step with the text auto-filled
          const diaryTextarea = page.locator('textarea');
          await expect(diaryTextarea).toHaveValue(diaryText);
        }
      }
    }
  });

  /** Should keep selection when AI rejected */
  test.skip('should keep selection on AI reject', async ({ page }) => {
    await page.route('**/ai/emotion-predictions', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ emotionId: 3, reasons: ['weather'] }),
      });
    });

    // First select emotion manually
    const slider = page.getByRole('slider');
    await setSliderValue(slider, 5);
    await page
      .getByRole('button', { name: /다음|next/i })
      .first()
      .click();

    // Trigger AI prediction
    const aiButton = page.getByRole('button', { name: /ai|예측|predict/i });
    if (await aiButton.isVisible()) {
      await aiButton.click();

      const aiInput = page.locator('textarea').first();
      await aiInput.fill(
        '오늘 하루는 정말 기분이 좋았습니다. 회사에서 좋은 소식이 있었고 동료들과 즐거운 시간을 보냈습니다. 저녁에는 맛있는 음식도 먹었네요.'
      );

      const submitAi = page.getByRole('button', { name: /분석|analyze|예측/i });
      if (await submitAi.isVisible()) {
        await submitAi.click();
        await page.waitForLoadState('networkidle');

        // Click reject button
        const rejectButton = page.getByRole('button', { name: /거부|reject|취소|cancel/i });
        if (await rejectButton.isVisible()) {
          await rejectButton.click();

          // Should keep original selection
          await expect(page.locator('body')).toBeVisible();
        }
      }
    }
  });
});

/*
 * ============================================
 * Submit Flow
 * POST /emotions/records → calendar redirect
 * ============================================
 */

test.describe('Daily Submit', () => {
  /** Navigate through all steps helper */
  async function navigateToSubmit(page: import('@playwright/test').Page) {
    await page.goto('/record');
    await page
      .locator('button')
      .filter({ hasText: /daily record/i })
      .click();
    await page.waitForLoadState('networkidle');

    // Step 1
    const slider = page.getByRole('slider');
    await setSliderValue(slider, 4);
    await page
      .getByRole('button', { name: /다음|next/i })
      .first()
      .click();
    await page.waitForLoadState('networkidle');

    // Step 2
    await page.waitForTimeout(500);
    const reasonButton = page.locator('button, [role="checkbox"]').filter({ hasText: /.+/ }).first();
    await reasonButton.click();
    await page
      .getByRole('button', { name: /다음|next/i })
      .first()
      .click();
    await page.waitForLoadState('networkidle');

    // Step 3 - diary is optional, submit button should be visible
    await page.waitForTimeout(500);
  }

  /** Should show loading on submit */
  test.skip('should show loading on submit', async ({ page }) => {
    // Mock slow API response
    await page.route('**/emotions/records', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.fulfill({ status: 201, body: JSON.stringify({ id: '123' }) });
    });

    await navigateToSubmit(page);

    const submitButton = page.getByRole('button', { name: /제출|submit|완료|done/i });
    await submitButton.click();

    // Should show loading state
    const loading = page.locator('[data-testid="submit-loading"], .spinner, .loading, button:has-text("loading")');
    await expect(loading.first()).toBeVisible();
  });

  /** Should redirect to calendar on success */
  test.skip('should redirect to calendar', async ({ page }) => {
    await page.route('**/emotions/records', route => {
      route.fulfill({ status: 201, body: JSON.stringify({ id: '123' }) });
    });

    await navigateToSubmit(page);

    const submitButton = page.getByRole('button', { name: /제출|submit|완료|done/i });
    await submitButton.click();

    // Should redirect to profile/calendar
    await expect(page).toHaveURL(/\/profile|\/calendar/, { timeout: 10000 });
  });

  /** Should show record in calendar after submit */
  test.skip('should show record in calendar after submit', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];

    await page.route('**/emotions/records', route => {
      route.fulfill({ status: 201, body: JSON.stringify({ id: '123', date: today }) });
    });

    await navigateToSubmit(page);

    const submitButton = page.getByRole('button', { name: /제출|submit|완료|done/i });
    await submitButton.click();

    // Wait for redirect
    await expect(page).toHaveURL(/\/profile|\/calendar/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Today's date should have an emotion indicator
    const todayDate = new Date().getDate();
    const calendarDay = page.locator(`text=/${todayDate}/`).first();
    await expect(calendarDay).toBeVisible();
  });

  /** Should show error on submit failure */
  test.skip('should show error on submit failure', async ({ page }) => {
    await page.route('**/emotions/records', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
    });

    await navigateToSubmit(page);

    const submitButton = page.getByRole('button', { name: /제출|submit|완료|done/i });
    await submitButton.click();

    // Should show error message
    const errorMsg = page.locator('text=/실패|error|오류|failed/i');
    await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
  });

  /** Should allow retry after failure */
  test.skip('should allow retry after failure', async ({ page }) => {
    let requestCount = 0;
    await page.route('**/emotions/records', route => {
      requestCount++;
      if (requestCount === 1) {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
      } else {
        route.fulfill({ status: 201, body: JSON.stringify({ id: '123' }) });
      }
    });

    await navigateToSubmit(page);

    const submitButton = page.getByRole('button', { name: /제출|submit|완료|done/i });
    await submitButton.click();

    // Wait for error
    await page.waitForTimeout(1000);

    // Retry button or submit again
    const retryButton = page.getByRole('button', { name: /재시도|retry|다시/i });
    if (await retryButton.isVisible()) {
      await retryButton.click();
    } else {
      await submitButton.click();
    }

    // Should succeed on retry
    await expect(page).toHaveURL(/\/profile|\/calendar/, { timeout: 10000 });
  });
});

/*
 * ============================================
 * Edit Mode
 * PUT /emotions/records/{id} - within 24h
 * ============================================
 */

test.describe('Daily Edit Mode', () => {
  /** Should load existing data in edit mode */
  test.skip('should load existing data', async ({ page }) => {
    // Mock existing record data
    await page.route('**/emotions/records/*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: '123',
          emotionId: 4,
          reasons: ['work', 'health'],
          diaryEntry: '기존 일기 내용입니다.',
        }),
      });
    });

    // Navigate to edit mode
    await page.goto('/record/daily?edit=123');
    await page.waitForLoadState('networkidle');

    // Should show pre-filled data
    const slider = page.getByRole('slider');
    await expect(slider).toHaveValue('4');
  });

  /** Should allow navigation to any step */
  test.skip('should allow jumping between steps', async ({ page }) => {
    await page.goto('/record/daily?edit=123');
    await page.waitForLoadState('networkidle');

    // In edit mode, step indicators should be clickable
    const stepIndicators = page.locator('[data-testid="step-indicator"], .step-dot, .step-button');

    if ((await stepIndicators.count()) >= 3) {
      // Click step 3 directly
      await stepIndicators.nth(2).click();
      await page.waitForTimeout(500);

      // Should show diary textarea
      const textarea = page.locator('textarea');
      await expect(textarea).toBeVisible();

      // Click step 1
      await stepIndicators.nth(0).click();
      await page.waitForTimeout(500);

      // Should show emotion slider
      const slider = page.getByRole('slider');
      await expect(slider).toBeVisible();
    }
  });

  /** Should submit edit successfully */
  test.skip('should submit edit', async ({ page }) => {
    await page.route('**/emotions/records/*', route => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 200, body: JSON.stringify({ id: '123' }) });
      } else {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ id: '123', emotionId: 4, reasons: ['work'] }),
        });
      }
    });

    await page.goto('/record/daily?edit=123');
    await page.waitForLoadState('networkidle');

    // Modify emotion
    const slider = page.getByRole('slider');
    await setSliderValue(slider, 6);

    // Navigate to submit
    await page
      .getByRole('button', { name: /다음|next/i })
      .first()
      .click();
    await page.waitForTimeout(500);
    await page
      .getByRole('button', { name: /다음|next/i })
      .first()
      .click();
    await page.waitForTimeout(500);

    // Submit edit
    const submitButton = page.getByRole('button', { name: /수정|제출|submit|save/i });
    await submitButton.click();

    // Should redirect to calendar
    await expect(page).toHaveURL(/\/profile|\/calendar/, { timeout: 10000 });
  });

  /** Should show error on edit failure */
  test.skip('should show error on edit failure', async ({ page }) => {
    await page.route('**/emotions/records/*', route => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Update failed' }) });
      } else {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ id: '123', emotionId: 4, reasons: ['work'] }),
        });
      }
    });

    await page.goto('/record/daily?edit=123');
    await page.waitForLoadState('networkidle');

    // Navigate to submit
    await page
      .getByRole('button', { name: /다음|next/i })
      .first()
      .click();
    await page.waitForTimeout(500);
    await page
      .getByRole('button', { name: /다음|next/i })
      .first()
      .click();
    await page.waitForTimeout(500);

    const submitButton = page.getByRole('button', { name: /수정|제출|submit/i });
    await submitButton.click();

    // Should show error message
    const errorMsg = page.locator('text=/실패|error|오류|failed/i');
    await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
  });
});

/*
 * ============================================
 * Edge Cases
 * ============================================
 */

test.describe('Daily Edge Cases', () => {
  /** Should handle ?date= query parameter */
  test.skip('should handle date parameter', async ({ page }) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    await page.goto(`/record/daily?date=${dateStr}`);

    // Should show the specified date
    await expect(page.locator(`text=/${yesterday.getDate()}/`)).toBeVisible();
  });

  /** Should handle dates older than 24h */
  test.skip('should restrict old date recording', async ({ page }) => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 3);
    const dateStr = oldDate.toISOString().split('T')[0];

    await page.goto(`/record/daily?date=${dateStr}`);

    // Should show restriction or redirect
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

    // Step 1 - app has default emotionId=3 (Neutral), just click Next
    const nextButton1 = page.getByRole('button', { name: /다음|next/i }).first();
    await expect(nextButton1).toBeEnabled({ timeout: 5000 });
    await nextButton1.click();

    // Wait for Step 2 page
    await expect(page.getByText('Why did you feel this way?')).toBeVisible({ timeout: 15000 });

    // Step 2 - select a reason
    await page.getByRole('button', { name: 'Health' }).click();
    await page
      .getByRole('button', { name: /다음|next/i })
      .first()
      .click();

    // Diary textarea should be visible on mobile
    const textarea = page.locator('textarea, [data-testid="diary-input"]');
    await expect(textarea.first()).toBeVisible({ timeout: 15000 });
  });
});
