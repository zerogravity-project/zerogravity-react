'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface NextAuthSessionProviderProps {
  children: ReactNode;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export default function NextAuthSessionProvider({ children }: NextAuthSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
