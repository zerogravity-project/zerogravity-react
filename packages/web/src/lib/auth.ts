import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';

/**
 * Auth.js v5 Configuration
 * Centralized authentication setup for Next.js 15 App Router
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile(profile: any) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt: async ({ token, account, user }: any) => {
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
            console.log('[JWT Callback] Backend response:', data);
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
            console.error('Backend verification failed');
          }
        } catch (error) {
          console.error('[JWT Callback] Error:', error);
        }
      }

      // Store OAuth tokens and provider info
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      // Check if backend JWT is expired and refresh if needed
      if (token.backendJwtExpiresAt && Date.now() > token.backendJwtExpiresAt) {
        console.log('[JWT Callback] Backend JWT expired, refreshing...');
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
            console.log('[JWT Callback] Token refreshed successfully');
            // Update with new tokens
            token.backendJwt = data.data.accessToken;
            token.refreshToken = data.data.refreshToken;
            token.backendJwtExpiresAt = Date.now() + 15 * 60 * 1000;
          } else {
            console.error('[JWT Callback] Token refresh failed');
            // Mark token as expired to trigger re-login
            token.error = 'RefreshTokenExpired';
          }
        } catch (error) {
          console.error('[JWT Callback] Token refresh error:', error);
          token.error = 'RefreshTokenExpired';
        }
      }

      return token;
    },

    /**
     * Transform JWT into client-accessible session
     * Include consent data, isNewUser flag, and backend JWT
     * Handle token refresh errors
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: async ({ session, token }: any) => {
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      session.user.isNewUser = token.isNewUser;
      session.user.consents = token.consents;
      session.backendJwt = token.backendJwt;
      session.refreshToken = token.refreshToken;

      // Pass refresh error to client for handling
      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 minutes - synchronized with backend JWT expiration
    updateAge: 7 * 60, // 7 minutes - check and refresh session every 7 minutes
  },
});
