/**
 * [User service type definitions]
 * Request and response types for user endpoints
 */

import type { ConsentData } from '@/types/next-auth';

/**
 * GET /users/me
 * Get user profile
 */
export interface GetUserProfileResponse {
  /** User name */
  name: string;
  /** User image URL, optional */
  image?: string;
  /** User email */
  email: string;
  /** User provider */
  provider: string;
  /** User consent data */
  consents: ConsentData;
}

/**
 * PUT /users/consent
 * Update user consent preferences
 */
export interface UpdateConsentRequest {
  /** Flag indicating if user has agreed to terms of service */
  termsAgreed: boolean;
  /** Flag indicating if user has agreed to privacy policy */
  privacyAgreed: boolean;
  /** Flag indicating if user has agreed to sensitive data processing */
  sensitiveDataConsent: boolean;
  /** Flag indicating if user has agreed to AI-powered analysis */
  aiAnalysisConsent: boolean;
}

export interface UpdateConsentResponse {
  /** User consent data */
  consents: ConsentData;
}

/**
 * DELETE /users/me
 * Delete user account
 */
export type DeleteUserResponse = void;
