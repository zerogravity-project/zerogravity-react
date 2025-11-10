/**
 * AI service type definitions
 * Request and response types for AI endpoints
 */

/**
 * GET /ai/period-analyses
 * Get AI emotion analysis summary for a period
 */
export interface GetPeriodAnalysisParams {
  period: 'week' | 'month' | 'year';
  startDate: string; // ISO 8601 date (YYYY-MM-DD)
}

export interface SummaryData {
  overview: string; // Overall summary paragraph
  keyInsights: string[]; // Array of key insights
  recommendations: string[]; // Array of recommendations
}

export interface AIAnalysisResponse {
  period: string; // "week", "month", or "year"
  startDate: string; // ISO 8601 date
  endDate: string; // ISO 8601 date
  summary: SummaryData;
  generatedAt: string; // ISO 8601 with timezone offset
}

/**
 * POST /ai/emotion-predictions
 * Predict emotion from diary entry
 */
export interface EmotionPredictionRequest {
  diaryEntry: string; // Required diary text
  emotionId?: number | null; // Optional: 0-6, if provided AI only predicts reasons
  emotionReasons?: string[] | null; // Optional: if provided AI only predicts emotionId
}

export interface EmotionPredictionResponse {
  analysisId: string; // Snowflake ID as string
  suggestedEmotionId?: number | null; // 0-6, null if user already provided
  suggestedReasons?: string[] | null; // null if user already provided
  reasoning: string; // AI explanation of the prediction
  confidence: number; // 0.0 - 1.0
  analyzedAt: string; // ISO 8601 with timezone offset
}

/**
 * GET /ai/diary-summaries
 * Get AI-generated diary summary
 */
export interface GetDiarySummaryParams {
  startDate: string; // ISO 8601 date (YYYY-MM-DD)
  endDate: string; // ISO 8601 date (YYYY-MM-DD)
}

export interface DiarySummaryResponse {
  summary: string; // AI-generated summary (max 1000 characters)
  totalEntries: number; // Number of diary entries used
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
