/**
 * [API Proxy Utility]
 * Server-side proxy helper for forwarding requests to backend
 * JWT is added server-side only - never exposed to client
 */

import { NextRequest, NextResponse } from 'next/server';

import { auth } from './auth';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Backend API base URL */
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/*
 * ============================================
 * Types
 * ============================================
 */

/** Proxy request options */
interface ProxyOptions {
  /** Override HTTP method */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Request body (for POST/PUT/PATCH) */
  body?: unknown;
  /** Additional headers */
  headers?: Record<string, string>;
}

/** Extended session type with backend JWT */
interface SessionWithJwt {
  backendJwt?: string;
  refreshToken?: string;
}

/*
 * ============================================
 * Functions
 * ============================================
 */

/**
 * Proxy request to backend with JWT authentication
 * @param request - Next.js request object
 * @param path - Backend API path (e.g., '/emotions/records')
 * @param options - Optional proxy options
 * @returns NextResponse with backend response
 */
export async function proxyToBackend(
  request: NextRequest,
  path: string,
  options?: ProxyOptions
): Promise<NextResponse> {
  /**
   * --------------------------------------------
   * 1. Authentication Check
   * --------------------------------------------
   */
  const session = (await auth()) as SessionWithJwt | null;

  if (!session?.backendJwt) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  /**
   * --------------------------------------------
   * 2. Build Request
   * --------------------------------------------
   */
  const method = options?.method || request.method;
  const url = new URL(path, BACKEND_URL);

  // Forward query parameters for GET requests
  if (method === 'GET') {
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.backendJwt}`,
    ...options?.headers,
  };

  // Forward X-Timezone header if present
  const timezone = request.headers.get('X-Timezone');
  if (timezone) {
    headers['X-Timezone'] = timezone;
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  // Add body for POST/PUT/PATCH
  if (options?.body) {
    fetchOptions.body = JSON.stringify(options.body);
  } else if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      const body = await request.json();
      fetchOptions.body = JSON.stringify(body);
    } catch {
      // No body or invalid JSON - continue without body
    }
  }

  /**
   * --------------------------------------------
   * 3. Execute Request
   * --------------------------------------------
   */
  try {
    const response = await fetch(url.toString(), fetchOptions);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    console.error('[API Proxy] Request failed');
    return NextResponse.json({ success: false, error: 'Backend request failed' }, { status: 502 });
  }
}
