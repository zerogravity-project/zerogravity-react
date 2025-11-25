/**
 * [AI service type definitions]
 * Request and response types for AI endpoints
 */

/**
 * GET /ai/period-analyses
 * Get AI emotion analysis summary for a period
 */
export interface GetPeriodAnalysisParams {
  /** Time period for analysis */
  period: 'week' | 'month' | 'year';
  /** Start date in ISO 8601 format (YYYY-MM-DD) */
  startDate: string;
}

export interface SummaryData {
  /** Overall summary paragraph */
  overview: string;
  /** Array of key insights */
  keyInsights: string[];
  /** Array of recommendations */
  recommendations: string[];
}

export interface AIAnalysisResponse {
  /** Time period ("week", "month", or "year") */
  period: string;
  /** Start date in ISO 8601 format */
  startDate: string;
  /** End date in ISO 8601 format */
  endDate: string;
  /** Summary data */
  summary: SummaryData;
  /** Generation timestamp in ISO 8601 with timezone */
  generatedAt: string;
}

/**
 * POST /ai/emotion-predictions
 * Predict emotion from diary entry
 */
export interface EmotionPredictionRequest {
  /** Required diary text */
  diaryEntry: string;
  /** Optional emotion ID (0-6), if provided AI only predicts reasons */
  emotionId?: number | null;
  /** Optional reasons, if provided AI only predicts emotionId */
  emotionReasons?: string[] | null;
}

export interface EmotionPredictionResponse {
  /** Snowflake ID as string */
  analysisId: string;
  /** Suggested emotion ID (0-6), null if user already provided */
  suggestedEmotionId?: number | null;
  /** Suggested reasons, null if user already provided */
  suggestedReasons?: string[] | null;
  /** Refined diary entry */
  refinedDiary: string;
  /** AI explanation of the prediction */
  reasoning: string;
  /** Confidence score (0.0 - 1.0) */
  confidence: number;
  /** Analysis timestamp in ISO 8601 with timezone */
  analyzedAt: string;
}

/**
 * GET /ai/diary-summaries
 * Get AI-generated diary summary
 */
export interface GetDiarySummaryParams {
  /** Start date in ISO 8601 format (YYYY-MM-DD) */
  startDate: string;
  /** End date in ISO 8601 format (YYYY-MM-DD) */
  endDate: string;
}

export interface DiarySummaryResponse {
  /** AI-generated summary (max 1000 characters) */
  summary: string;
  /** Number of diary entries used */
  totalEntries: number;
}

/**
 * Helper function to validate prediction request
 */
export function isValidPredictionRequest(request: EmotionPredictionRequest): boolean {
  // Diary entry must be provided
  if (!request.diaryEntry || request.diaryEntry.trim().length === 0) {
    return false;
  }

  // At least one field (emotionId or emotionReasons) must be null/missing
  const hasEmotionId = request.emotionId !== null && request.emotionId !== undefined;
  const hasReasons =
    request.emotionReasons !== null && request.emotionReasons !== undefined && request.emotionReasons.length > 0;

  // Both provided = invalid (nothing to predict)
  if (hasEmotionId && hasReasons) {
    return false;
  }

  // Both missing = valid (predict both)
  return true;
}
