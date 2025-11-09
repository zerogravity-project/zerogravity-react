/**
 * Chart query hooks
 * React Query hooks for chart statistics (CSR only)
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { chartService } from './chart.service';
import type {
  ChartQueryParams,
  ChartLevelResponse,
  ChartReasonResponse,
  ChartCountResponse,
} from './chart.dto';
import type { ApiResponse } from '@/types/api.types';

export const CHART_QUERY_KEY = {
  LEVEL: 'chartLevel',
  REASON: 'chartReason',
  COUNT: 'chartCount',
} as const;

/**
 * GET /chart/level
 * Get emotion level statistics query
 */
export const useChartLevelQuery = (params: ChartQueryParams) => {
  return useQuery<ApiResponse<ChartLevelResponse>>({
    queryKey: [CHART_QUERY_KEY.LEVEL, params.period, params.startDate],
    queryFn: () => chartService.getChartLevel(params),
  });
};

/**
 * GET /chart/reason
 * Get emotion reason distribution statistics query
 */
export const useChartReasonQuery = (params: ChartQueryParams) => {
  return useQuery<ApiResponse<ChartReasonResponse>>({
    queryKey: [CHART_QUERY_KEY.REASON, params.period, params.startDate],
    queryFn: () => chartService.getChartReason(params),
  });
};

/**
 * GET /chart/count
 * Get emotion count statistics query
 */
export const useChartCountQuery = (params: ChartQueryParams) => {
  return useQuery<ApiResponse<ChartCountResponse>>({
    queryKey: [CHART_QUERY_KEY.COUNT, params.period, params.startDate],
    queryFn: () => chartService.getChartCount(params),
  });
};
