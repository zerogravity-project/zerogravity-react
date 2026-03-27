'use client';

import { useRouter } from 'next/navigation';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

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
 * Sets timezone cookie for server-side API requests
 *
 * @param children - Child components to wrap
 */
export default function NextAuthSessionProvider({ children }: NextAuthSessionProviderProps) {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const router = useRouter();

  /**
   * --------------------------------------------
   * 2. Effects
   * --------------------------------------------
   */

  /** Sync timezone cookie — update and refresh server components if timezone changed */
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const existingTz = document.cookie
      .split('; ')
      .find(row => row.startsWith('tz='))
      ?.split('=')[1];

    if (existingTz !== tz) {
      document.cookie = `tz=${tz}; path=/; max-age=31536000; SameSite=Lax`;
      router.refresh();
    }
  }, [router]);

  /**
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return <SessionProvider>{children}</SessionProvider>;
}
