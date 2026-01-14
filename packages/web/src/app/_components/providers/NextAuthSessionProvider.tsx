'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface NextAuthSessionProviderProps {
  children: ReactNode;
}

/*
 * ============================================
 * Component
 * ============================================
 *
 * NextAuth session provider wrapper
 * Enables useSession hook throughout the app
 *
 * @param children - Child components to wrap
 */
export default function NextAuthSessionProvider({ children }: NextAuthSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
