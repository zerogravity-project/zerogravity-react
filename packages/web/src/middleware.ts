/**
 * [Middleware]
 * Protects routes, checks consent, and redirects appropriately
 */

import type { NextAuthRequest } from 'next-auth';

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
export default auth((req: NextAuthRequest) => {
  // Check if session is valid (has backendJwt and no error)
  // Token refresh failure results in cleared backendJwt and error flag
  const hasValidSession = !!req.auth?.backendJwt && !req.auth?.error;
  const isLoggedIn = hasValidSession;
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

  // 3. Consent check for logged in users
  if (isLoggedIn) {
    const consents = req.auth?.user?.consents;
    const hasAllConsents = REQUIRED_CONSENTS.every(consent => consents?.[consent as keyof typeof consents] === true);

    // 3-1. Already consented user trying to access consent page → redirect to home
    if (isConsentPage && hasAllConsents) {
      return Response.redirect(new URL('/', req.nextUrl.origin));
    }

    // 3-2. User without consent trying to access protected route → redirect to consent
    if (!isConsentPage && !hasAllConsents) {
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
