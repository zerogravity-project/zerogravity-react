/**
 * [Server-side chart service]
 * For use in Server Components (RSC)
 */

import { auth } from '@/lib/auth';
import type { ApiResponse } from '@/types/api.types';

import type { ChartCountResponse, ChartLevelResponse, ChartQueryParams, ChartReasonResponse } from './chart.dto';

/** API base URL */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetch with authentication helper
 */
async function fetchWithAuth<T>(endpoint: string, params: ChartQueryParams): Promise<ApiResponse<T>> {
  const session = await auth();

  if (!session?.backendJwt) {
    throw new Error('Unauthorized: No backend JWT available');
  }

  const url = new URL(endpoint, API_BASE_URL);
  url.searchParams.append('period', params.period);
  url.searchParams.append('startDate', params.startDate);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.backendJwt}`,
      'X-Timezone': 'Asia/Seoul',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
  }

  return response.json();
}

/**
 * GET /chart/level (Server-side)
 * Fetch emotion level statistics from server component
 */
export const getChartLevelServer = (params: ChartQueryParams): Promise<ApiResponse<ChartLevelResponse>> =>
  fetchWithAuth<ChartLevelResponse>('/chart/level', params);

/**
 * GET /chart/count (Server-side)
 * Fetch emotion count statistics from server component
 */
export const getChartCountServer = (params: ChartQueryParams): Promise<ApiResponse<ChartCountResponse>> =>
  fetchWithAuth<ChartCountResponse>('/chart/count', params);

/**
 * GET /chart/reason (Server-side)
 * Fetch emotion reason statistics from server component
 */
export const getChartReasonServer = (params: ChartQueryParams): Promise<ApiResponse<ChartReasonResponse>> =>
  fetchWithAuth<ChartReasonResponse>('/chart/reason', params);
