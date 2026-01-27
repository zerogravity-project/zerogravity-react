/**
 * [chartUtils tests]
 * Unit tests for chart display utilities
 */

import {
  calculateTooltipLeftPosition,
  emotionValueToLabel,
  formatTooltipDate,
  formatTooltipDateFromIndex,
  generateEmotionRangeHtml,
  getChartConfig,
} from '@/app/(protected)/profile/chart/_utils/chartUtils';

describe('chartUtils', () => {
  describe('emotionValueToLabel', () => {
    /** Returns correct label for each emotion value (0-6) */
    it('returns correct label for each emotion value (0-6)', () => {
      expect(emotionValueToLabel(0)).toBe('VERY NEGATIVE');
      expect(emotionValueToLabel(1)).toBe('NEGATIVE');
      expect(emotionValueToLabel(2)).toBe('MID NEGATIVE');
      expect(emotionValueToLabel(3)).toBe('NORMAL');
      expect(emotionValueToLabel(4)).toBe('MID POSITIVE');
      expect(emotionValueToLabel(5)).toBe('POSITIVE');
      expect(emotionValueToLabel(6)).toBe('VERY POSITIVE');
    });

    /** Returns empty string for out of range values */
    it('returns empty string for out of range values', () => {
      expect(emotionValueToLabel(-1)).toBe('');
      expect(emotionValueToLabel(7)).toBe('');
      expect(emotionValueToLabel(100)).toBe('');
    });

    /** Returns empty string for non-integer values */
    it('returns empty string for non-integer values', () => {
      expect(emotionValueToLabel(2.5)).toBe('');
      expect(emotionValueToLabel(0.1)).toBe('');
    });
  });

  describe('generateEmotionRangeHtml', () => {
    /** Returns single colored span for integer values */
    it('returns single colored span for integer values', () => {
      const result = generateEmotionRangeHtml(3);
      expect(result).toContain('NORMAL');
      expect(result).toMatch(/<span style="color: #[0-9A-Fa-f]+;">NORMAL<\/span>/);
      expect(result).not.toContain(' - ');
    });

    /** Returns range span for fractional values */
    it('returns range span for fractional values', () => {
      const result = generateEmotionRangeHtml(2.5);
      expect(result).toContain('MID NEGATIVE');
      expect(result).toContain('NORMAL');
      expect(result).toContain(' - ');
    });

    /** Handles boundary values */
    it('handles boundary values', () => {
      const result0 = generateEmotionRangeHtml(0);
      expect(result0).toContain('VERY NEGATIVE');
      expect(result0).not.toContain(' - ');

      const result6 = generateEmotionRangeHtml(6);
      expect(result6).toContain('VERY POSITIVE');
      expect(result6).not.toContain(' - ');
    });

    /** Handles edge case fractional at boundaries */
    it('handles edge case fractional at boundaries', () => {
      const result = generateEmotionRangeHtml(5.5);
      expect(result).toContain('POSITIVE');
      expect(result).toContain('VERY POSITIVE');
    });
  });

  describe('calculateTooltipLeftPosition', () => {
    const containerWidth = 400;
    const tooltipWidth = 100;

    /** Returns centered position when tooltip fits */
    it('returns centered position when tooltip fits', () => {
      const result = calculateTooltipLeftPosition(200, tooltipWidth, containerWidth);
      expect(result).toBe(200);
    });

    /** Clamps to left boundary when tooltip would overflow left */
    it('clamps to left boundary when tooltip would overflow left', () => {
      // caretX = 30, tooltipHalfWidth = 50, so 30 - 50 = -20 (overflow)
      const result = calculateTooltipLeftPosition(30, tooltipWidth, containerWidth);
      expect(result).toBe(50); // tooltipHalfWidth
    });

    /** Clamps to right boundary when tooltip would overflow right */
    it('clamps to right boundary when tooltip would overflow right', () => {
      // caretX = 380, tooltipHalfWidth = 50, so 380 + 50 = 430 > 400 (overflow)
      const result = calculateTooltipLeftPosition(380, tooltipWidth, containerWidth);
      expect(result).toBe(350); // containerWidth - tooltipHalfWidth
    });

    it('handles edge case where caret is exactly at left edge', () => {
      const result = calculateTooltipLeftPosition(0, tooltipWidth, containerWidth);
      expect(result).toBe(50);
    });

    it('handles edge case where caret is exactly at right edge', () => {
      const result = calculateTooltipLeftPosition(400, tooltipWidth, containerWidth);
      expect(result).toBe(350);
    });

    it('handles very wide tooltip', () => {
      const wideTooltip = 300;
      const result = calculateTooltipLeftPosition(200, wideTooltip, containerWidth);
      expect(result).toBe(200);
    });

    it('handles zero width container', () => {
      // When container width is 0, right boundary check fails: 100 + 50 > 0
      // So it clamps to containerWidth - tooltipHalfWidth = 0 - 50 = -50
      const result = calculateTooltipLeftPosition(100, tooltipWidth, 0);
      expect(result).toBe(-50);
    });
  });

  describe('getChartConfig', () => {
    describe('week period', () => {
      it('returns week labels and max 7', () => {
        const config = getChartConfig('week', '2024-01-01');
        expect(config?.labels).toEqual(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']);
        expect(config?.max).toBe(7);
      });
    });

    describe('month period', () => {
      it('returns day labels for 31-day month', () => {
        const config = getChartConfig('month', '2024-01-01');
        expect(config?.labels?.length).toBe(32); // 31 days + next month's 1st
        expect(config?.labels?.[0]).toBe('1');
        expect(config?.labels?.[30]).toBe('31');
        expect(config?.labels?.[31]).toBe('1'); // next month
        expect(config?.max).toBe(31);
      });

      it('returns day labels for 28-day month (Feb non-leap)', () => {
        const config = getChartConfig('month', '2023-02-01');
        expect(config?.labels?.length).toBe(29); // 28 + 1
        expect(config?.max).toBe(28);
      });

      it('returns day labels for 29-day month (Feb leap year)', () => {
        const config = getChartConfig('month', '2024-02-01');
        expect(config?.labels?.length).toBe(30); // 29 + 1
        expect(config?.max).toBe(29);
      });

      it('returns day labels for 30-day month', () => {
        const config = getChartConfig('month', '2024-04-01');
        expect(config?.labels?.length).toBe(31); // 30 + 1
        expect(config?.max).toBe(30);
      });
    });

    describe('year period', () => {
      it('returns year labels and max 12', () => {
        const config = getChartConfig('year', '2024-01-01');
        expect(config?.labels).toEqual([
          'JAN',
          'FEB',
          'MAR',
          'APR',
          'MAY',
          'JUN',
          'JUL',
          'AUG',
          'SEP',
          'OCT',
          'NOV',
          'DEC',
          'JAN',
        ]);
        expect(config?.max).toBe(12);
      });
    });
  });

  describe('formatTooltipDate', () => {
    describe('week period', () => {
      it('formats as "MMM d (EEE)"', () => {
        const result = formatTooltipDate('2024-12-16T10:00:00Z', 'week');
        expect(result).toMatch(/Dec 16 \(Mon\)/);
      });
    });

    describe('month period', () => {
      it('formats as "MMM d"', () => {
        const result = formatTooltipDate('2024-12-16T10:00:00Z', 'month');
        expect(result).toBe('Dec 16');
      });
    });

    describe('year period', () => {
      it('formats as "MMMM yyyy"', () => {
        const result = formatTooltipDate('2024-12-16T10:00:00Z', 'year');
        expect(result).toBe('December 2024');
      });
    });

    it('falls back to "MMM d" for unknown period', () => {
      const result = formatTooltipDate('2024-12-16T10:00:00Z', 'unknown' as any);
      expect(result).toBe('Dec 16');
    });
  });

  describe('formatTooltipDateFromIndex', () => {
    describe('week period', () => {
      it('adds index days to start date (Sunday)', () => {
        // Sunday Dec 15, 2024 + 1 = Monday Dec 16
        const result = formatTooltipDateFromIndex(1, 'week', '2024-12-15');
        expect(result).toMatch(/Dec 16 \(Mon\)/);
      });

      it('handles first day of week (index 0)', () => {
        const result = formatTooltipDateFromIndex(0, 'week', '2024-12-15');
        expect(result).toMatch(/Dec 15 \(Sun\)/);
      });

      it('handles last day of week (index 6)', () => {
        const result = formatTooltipDateFromIndex(6, 'week', '2024-12-15');
        expect(result).toMatch(/Dec 21 \(Sat\)/);
      });
    });

    describe('month period', () => {
      it('converts index to day of month (0-based index)', () => {
        // index 15 = 16th day
        const result = formatTooltipDateFromIndex(15, 'month', '2024-12-01');
        expect(result).toBe('Dec 16');
      });

      it('handles first day of month (index 0)', () => {
        const result = formatTooltipDateFromIndex(0, 'month', '2024-12-01');
        expect(result).toBe('Dec 1');
      });

      it('handles last day of month (index 30 for 31-day month)', () => {
        const result = formatTooltipDateFromIndex(30, 'month', '2024-12-01');
        expect(result).toBe('Dec 31');
      });
    });

    describe('year period', () => {
      it('adds index months to start date', () => {
        // Jan 2024 + 11 months = Dec 2024
        const result = formatTooltipDateFromIndex(11, 'year', '2024-01-01');
        expect(result).toBe('December 2024');
      });

      it('handles first month (index 0)', () => {
        const result = formatTooltipDateFromIndex(0, 'year', '2024-01-01');
        expect(result).toBe('January 2024');
      });
    });

    it('falls back to index + 1 for unknown period', () => {
      const result = formatTooltipDateFromIndex(5, 'unknown' as any, '2024-01-01');
      expect(result).toBe('6');
    });
  });
});
