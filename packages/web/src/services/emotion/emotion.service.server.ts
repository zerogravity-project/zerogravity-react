/**
 * Server-side emotion service
 * For use in Server Components (RSC)
 */

import { auth } from '@/lib/auth';
import type { ApiResponse } from '@/types/api.types';

import type { GetEmotionRecordsParams, GetEmotionRecordsResponse } from './emotion.dto';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * GET /emotions/records (Server-side)
 * Fetch emotion records from server component
 */
export async function getEmotionRecordsServer(
  params: GetEmotionRecordsParams
): Promise<ApiResponse<GetEmotionRecordsResponse>> {
  const session = await auth();

  if (!session?.backendJwt) {
    throw new Error('Unauthorized: No backend JWT available');
  }

  const url = new URL('/emotions/records', API_BASE_URL);
  url.searchParams.append('startDateTime', params.startDateTime);
  url.searchParams.append('endDateTime', params.endDateTime);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.backendJwt}`,
      'X-Timezone': 'Asia/Seoul',
    },
    cache: 'no-store', // Always fetch fresh data for emotion records
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch emotion records: ${response.status}`);
  }

  return response.json();
}
