/**
 * Chart service type definitions
 * Request and response types for chart endpoints
 */

import { EmotionReason, EmotionType } from '@zerogravity/shared/components/ui/emotion';

/**
 * Chart period types
 */
export type ChartPeriod = 'week' | 'month' | 'year';

/**
 * Common chart query parameters
 */
export interface ChartQueryParams {
  period: ChartPeriod;
  startDate: string; // YYYY-MM-DD format
}

/**
 * GET /chart/level
 * Emotion level statistics
 */
export interface ChartLevelData {
  label: string;
  value: number | null; // Emotion level 1-7, null if no data
}

export interface ChartLevelResponse {
  data: ChartLevelData[];
  average: number | null; // Weighted average, null if no records
}

export interface ChartReasonData {
  label: EmotionReason;
  count: number; // Always present, 0 if no records
}

export interface ChartReasonResponse {
  data: ChartReasonData[];
}

/**
 * GET /chart/count
 * Emotion count statistics for scatter chart
 */
export interface ChartCountData {
  label: string; // Period label (SUN/MON, 1/2, JAN/FEB)
  position: number; // Decimal position for X-axis
  emotionId: number; // Emotion ID (typically 0-6)
  emotionType: EmotionType;
  timestamp: string; // ISO 8601 with timezone offset
  daily: number; // DAILY record count
  moment: number; // MOMENT record count
  total: number; // daily + moment
}

export interface ChartCountResponse {
  data: ChartCountData[];
}

/**
 * Period label types
 */
export type WeekLabel = (typeof WEEK_LABELS)[number];
export type YearLabel = (typeof YEAR_LABELS)[number];

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
