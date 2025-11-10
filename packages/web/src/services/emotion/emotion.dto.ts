/**
 * Emotion service type definitions
 * Request and response types for emotion endpoints
 */

/**
 * Emotion types mapped from emotion IDs (0-6)
 */
export type EmotionType =
  | 'VERY_NEGATIVE' // 0
  | 'NEGATIVE' // 1
  | 'MID_NEGATIVE' // 2
  | 'NORMAL' // 3
  | 'MID_POSITIVE' // 4
  | 'POSITIVE' // 5
  | 'VERY_POSITIVE'; // 6

/**
 * Emotion record types
 */
export type EmotionRecordType = 'daily' | 'moment';

/**
 * Predefined emotion reasons
 */
export type PredefinedReason =
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

/**
 * POST /emotions/records
 * Create emotion record
 */
export interface CreateEmotionRecordRequest {
  emotionId: number; // 0-6
  emotionRecordType: EmotionRecordType;
  emotionReasons?: string[]; // Predefined or custom reasons
  diaryEntry?: string; // Optional diary text
  aiAnalysisId?: string; // Optional Snowflake ID from AI prediction
}

export interface CreateEmotionRecordResponse {
  emotionRecordId: string; // Snowflake ID as string
}

/**
 * GET /emotions/records
 * Get emotion records with date range filter
 */
export interface GetEmotionRecordsParams {
  startDateTime: string; // ISO 8601 in user's timezone
  endDateTime: string; // ISO 8601 in user's timezone
}

export interface EmotionRecordDetail {
  emotionRecordId: string; // Snowflake ID as string
  emotionId: number; // 0-6
  emotionType: EmotionType;
  reasons: string[];
  diaryEntry: string | null;
  createdAt: string; // ISO 8601 with timezone offset
}

export interface GetEmotionRecordsResponse {
  daily: EmotionRecordDetail[];
  moment: EmotionRecordDetail[];
}

/**
 * PUT /emotions/records/{emotionRecordId}
 * Update emotion record (only daily records, within 24 hours)
 */
export interface UpdateEmotionRecordRequest {
  emotionId: number; // 0-6
  emotionReasons: string[]; // Required
  diaryEntry?: string | null; // Optional diary text
}

/**
 * Helper function to map emotion ID to type
 */
export function getEmotionType(emotionId: number): EmotionType {
  const map: Record<number, EmotionType> = {
    0: 'VERY_NEGATIVE',
    1: 'NEGATIVE',
    2: 'MID_NEGATIVE',
    3: 'NORMAL',
    4: 'MID_POSITIVE',
    5: 'POSITIVE',
    6: 'VERY_POSITIVE',
  };
  return map[emotionId] || 'NORMAL';
}

/**
 * Helper function to validate emotion ID
 */
export function isValidEmotionId(id: number): boolean {
  return id >= 0 && id <= 6;
}

/**
 * Helper function to check if record is within 24-hour edit window
 */
export function isWithinEditWindow(createdAt: Date, now: Date = new Date()): boolean {
  const elapsed = now.getTime() - createdAt.getTime();
  const hours = elapsed / (1000 * 60 * 60);
  return hours <= 24;
}

/**
 * Predefined emotion reasons constant
 */
export const PREDEFINED_REASONS: readonly PredefinedReason[] = [
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
