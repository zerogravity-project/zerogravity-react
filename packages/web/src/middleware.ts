/**
 * [Middleware]
 * Protects routes, checks consent, and redirects appropriately
 */

import type { NextRequest } from 'next/server';

import { auth } from './lib/auth';

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = ['/', '/login', '/terms'];

/**
 * Required consents for accessing protected routes
 */
const REQUIRED_CONSENTS = ['termsAgreed', 'privacyAgreed', 'sensitiveDataConsent'];

/**
 * Auth.js v5 Middleware
 * Protects routes, checks consent, and redirects appropriately
 */
export default auth((req: NextRequest & { auth: any }) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;
  const isLoginPage = pathname === '/login';
  const isConsentPage = pathname === '/consent';
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  // 1. Not logged in and trying to access non-public route
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return Response.redirect(loginUrl);
  }

  // 2. Logged in and trying to access login page
  if (isLoggedIn && isLoginPage) {
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/';
    return Response.redirect(new URL(callbackUrl, req.nextUrl.origin));
  }

  // 3. Logged in user without consent - redirect to consent page
  if (isLoggedIn && !isConsentPage) {
    const consents = req.auth?.user?.consents;
    const hasAllConsents = REQUIRED_CONSENTS.every(consent => consents?.[consent as keyof typeof consents] === true);

    if (!hasAllConsents) {
      return Response.redirect(new URL('/consent', req.nextUrl.origin));
    }
  }
});

/**
 * Configure which routes to protect
 * Excludes static files and API routes
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
