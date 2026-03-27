/**
 * [Auth service type definitions]
 * Request and response types for authentication endpoints
 */

import type { ConsentData } from '@/types/next-auth';

/**
 * POST /auth/verify
 * Verify OAuth user and generate backend JWT
 */
export interface VerifyAuthRequest {
  /** Provider ID */
  providerId: string;
  /** Provider type */
  provider: 'GOOGLE' | 'KAKAO';
  /** Email */
  email: string;
  /** Name */
  name: string;
  /** Image URL */
  image?: string;
}

export interface VerifyAuthResponse {
  /** Success flag */
  success: boolean;
  /** Message */
  message: string;
  /** Flag indicating if user is newly created */
  newUser: boolean;
  /** Consent data */
  consents: ConsentData;
}
