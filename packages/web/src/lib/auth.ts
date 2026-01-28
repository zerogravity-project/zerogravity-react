/**
 * [Auth.js v5 configuration]
 * Centralized authentication setup for Next.js 15 App Router
 * Providers: Google, Kakao
 * Callbacks: jwt, session
 * Pages: signIn, error
 * Session: strategy, maxAge, updateAge
 */

import NextAuth, { Account, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

/** Kakao OAuth profile structure */
interface KakaoProfile {
  id: number;
  properties?: {
    nickname?: string;
    thumbnail_image?: string;
    profile_image?: string;
  };
  kakao_account?: {
    email?: string;
  };
}

/** Refresh token response data */
interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Refresh lock to prevent concurrent refresh attempts */
let isRefreshing = false;
let refreshPromise: Promise<RefreshTokenData> | null = null;

/** Refresh JWT 5 minutes before expiration to avoid timing issues */
const REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Define auth handlers
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Kakao({
      clientId: process.env.AUTH_KAKAO_ID,
      clientSecret: process.env.AUTH_KAKAO_SECRET,
      /**
       * Use thumbnail_image as default profile image
       * Fallback to profile_image if thumbnail_image is not available
       */
      profile(profile: KakaoProfile) {
        return {
          id: profile.id.toString(),
          name: profile.properties?.nickname,
          email: profile.kakao_account?.email,
          image: profile.properties?.thumbnail_image || profile.properties?.profile_image,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * Store account information from OAuth provider and verify with backend
     * On initial sign-in, call backend /auth/verify to get backend JWT
     * Store isNewUser flag and consent data in token
     * Handle token refresh when access token expires
     */
    jwt: async ({
      token,
      account,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      account?: Account | null;
      user: User;
      trigger?: 'signIn' | 'signUp' | 'update';
      session?: Session;
    }) => {
      // Handle session update (when updateSession() is called from client)
      if (trigger === 'update' && session?.user?.consents) {
        token.consents = session.user.consents;
        return token;
      }

      // Initial sign-in: call backend to verify/create user and get backend JWT
      if (account && user) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider: account.provider.toUpperCase(),
              providerId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Store isNewUser flag and consent data from ApiResponse wrapper
            // Note: Jackson serializes boolean isNewUser() getter as "newUser" in JSON
            token.isNewUser = data.data.newUser;
            token.consents = data.data.consents;
            // Store backend JWT and refresh token
            token.backendJwt = data.data.jwtToken;
            token.refreshToken = data.data.refreshToken;
            // Set expiration time (15 minutes from now)
            token.backendJwtExpiresAt = Date.now() + 15 * 60 * 1000;
          } else {
            console.error('[JWT Callback] Backend verification failed:', response.status);
            // Throw error to prevent login - NextAuth will redirect to login with error
            throw new Error('BackendVerificationFailed');
          }
        } catch {
          console.error('[JWT Callback] Backend connection error');
          // Throw error to prevent login
          throw new Error('BackendConnectionError');
        }
      }

      // Store OAuth tokens and provider info
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      // Check if backend JWT is expired and refresh if needed (with 5-minute buffer)
      if (token.backendJwtExpiresAt && Date.now() > token.backendJwtExpiresAt - REFRESH_BUFFER_MS) {
        // If already refreshing, wait for the ongoing refresh to complete
        if (isRefreshing && refreshPromise) {
          try {
            const refreshedData = await refreshPromise;
            token.backendJwt = refreshedData.accessToken;
            token.refreshToken = refreshedData.refreshToken;
            token.backendJwtExpiresAt = refreshedData.expiresAt;
            return token;
          } catch {
            console.error('[JWT Callback] Waiting for refresh failed');
            token.error = 'RefreshTokenExpired';
            // Clear invalid tokens to force re-login
            token.backendJwt = undefined;
            token.refreshToken = undefined;
            token.backendJwtExpiresAt = undefined;
            return token;
          }
        }

        // Start new refresh
        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                refreshToken: token.refreshToken,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              return {
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                expiresAt: Date.now() + 15 * 60 * 1000,
              };
            } else {
              console.error('[JWT Callback] Token refresh failed:', response.status);
              throw new Error('RefreshTokenExpired');
            }
          } catch (error) {
            console.error('[JWT Callback] Token refresh error');
            throw error;
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        })();

        try {
          const refreshedData = await refreshPromise;
          token.backendJwt = refreshedData.accessToken;
          token.refreshToken = refreshedData.refreshToken;
          token.backendJwtExpiresAt = refreshedData.expiresAt;
        } catch {
          console.error('[JWT Callback] Token refresh error');
          token.error = 'RefreshTokenExpired';
          // Clear invalid tokens to force re-login
          token.backendJwt = undefined;
          token.refreshToken = undefined;
          token.backendJwtExpiresAt = undefined;
        }
      }

      return token;
    },

    /**
     * Transform JWT into client-accessible session
     * Include consent data, isNewUser flag, and backend JWT
     * Pass error state for client-side handling (e.g., force sign out)
     */
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      session.user.isNewUser = token.isNewUser;
      session.user.consents = token.consents;
      session.backendJwt = token.backendJwt;
      session.refreshToken = token.refreshToken;
      session.error = token.error;

      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days - session expires after 30 days
    updateAge: 24 * 60 * 60, // 24 hours - session is refreshed every 24 hours
  },
});
