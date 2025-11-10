/**
 * Chart service type definitions
 * Request and response types for chart endpoints
 */

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
export interface ChartLevelDataPoint {
  label: string;
  value: number | null; // Emotion level 1-7, null if no data
}

export interface ChartLevelResponse {
  data: ChartLevelDataPoint[];
  average: number | null; // Weighted average, null if no records
}

/**
 * GET /chart/reason
 * Emotion reason distribution statistics
 */
export type EmotionReason =
  | 'Health'
  | 'Fitness'
  | 'Self-care'
  | 'Hobby'
  | 'Identity'
  | 'Religion'
  | 'Community'
  | 'Family'
  | 'Friends'
  | 'Partner'
  | 'Romance'
  | 'Money'
  | 'Housework'
  | 'Work'
  | 'Education'
  | 'Travel'
  | 'Weather'
  | 'Domestic Issues'
  | 'Global Issues';

export interface ChartReasonDataPoint {
  label: EmotionReason;
  count: number; // Always present, 0 if no records
}

export interface ChartReasonResponse {
  data: ChartReasonDataPoint[];
}

/**
 * GET /chart/count
 * Emotion count statistics for scatter chart
 */
export type EmotionType = 'HIGH_POSITIVE' | 'MID_POSITIVE' | 'NEUTRAL' | 'MID_NEGATIVE' | 'HIGH_NEGATIVE';

export interface ChartCountDataPoint {
  label: string; // Period label (SUN/MON, 1/2, JAN/FEB)
  position: number; // Decimal position for X-axis
  emotionId: number; // Emotion ID (typically 1-7)
  emotionType: EmotionType;
  timestamp: string; // ISO 8601 with timezone offset
  daily: number; // DAILY record count
  moment: number; // MOMENT record count
  total: number; // daily + moment
}

export interface ChartCountResponse {
  data: ChartCountDataPoint[];
}

/**
 * Period label types
 */
export type WeekLabel = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export type MonthLabel =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31';

export type YearLabel = 'JAN' | 'FEB' | 'MAR' | 'APR' | 'MAY' | 'JUN' | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC';

/**
 * All predefined emotion reasons
 */
export const EMOTION_REASONS: readonly EmotionReason[] = [
  'Health',
  'Fitness',
  'Self-care',
  'Hobby',
  'Identity',
  'Religion',
  'Community',
  'Family',
  'Friends',
  'Partner',
  'Romance',
  'Money',
  'Housework',
  'Work',
  'Education',
  'Travel',
  'Weather',
  'Domestic Issues',
  'Global Issues',
] as const;
