/**
 * Authentication utilities for Chrome Extension
 * Uses Chrome Cookies API to read NextAuth session from web app
 */

const WEB_APP_URL = import.meta.env.VITE_WEB_APP_URL || 'http://localhost:3000';

// NextAuth cookie names (different for HTTP vs HTTPS)
const SESSION_COOKIE_NAMES = {
  http: 'authjs.session-token',
  https: '__Secure-authjs.session-token',
} as const;

export interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface SessionData {
  user?: User;
  expires?: string;
}

/**
 * Check if Chrome Extension API is available
 */
function isChromeExtension(): boolean {
  return typeof chrome !== 'undefined' && chrome.cookies !== undefined;
}

/**
 * Get NextAuth session cookie from Chrome cookie store
 * Tries both HTTP and HTTPS cookie names
 */
export async function getSessionCookie(): Promise<string | null> {
  try {
    // Check if Chrome Extension API is available
    if (!isChromeExtension()) {
      console.warn('[Auth] Chrome Extension API not available. Skipping cookie check.');
      return null;
    }

    const url = new URL(WEB_APP_URL);
    const isHttps = url.protocol === 'https:';

    // Try the appropriate cookie name for the protocol
    const cookieName = isHttps ? SESSION_COOKIE_NAMES.https : SESSION_COOKIE_NAMES.http;

    const cookie = await chrome.cookies.get({
      url: WEB_APP_URL,
      name: cookieName,
    });

    if (cookie?.value) {
      return cookie.value;
    }

    // Fallback: try the other cookie name in case of misconfiguration
    const fallbackCookieName = isHttps ? SESSION_COOKIE_NAMES.http : SESSION_COOKIE_NAMES.https;
    const fallbackCookie = await chrome.cookies.get({
      url: WEB_APP_URL,
      name: fallbackCookieName,
    });

    return fallbackCookie?.value || null;
  } catch (error) {
    console.error('[Auth] Error getting session cookie:', error);
    return null;
  }
}

/**
 * Validate session by calling NextAuth's session endpoint
 * Returns user data if session is valid, null otherwise
 */
export async function validateSession(): Promise<SessionData | null> {
  try {
    const response = await fetch(`${WEB_APP_URL}/api/auth/session`, {
      method: 'GET',
      credentials: 'include', // Include cookies in request
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[Auth] Session validation failed:', response.status);
      return null;
    }

    const data = await response.json();

    // NextAuth returns empty object {} if no session
    if (!data || !data.user) {
      return null;
    }

    return data as SessionData;
  } catch (error) {
    console.error('[Auth] Error validating session:', error);
    return null;
  }
}

/**
 * Get user information from current session
 * Combines cookie check and session validation
 */
export async function getUserInfo(): Promise<{
  isAuthenticated: boolean;
  user: User | null;
  sessionData: SessionData | null;
}> {
  // First check if session cookie exists
  const cookie = await getSessionCookie();

  if (!cookie) {
    return {
      isAuthenticated: false,
      user: null,
      sessionData: null,
    };
  }

  // Validate session with backend
  const sessionData = await validateSession();

  if (!sessionData || !sessionData.user) {
    return {
      isAuthenticated: false,
      user: null,
      sessionData: null,
    };
  }

  return {
    isAuthenticated: true,
    user: sessionData.user,
    sessionData,
  };
}
