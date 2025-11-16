/**
 * Emotion service type definitions
 * Request and response types for emotion endpoints
 */

import { EmotionId, EmotionReason, EmotionType } from '@zerogravity/shared/components/ui/emotion';

/**
 * Emotion record types
 */
export type EmotionRecordType = 'daily' | 'moment';

/**
 * POST /emotions/records
 * Create emotion record
 */
export interface CreateEmotionRecordRequest {
  emotionId: EmotionId; // 0-6
  emotionRecordType: EmotionRecordType;
  emotionReasons?: EmotionReason[]; // Predefined or custom reasons
  diaryEntry?: string; // Optional diary text
  aiAnalysisId?: string; // Optional Snowflake ID from AI prediction
  recordDate?: string; // Optional date string
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
  emotionId: EmotionId; // 0-6
  emotionType: EmotionType;
  reasons: EmotionReason[];
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
  emotionId: EmotionId; // 0-6
  emotionReasons: EmotionReason[]; // Required
  diaryEntry?: string | null; // Optional diary text
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
