import { DefaultSession } from 'next-auth';

/**
 * Extend NextAuth Session type
 * Add accessToken, provider, backendJwt, and userId information
 */
declare module 'next-auth' {
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
  }
}

/**
 * Extend NextAuth JWT type
 * Store OAuth token information and backend JWT
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
  }
}
