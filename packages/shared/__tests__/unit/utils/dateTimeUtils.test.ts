/**
 * [dateTimeUtils tests]
 * Unit tests for date and time utility functions
 */

import { describe, expect, it } from 'vitest';

import {
  formatDateString,
  getDateStringData,
  getTimeStringData,
  getTodayString,
  getWeekDates,
  isSameDay,
} from '../../../utils/dateTimeUtils';

describe('dateTimeUtils', () => {
  describe('getTodayString', () => {
    it('returns date in YYYY-MM-DD format', () => {
      const result = getTodayString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('returns today date', () => {
      const result = getTodayString();
      const today = new Date();
      const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      expect(result).toBe(expected);
    });
  });

  describe('formatDateString', () => {
    it('formats date to YYYY-MM-DD', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      expect(formatDateString(date)).toBe('2024-01-15');
    });

    it('pads single digit month and day', () => {
      const date = new Date(2024, 2, 5); // March 5, 2024
      expect(formatDateString(date)).toBe('2024-03-05');
    });
  });

  describe('getDateStringData', () => {
    it('returns year, month, day, weekday', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024 (Monday)
      const result = getDateStringData(date);

      expect(result.year).toBe('2024');
      expect(result.month).toBe('January');
      expect(result.day).toBe('15');
      expect(result.weekday).toBe('Monday');
    });

    it('returns full month name in English', () => {
      const december = new Date(2024, 11, 25);
      expect(getDateStringData(december).month).toBe('December');
    });

    it('returns full weekday name in English', () => {
      const sunday = new Date(2024, 0, 14); // January 14, 2024 (Sunday)
      expect(getDateStringData(sunday).weekday).toBe('Sunday');
    });
  });

  describe('getTimeStringData', () => {
    it('returns hours, minutes, seconds as padded strings', () => {
      const date = new Date(2024, 0, 15, 14, 30, 45);
      const result = getTimeStringData(date);

      expect(result.hours).toBe('14');
      expect(result.minutes).toBe('30');
      expect(result.seconds).toBe('45');
    });

    it('pads single digit values with leading zero', () => {
      const date = new Date(2024, 0, 15, 9, 5, 3);
      const result = getTimeStringData(date);

      expect(result.hours).toBe('09');
      expect(result.minutes).toBe('05');
      expect(result.seconds).toBe('03');
    });

    it('handles midnight correctly', () => {
      const midnight = new Date(2024, 0, 15, 0, 0, 0);
      const result = getTimeStringData(midnight);

      expect(result.hours).toBe('00');
      expect(result.minutes).toBe('00');
      expect(result.seconds).toBe('00');
    });
  });

  describe('isSameDay', () => {
    it('returns true for same day', () => {
      const date1 = new Date(2024, 0, 15, 10, 30);
      const date2 = new Date(2024, 0, 15, 23, 59);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('returns false for different days', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 16);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('returns false for different months', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 1, 15);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('returns false for different years', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2025, 0, 15);
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('getWeekDates', () => {
    it('returns array of 7 dates', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekDates(date);
      expect(result).toHaveLength(7);
    });

    it('starts from Sunday', () => {
      const wednesday = new Date(2024, 0, 17); // January 17, 2024 (Wednesday)
      const result = getWeekDates(wednesday);
      expect(result[0].getDay()).toBe(0); // Sunday
    });

    it('returns consecutive days', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekDates(date);

      for (let i = 1; i < result.length; i++) {
        const diff = result[i].getTime() - result[i - 1].getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        expect(diff).toBe(oneDay);
      }
    });

    it('ends on Saturday', () => {
      const date = new Date(2024, 0, 15);
      const result = getWeekDates(date);
      expect(result[6].getDay()).toBe(6); // Saturday
    });
  });
});
