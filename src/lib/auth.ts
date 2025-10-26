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
              provider: account.provider,
              providerId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            token.backendJwt = data.token; // Backend JWT (contains userId)
          }
        } catch (error) {
          console.error('[JWT Callback] Backend verification failed:', error);
        }
      }

      // Store OAuth tokens and provider info
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      return token;
    },

    /**
     * Transform JWT into client-accessible session
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: async ({ session, token }: any) => {
      session.backendJwt = token.backendJwt;
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour - synchronized with backend JWT expiration
    updateAge: 60 * 30, // 30 minutes - check and refresh session every 30 minutes
  },
});
