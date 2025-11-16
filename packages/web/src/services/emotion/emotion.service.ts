/**
 * Emotion service
 * API calls for emotion management (SSR/CSR compatible)
 */

import type {
  CreateEmotionRecordRequest,
  CreateEmotionRecordResponse,
  GetEmotionRecordsParams,
  GetEmotionRecordsResponse,
  UpdateEmotionRecordRequest,
} from './emotion.dto';

import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';

export const emotionService = {
  /**
   * POST /emotions/records
   * Create emotion record
   */
  createEmotionRecord: async (
    params: CreateEmotionRecordRequest
  ): Promise<ApiResponse<CreateEmotionRecordResponse>> => {
    const { data } = await axiosInstance.post('/emotions/records', params);
    return data;
  },

  /**
   * GET /emotions/records
   * Get emotion records with date range filter
   */
  getEmotionRecords: async (params: GetEmotionRecordsParams): Promise<ApiResponse<GetEmotionRecordsResponse>> => {
    const { data } = await axiosInstance.get('/emotions/records', {
      params,
    });
    return data;
  },

  /**
   * PUT /emotions/records/{emotionRecordId}
   * Update emotion record (only daily records, within 24 hours)
   */
  updateEmotionRecord: async (
    emotionRecordId: string,
    params: UpdateEmotionRecordRequest
  ): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.put(`/emotions/records/${emotionRecordId}`, params);
    return data;
  },
};
