/**
 * [NextAuth type extensions]
 * Custom session, JWT, and user type definitions
 */

import { DefaultSession } from 'next-auth';

/**
 * Consent data structure from backend
 */
export interface ConsentData {
  /** Flag indicating if user has agreed to terms of service */
  termsAgreed: boolean;
  /** Date and time when user agreed to terms of service */
  termsAgreedAt?: string;
  /** Flag indicating if user has agreed to privacy policy */
  privacyAgreed: boolean;
  /** Date and time when user agreed to privacy policy */
  privacyAgreedAt?: string;
  /** Flag indicating if user has agreed to sensitive data processing */
  sensitiveDataConsent: boolean;
  /** Date and time when user agreed to sensitive data processing */
  sensitiveDataConsentAt?: string;
  /** Flag indicating if user has agreed to AI-powered analysis */
  aiAnalysisConsent: boolean;
  /** Date and time when user agreed to AI-powered analysis */
  aiAnalysisConsentAt?: string;
  /** Version of the consent agreement */
  consentVersion: string;
}

/**
 * Extend NextAuth Session type
 * Add accessToken, provider, backendJwt, userId, consent data, and new user flag
 */
declare module 'next-auth' {
  interface User {
    /** Flag indicating if user is newly created */
    isNewUser?: boolean;
    /** User consent information */
    consents?: ConsentData;
  }

  interface Session extends DefaultSession {
    /**
     * Access token received from OAuth provider
     */
    accessToken?: string;

    /**
     * OAuth provider used for login ('google' | 'kakao')
     */
    provider?: string;

    /**
     * JWT token from backend server
     * Used for authenticated API requests to backend
     * Contains userId and other user info (obtained from JWT decode if needed)
     */
    backendJwt?: string;

    /**
     * Refresh token from backend server
     * Used to refresh expired backend JWT
     */
    refreshToken?: string;

    /**
     * Error message if token refresh failed
     */
    error?: string;

    /**
     * Backend auth error code (e.g., USER_DEACTIVATED, INTERNAL_SERVER_ERROR)
     */
    authError?: string;

    /**
     * Backend auth error message
     */
    authErrorMessage?: string;

    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      /**
       * Flag indicating if user is newly created (needs consent)
       */
      isNewUser?: boolean;
      /**
       * User consent information
       */
      consents?: ConsentData;
    };
  }
}

/**
 * Extend NextAuth JWT type
 * Store OAuth token information, backend JWT, consent data, and new user flag
 */
declare module 'next-auth/jwt' {
  interface JWT {
    /**
     * Access token received from OAuth provider
     */
    accessToken?: string;

    /**
     * OAuth provider used for login
     */
    provider?: string;

    /**
     * JWT token from backend server
     * Contains userId and other user info
     */
    backendJwt?: string;

    /**
     * Refresh token from backend server
     * Used to refresh expired backend JWT
     */
    refreshToken?: string;

    /**
     * Expiration timestamp of backend JWT
     * Used to determine when to refresh the token
     */
    backendJwtExpiresAt?: number;

    /**
     * Flag indicating if user is newly created
     */
    isNewUser?: boolean;

    /**
     * User consent information
     */
    consents?: ConsentData;

    /**
     * Error message if token refresh failed
     */
    error?: string;

    /**
     * Backend auth error code (e.g., USER_DEACTIVATED, INTERNAL_SERVER_ERROR)
     */
    authError?: string;

    /**
     * Backend auth error message
     */
    authErrorMessage?: string;
  }
}
