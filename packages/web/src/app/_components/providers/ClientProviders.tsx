'use client';

import NextAuthSessionProvider from './NextAuthSessionProvider';
import TanstackQueryProvider from './TanstackQueryProvider';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ClientProvidersProps {
  children: React.ReactNode;
}

/*
 * ============================================
 * Component
 * ============================================
 *
 * Protected routes client-side providers
 * Session and Query providers only
 * Theme and Modal providers moved to root layout
 *
 * @param children - Child components to wrap
 */
export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <NextAuthSessionProvider>
      <TanstackQueryProvider>{children}</TanstackQueryProvider>
    </NextAuthSessionProvider>
  );
}
