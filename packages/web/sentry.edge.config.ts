// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://3266c405a313e58b725029a578cbe546@o4510777101975552.ingest.us.sentry.io/4510777103024128',

  // Only enable Sentry in production (disable for local development)
  enabled: process.env.NODE_ENV === 'production',

  // Environment separation (dev/prod)
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'local',

  // Tracing disabled: __SENTRY_TRACING__=false tree-shakes tracing code from bundle
  tracesSampleRate: 0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
