/**
 * [Server-side user service]
 * For use in Server Components (RSC)
 */

import { auth } from '@/lib/auth';
import type { ApiResponse } from '@/types/api.types';

import type { GetUserProfileResponse } from './user.dto';

/** API base URL */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * GET /users/me (Server-side)
 * Fetch user profile from server component
 */
export async function getUserProfileServer(): Promise<ApiResponse<GetUserProfileResponse>> {
  const session = await auth();

  if (!session?.backendJwt) {
    throw new Error('Unauthorized: No backend JWT available');
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.backendJwt}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.status}`);
  }

  return response.json();
}
