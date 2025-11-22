/**
 * AI query hooks
 * React Query hooks for AI-powered features (CSR only)
 */

'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ApiResponse, ErrorResponse } from '@/types/api.types';

import type {
  AIAnalysisResponse,
  DiarySummaryResponse,
  EmotionPredictionRequest,
  EmotionPredictionResponse,
  GetDiarySummaryParams,
  GetPeriodAnalysisParams,
} from './ai.dto';
import { aiService } from './ai.service';

export const AI_QUERY_KEY = {
  PERIOD_ANALYSIS: 'aiPeriodAnalysis',
  DIARY_SUMMARY: 'aiDiarySummary',
} as const;

/**
 * GET /ai/period-analyses
 * Get AI emotion analysis summary query
 * Results are cached for 24 hours by backend
 */
export const usePeriodAnalysisQuery = (params: GetPeriodAnalysisParams, enabled: boolean = true) => {
  return useQuery<ApiResponse<AIAnalysisResponse>>({
    queryKey: [AI_QUERY_KEY.PERIOD_ANALYSIS, params.period, params.startDate],
    queryFn: () => aiService.getPeriodAnalysis(params),
    enabled,
  });
};

/**
 * POST /ai/emotion-predictions
 * Predict emotion from diary entry mutation
 */
interface UsePredictEmotionMutationOptions {
  onSuccess?: (data: ApiResponse<EmotionPredictionResponse>) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
}

export const usePredictEmotionMutation = (options: UsePredictEmotionMutationOptions = {}) => {
  return useMutation({
    mutationFn: (params: EmotionPredictionRequest) => aiService.predictEmotion(params),
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
};

/**
 * GET /ai/diary-summaries
 * Get AI-generated diary summary query
 * Requires at least 3 diary entries in the period
 */
export const useDiarySummaryQuery = (params: GetDiarySummaryParams, enabled: boolean = true) => {
  return useQuery<ApiResponse<DiarySummaryResponse>>({
    queryKey: [AI_QUERY_KEY.DIARY_SUMMARY, params.startDate, params.endDate],
    queryFn: () => aiService.getDiarySummary(params),
    enabled, // Allow manual control of when to fetch
  });
};
