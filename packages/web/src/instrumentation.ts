import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  // Edge runtime (middleware) excluded from Sentry to reduce bundle size (-60kB)
  // Middleware only handles auth checks and redirects
}

export const onRequestError = Sentry.captureRequestError;
