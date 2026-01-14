/**
 * [Emotion query hooks]
 * React Query hooks for emotion management (CSR only)
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ApiResponse, ErrorResponse } from '@/types/api.types';

import { AI_QUERY_KEY } from '../ai/ai.query';
import { CHART_QUERY_KEY } from '../chart/chart.query';

import type {
  CreateEmotionRecordRequest,
  CreateEmotionRecordResponse,
  GetEmotionRecordsParams,
  UpdateEmotionRecordRequest,
} from './emotion.dto';
import { emotionService } from './emotion.service';

/*
 * ============================================
 * Query Keys
 * ============================================
 */
export const EMOTION_QUERY_KEY = {
  RECORDS: 'emotionRecords',
} as const;

/*
 * ============================================
 * Hooks
 * ============================================
 */

/**
 * GET /emotions/records
 * Get emotion records query with date range
 */
export const useGetEmotionRecordsQuery = (params: GetEmotionRecordsParams) => {
  return useQuery({
    queryKey: [EMOTION_QUERY_KEY.RECORDS, params.startDateTime, params.endDateTime],
    queryFn: () => emotionService.getEmotionRecords(params),
  });
};

/**
 * POST /emotions/records
 * Create emotion record mutation
 */
interface UseCreateEmotionRecordMutationOptions {
  onSuccess?: (data: ApiResponse<CreateEmotionRecordResponse>) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
}

export const useCreateEmotionRecordMutation = (options: UseCreateEmotionRecordMutationOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateEmotionRecordRequest) => emotionService.createEmotionRecord(params),
    onSuccess: data => {
      // Invalidate all related queries (use isFetching to show loading UI)
      queryClient.invalidateQueries({ queryKey: [EMOTION_QUERY_KEY.RECORDS] });
      queryClient.invalidateQueries({ queryKey: [CHART_QUERY_KEY.LEVEL] });
      queryClient.invalidateQueries({ queryKey: [CHART_QUERY_KEY.REASON] });
      queryClient.invalidateQueries({ queryKey: [CHART_QUERY_KEY.COUNT] });
      queryClient.invalidateQueries({ queryKey: [AI_QUERY_KEY.PERIOD_ANALYSIS] });
      queryClient.invalidateQueries({ queryKey: [AI_QUERY_KEY.DIARY_SUMMARY] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

/**
 * PUT /emotions/records/{emotionRecordId}
 * Update emotion record mutation
 */
interface UseUpdateEmotionRecordMutationOptions {
  onSuccess?: (data: ApiResponse<null>) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
}

interface UpdateEmotionRecordMutationParams {
  emotionRecordId: string;
  data: UpdateEmotionRecordRequest;
}

export const useUpdateEmotionRecordMutation = (options: UseUpdateEmotionRecordMutationOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ emotionRecordId, data }: UpdateEmotionRecordMutationParams) =>
      emotionService.updateEmotionRecord(emotionRecordId, data),
    onSuccess: data => {
      // Invalidate all related queries (use isFetching to show loading UI)
      queryClient.invalidateQueries({ queryKey: [EMOTION_QUERY_KEY.RECORDS] });
      queryClient.invalidateQueries({ queryKey: [CHART_QUERY_KEY.LEVEL] });
      queryClient.invalidateQueries({ queryKey: [CHART_QUERY_KEY.REASON] });
      queryClient.invalidateQueries({ queryKey: [CHART_QUERY_KEY.COUNT] });
      queryClient.invalidateQueries({ queryKey: [AI_QUERY_KEY.PERIOD_ANALYSIS] });
      queryClient.invalidateQueries({ queryKey: [AI_QUERY_KEY.DIARY_SUMMARY] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};
