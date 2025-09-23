import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    // Additional middleware logic can be added here when needed.
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/spaceout/:path*', '/record/:path*', '/profile/:path*'],
};
