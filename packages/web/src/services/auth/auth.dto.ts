/**
 * Auth service type definitions
 * Request and response types for authentication endpoints
 */

import type { ConsentData } from '@/types/next-auth';

/**
 * POST /auth/verify
 * Verify OAuth user and generate backend JWT
 */
export interface VerifyAuthRequest {
  providerId: string;
  provider: 'GOOGLE' | 'KAKAO';
  email: string;
  name: string;
  image?: string;
}

export interface VerifyAuthResponse {
  success: boolean;
  message: string;
  isNewUser: boolean;
  consents: ConsentData;
}
