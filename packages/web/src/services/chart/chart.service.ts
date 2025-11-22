/**
 * Chart service
 * API calls for chart statistics (SSR/CSR compatible)
 */

import type { ChartQueryParams, ChartLevelResponse, ChartReasonResponse, ChartCountResponse } from './chart.dto';

import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';

export const chartService = {
  /**
   * GET /chart/level
   * Get emotion level statistics
   */
  getChartLevel: async (params: ChartQueryParams): Promise<ApiResponse<ChartLevelResponse>> => {
    const { data } = await axiosInstance.get('/chart/level', {
      params,
    });
    return data;
  },

  /**
   * GET /chart/reason
   * Get emotion reason distribution statistics
   */
  getChartReason: async (params: ChartQueryParams): Promise<ApiResponse<ChartReasonResponse>> => {
    const { data } = await axiosInstance.get('/chart/reason', {
      params,
    });
    return data;
  },

  /**
   * GET /chart/count
   * Get emotion count statistics for scatter chart
   */
  getChartCount: async (params: ChartQueryParams): Promise<ApiResponse<ChartCountResponse>> => {
    const { data } = await axiosInstance.get('/chart/count', {
      params,
    });
    return data;
  },
};
