/**
 * [Catch-all API Proxy Route]
 * Proxies API requests to backend with JWT authentication
 * JWT is handled server-side only - never exposed to client
 */

import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/api-proxy';

/*
 * ============================================
 * Constants
 * ============================================
 */

/**
 * Allowed API paths (whitelist for security)
 * Only these paths will be proxied to backend
 */
const ALLOWED_PATHS = [
  // Emotions
  '/emotions/records',

  // Chart
  '/chart/level',
  '/chart/reason',
  '/chart/count',

  // Users
  '/users/me',
  '/users/consent',
  '/users/logout',

  // AI
  '/ai/period-analyses',
  '/ai/emotion-predictions',
  '/ai/diary-summaries',
] as const;

/*
 * ============================================
 * Helper Functions
 * ============================================
 */

/**
 * Check if path is allowed
 * Supports exact match and prefix match for dynamic routes
 */
function isPathAllowed(path: string): boolean {
  // Exact match
  if (ALLOWED_PATHS.includes(path as (typeof ALLOWED_PATHS)[number])) {
    return true;
  }

  // Prefix match for dynamic routes (e.g., /emotions/records/123)
  return ALLOWED_PATHS.some(allowedPath => path.startsWith(allowedPath + '/'));
}

/** Build path from params */
function buildPath(params: { path: string[] }): string {
  return '/' + params.path.join('/');
}

/*
 * ============================================
 * Route Handlers
 * ============================================
 */

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathSegments } = await params;
  const path = buildPath({ path: pathSegments });

  if (!isPathAllowed(path)) {
    return Response.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  return proxyToBackend(request, path, { method: 'GET' });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathSegments } = await params;
  const path = buildPath({ path: pathSegments });

  if (!isPathAllowed(path)) {
    return Response.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  return proxyToBackend(request, path, { method: 'POST' });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathSegments } = await params;
  const path = buildPath({ path: pathSegments });

  if (!isPathAllowed(path)) {
    return Response.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  return proxyToBackend(request, path, { method: 'PUT' });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathSegments } = await params;
  const path = buildPath({ path: pathSegments });

  if (!isPathAllowed(path)) {
    return Response.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  return proxyToBackend(request, path, { method: 'DELETE' });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathSegments } = await params;
  const path = buildPath({ path: pathSegments });

  if (!isPathAllowed(path)) {
    return Response.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  return proxyToBackend(request, path, { method: 'PATCH' });
}
