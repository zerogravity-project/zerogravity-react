import type { NextRequest } from 'next/server';

import { auth } from './lib/auth';

/**
 * Auth.js v5 Middleware
 * Protects routes and redirects to login with callbackUrl
 */
export default auth((req: NextRequest & { auth: any }) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === '/login';

  // If not logged in and trying to access protected route
  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    // Add the original path as callbackUrl
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // If logged in and trying to access login page, redirect to callbackUrl or home
  if (isLoggedIn && isLoginPage) {
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/';
    return Response.redirect(new URL(callbackUrl, req.nextUrl.origin));
  }
});

/**
 * Configure which routes to protect
 */
export const config = {
  matcher: [
    '/login', // Include login page to redirect logged-in users
    '/spaceout/:path*', // Spaceout (meditation/relaxation) pages
    '/record/:path*', // Emotion recording pages
    '/profile/:path*', // Profile pages
  ],
};
