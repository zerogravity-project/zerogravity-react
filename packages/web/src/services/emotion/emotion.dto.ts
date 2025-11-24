/**
 * [Emotion service type definitions]
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
  /** 0-6 */
  emotionId: EmotionId;
  emotionRecordType: EmotionRecordType;
  /** Predefined or custom reasons */
  emotionReasons?: EmotionReason[];
  /** Optional diary text */
  diaryEntry?: string;
  /** Optional Snowflake ID from AI prediction */
  aiAnalysisId?: string;
  /** Optional date string */
  recordDate?: string;
}

export interface CreateEmotionRecordResponse {
  /** Snowflake ID as string */
  emotionRecordId: string;
}

/**
 * GET /emotions/records
 * Get emotion records with date range filter
 */
export interface GetEmotionRecordsParams {
  /** ISO 8601 in user's timezone */
  startDateTime: string;
  /** ISO 8601 in user's timezone */
  endDateTime: string;
}

export interface EmotionRecordDetail {
  /** Snowflake ID as string */
  emotionRecordId: string;
  /** Emotion ID (0-6) */
  emotionId: EmotionId;
  /** Emotion type */
  emotionType: EmotionType;
  /** Emotion reasons */
  reasons: EmotionReason[];
  /** Diary entry, null if not provided */
  diaryEntry: string | null;
  /** ISO 8601 with timezone offset */
  createdAt: string;
}

export interface GetEmotionRecordsResponse {
  /** Daily emotion records */
  daily: EmotionRecordDetail[];
  /** Moment emotion records */
  moment: EmotionRecordDetail[];
}

/**
 * PUT /emotions/records/{emotionRecordId}
 * Update emotion record (only daily records, within 24 hours)
 */
export interface UpdateEmotionRecordRequest {
  /** 0-6 */
  emotionId: EmotionId;
  /** Required */
  emotionReasons: EmotionReason[];
  /** Optional diary text */
  diaryEntry?: string | null;
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
