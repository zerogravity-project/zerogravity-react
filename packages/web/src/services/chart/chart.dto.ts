/**
 * [Chart service type definitions]
 * Request and response types for chart endpoints
 */

import type { EmotionId, EmotionReason, EmotionType } from '@zerogravity/shared/entities/emotion';

/**
 * Chart period types
 */
export type ChartPeriod = 'week' | 'month' | 'year';

/**
 * Common chart query parameters
 */
export interface ChartQueryParams {
  /** Period type (week, month, year) */
  period: ChartPeriod;
  /** Start date in YYYY-MM-DD format */
  startDate: string;
}

/**
 * GET /chart/level
 * Emotion level statistics
 */
export interface ChartLevelData {
  /** Label (SUN/MON, 1/2, JAN/FEB) */
  label: string;
  /** Emotion level 1-7, null if no data */
  value: number | null;
}

export interface ChartLevelResponse {
  /** Chart level data */
  data: ChartLevelData[];
  /** Weighted average of emotion levels, null if no records */
  average: number | null;
}

/**
 * GET /chart/reason
 * Emotion reason statistics
 */
export interface ChartReasonData {
  /** Emotion reason label */
  label: EmotionReason;
  /** Count of emotion reasons, always present, 0 if no records */
  count: number;
}

export interface ChartReasonResponse {
  /** Chart reason data */
  data: ChartReasonData[];
}

/**
 * GET /chart/count
 * Emotion count statistics for scatter chart
 */
export interface ChartCountData {
  /** Period label (SUN/MON, 1/2, JAN/FEB) */
  label: string;
  /** Decimal position for X-axis */
  position: number;
  /** Emotion ID (0-6) */
  emotionId: EmotionId;
  emotionType: EmotionType;
  /** ISO 8601 with timezone offset */
  timestamp: string;
  /** DAILY record count */
  daily: number;
  /** MOMENT record count */
  moment: number;
  /** daily + moment */
  total: number;
}

export interface ChartCountResponse {
  /** Chart count data */
  data: ChartCountData[];
}

/**
 * Period label types
 */
export type WeekLabel = (typeof WEEK_LABELS)[number];
export type YearLabel = (typeof YEAR_LABELS)[number];

/**
 * Period label constants
 */
export const WEEK_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
export const YEAR_LABELS = [
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
] as const;
