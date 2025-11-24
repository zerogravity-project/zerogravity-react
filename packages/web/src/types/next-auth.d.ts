import { DefaultSession } from 'next-auth';

/**
 * Consent data structure from backend
 */
export interface ConsentData {
  termsAgreed: boolean;
  termsAgreedAt?: string;
  privacyAgreed: boolean;
  privacyAgreedAt?: string;
  sensitiveDataConsent: boolean;
  sensitiveDataConsentAt?: string;
  aiAnalysisConsent: boolean;
  aiAnalysisConsentAt?: string;
  consentVersion: string;
}

/**
 * Extend NextAuth Session type
 * Add accessToken, provider, backendJwt, userId, consent data, and new user flag
 */
declare module 'next-auth' {
  interface User {
    isNewUser?: boolean;
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
     * Error message if authentication failed
     */
    error?: string;

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
     * Flag indicating if user is newly created
     */
    isNewUser?: boolean;

    /**
     * User consent information
     */
    consents?: ConsentData;

    /**
     * Error message if authentication failed
     */
    error?: string;
  }
}
