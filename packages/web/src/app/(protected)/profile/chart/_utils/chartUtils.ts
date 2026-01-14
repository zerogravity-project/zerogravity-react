/**
 * [Chart utilities]
 * Configuration, labels, and shared utilities for chart display
 */

import { addDays, addMonths, format, getDaysInMonth, setDate } from 'date-fns';

import { EMOTION_STEPS } from '@zerogravity/shared/components/ui/emotion';
import { EMOTION_COLORS, EMOTION_COLORS_MAP } from '@zerogravity/shared/entities/emotion';

import { ChartPeriod, WEEK_LABELS, YEAR_LABELS } from '@/services/chart/chart.dto';

import { CHART_GRID_COLOR, TOOLTIP_STYLES } from '../_constants/chart.constants';

/*
 * ============================================
 * Emotion Utilities
 * ============================================
 */

/**
 * Convert emotion value (0-6) to emotion label
 * @param value - Emotion level value
 * @returns Emotion type label (e.g., "Happy", "Sad")
 */
export function emotionValueToLabel(value: number): string {
  return EMOTION_STEPS[value]?.type || '';
}

/**
 * Generate HTML for emotion range display (handles fractional values)
 * @param value - Emotion value (can be fractional)
 * @returns HTML string with colored emotion label(s)
 */
export function generateEmotionRangeHtml(value: number): string {
  const floorEmotion = Math.floor(value);
  const ceilEmotion = Math.ceil(value);
  const isInteger = value === floorEmotion;

  const floorType = EMOTION_STEPS[floorEmotion]?.type || '';
  const floorColorKey = EMOTION_COLORS[floorEmotion];
  const floorColor = EMOTION_COLORS_MAP[floorColorKey as keyof typeof EMOTION_COLORS_MAP];

  if (isInteger) {
    return `<span style="color: ${floorColor};">${floorType}</span>`;
  }

  const ceilType = EMOTION_STEPS[ceilEmotion]?.type || '';
  const ceilColorKey = EMOTION_COLORS[ceilEmotion];
  const ceilColor = EMOTION_COLORS_MAP[ceilColorKey as keyof typeof EMOTION_COLORS_MAP];

  return `<span style="color: ${floorColor};">${floorType}</span> - <span style="color: ${ceilColor};">${ceilType}</span>`;
}

/*
 * ============================================
 * Tooltip Utilities
 * ============================================
 */

/**
 * Get or create tooltip element
 * @param parentNode - Parent DOM node
 * @param className - Tooltip CSS class name
 * @returns Tooltip element
 */
export function getOrCreateTooltip(parentNode: HTMLElement, className: string): HTMLDivElement {
  let tooltipEl = parentNode.querySelector<HTMLDivElement>(`.${className}`);
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = className;
    tooltipEl.style.cssText = TOOLTIP_STYLES;
    parentNode.appendChild(tooltipEl);
  }
  return tooltipEl;
}

/**
 * Calculate tooltip left position with horizontal boundary checking
 * @param caretX - Tooltip caret X position
 * @param tooltipWidth - Tooltip element width
 * @param containerWidth - Container element width
 * @returns Bounded left position
 */
export function calculateTooltipLeftPosition(caretX: number, tooltipWidth: number, containerWidth: number): number {
  const tooltipHalfWidth = tooltipWidth / 2;
  let left = caretX;

  if (left - tooltipHalfWidth < 0) {
    left = tooltipHalfWidth;
  } else if (left + tooltipHalfWidth > containerWidth) {
    left = containerWidth - tooltipHalfWidth;
  }

  return left;
}

/*
 * ============================================
 * Scale Utilities
 * ============================================
 */

/**
 * Create Y-axis scale options for emotion charts
 * @returns Y-axis scale configuration object
 */
export function createEmotionYScaleConfig() {
  return {
    min: 0,
    max: 6,
    grid: { color: CHART_GRID_COLOR },
    ticks: {
      callback: (tickValue: string | number) => emotionValueToLabel(Number(tickValue)),
      stepSize: 1,
      autoSkip: false,
      maxTicksLimit: 7,
      font: { size: 11 },
    },
  };
}

/*
 * ============================================
 * Chart Configuration
 * ============================================
 */

/**
 * Get chart configuration based on period
 * @param period - Chart period type (week, month, year)
 * @param startDate - Start date string to calculate days in month
 * @returns Object with labels array and max value for the chart
 */
export function getChartConfig(period: ChartPeriod, startDate: string) {
  if (period === 'week') {
    return { labels: WEEK_LABELS, max: 7 };
  }
  if (period === 'month') {
    const daysInMonth = getDaysInMonth(new Date(startDate));
    const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
    // Add Next Month's 1st day
    labels.push('1');

    return { labels, max: daysInMonth };
  }
  if (period === 'year') {
    return { labels: YEAR_LABELS, max: 12 };
  }
}

/**
 * Format timestamp for tooltip display based on period
 * @param timestamp - ISO 8601 timestamp string
 * @param period - Chart period type (week, month, year)
 * @returns Formatted date string
 */
export function formatTooltipDate(timestamp: string, period: ChartPeriod): string {
  const date = new Date(timestamp);

  if (period === 'week') {
    // Dec 16 (Mon)
    return format(date, 'MMM d (EEE)');
  }
  if (period === 'month') {
    // Dec 16
    return format(date, 'MMM d');
  }
  if (period === 'year') {
    // December 2024
    return format(date, 'MMMM yyyy');
  }

  return format(date, 'MMM d');
}

/**
 * Format tooltip date from label index (for Level chart without timestamp)
 * @param index - Data point index
 * @param period - Chart period type (week, month, year)
 * @param startDate - Start date string
 * @returns Formatted date string
 */
export function formatTooltipDateFromIndex(index: number, period: ChartPeriod, startDate: string): string {
  const start = new Date(startDate);

  if (period === 'week') {
    // startDate is Sunday, add index days
    const date = addDays(start, index);
    return format(date, 'MMM d (EEE)');
  }
  if (period === 'month') {
    // index is day of month (0-based), so add 1
    const date = setDate(start, index + 1);
    return format(date, 'MMM d');
  }
  if (period === 'year') {
    // index is month (0-based)
    const date = addMonths(start, index);
    return format(date, 'MMMM yyyy');
  }

  return String(index + 1);
}
