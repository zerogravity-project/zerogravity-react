/**
 * AI service
 * API calls for AI-powered features (SSR/CSR compatible)
 */

import type {
  GetPeriodAnalysisParams,
  AIAnalysisResponse,
  EmotionPredictionRequest,
  EmotionPredictionResponse,
  GetDiarySummaryParams,
  DiarySummaryResponse,
} from './ai.dto';

import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';

export const aiService = {
  /**
   * GET /ai/period-analyses
   * Get AI emotion analysis summary for a period
   * Results are cached for 24 hours
   */
  getPeriodAnalysis: async (params: GetPeriodAnalysisParams): Promise<ApiResponse<AIAnalysisResponse>> => {
    const { data } = await axiosInstance.get('/ai/period-analyses', {
      params,
    });
    return data;
  },

  /**
   * POST /ai/emotion-predictions
   * Predict emotion from diary entry
   * Returns analysis ID and suggestions without creating emotion record
   */
  predictEmotion: async (params: EmotionPredictionRequest): Promise<ApiResponse<EmotionPredictionResponse>> => {
    const { data } = await axiosInstance.post('/ai/emotion-predictions', params);
    return data;
  },

  /**
   * GET /ai/diary-summaries
   * Get AI-generated diary summary
   * Requires at least 3 diary entries in the period
   */
  getDiarySummary: async (params: GetDiarySummaryParams): Promise<ApiResponse<DiarySummaryResponse>> => {
    const { data } = await axiosInstance.get('/ai/diary-summaries', {
      params,
    });
    return data;
  },
};
