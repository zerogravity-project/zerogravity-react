/**
 * [Chart query hooks]
 * React Query hooks for chart statistics (CSR only)
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import type { ApiResponse } from '@/types/api.types';

import type { ChartCountResponse, ChartLevelResponse, ChartQueryParams, ChartReasonResponse } from './chart.dto';
import { chartService } from './chart.service';

/**
 * ============================================
 * Query Keys
 * ============================================
 */
export const CHART_QUERY_KEY = {
  LEVEL: 'chartLevel',
  REASON: 'chartReason',
  COUNT: 'chartCount',
} as const;

/**
 * ============================================
 * Hooks
 * ============================================
 */

/**
 * GET /chart/level
 * Get emotion level statistics query
 */
export const useChartLevelQuery = (params: ChartQueryParams) => {
  return useQuery<ApiResponse<ChartLevelResponse>, Error, ChartLevelResponse>({
    queryKey: [CHART_QUERY_KEY.LEVEL, params.period, params.startDate],
    queryFn: () => chartService.getChartLevel(params),
    enabled: !!params.period && !!params.startDate,
    select: (response: ApiResponse<ChartLevelResponse>) => {
      const data = response.data;
      return data;
    },
  });
};

/**
 * GET /chart/reason
 * Get emotion reason distribution statistics query
 */
export const useChartReasonQuery = (params: ChartQueryParams) => {
  return useQuery<ApiResponse<ChartReasonResponse>, Error, ChartReasonResponse>({
    queryKey: [CHART_QUERY_KEY.REASON, params.period, params.startDate],
    queryFn: () => chartService.getChartReason(params),
    enabled: !!params.period && !!params.startDate,
    select: (response: ApiResponse<ChartReasonResponse>) => {
      const data = response.data;
      return data;
    },
  });
};

/**
 * GET /chart/count
 * Get emotion count statistics query
 */
export const useChartCountQuery = (params: ChartQueryParams) => {
  return useQuery<ApiResponse<ChartCountResponse>, Error, ChartCountResponse>({
    queryKey: [CHART_QUERY_KEY.COUNT, params.period, params.startDate],
    queryFn: () => chartService.getChartCount(params),
    enabled: !!params.period && !!params.startDate,
    select: (response: ApiResponse<ChartCountResponse>) => {
      const data = response.data;
      return data;
    },
  });
};
