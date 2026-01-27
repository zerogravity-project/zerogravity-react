// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const isProduction = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: 'https://3266c405a313e58b725029a578cbe546@o4510777101975552.ingest.us.sentry.io/4510777103024128',

  // Environment separation (local/dev/prod)
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'local',

  // Disable error collection in local development (saves quota)
  beforeSend: isProduction ? undefined : () => null,

  // Tracing disabled: __SENTRY_TRACING__=false tree-shakes tracing code from bundle
  tracesSampleRate: 0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: isProduction,

  // feedbackIntegration is lazy loaded when user clicks feedback button
  // See: NavigationAdapter.client.tsx openFeedbackForm()
  integrations: [],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
