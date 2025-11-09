/**
 * User service type definitions
 * Request and response types for user endpoints
 */

import type { ConsentData } from '@/types/next-auth';

/**
 * GET /users/me
 * Get user profile
 */
export interface GetUserProfileResponse {
  name: string;
  image?: string;
  email: string;
  provider: string;
  consents: ConsentData;
}

/**
 * PUT /users/consent
 * Update user consent preferences
 */
export interface UpdateConsentRequest {
  termsAgreed: boolean;
  privacyAgreed: boolean;
  sensitiveDataConsent: boolean;
  aiAnalysisConsent: boolean;
}

export interface UpdateConsentResponse {
  consents: ConsentData;
}

/**
 * DELETE /users/me
 * Delete user account
 */
export type DeleteUserResponse = void;
