'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface TanstackQueryProviderProps {
  children: React.ReactNode;
}

/**
 * ============================================
 * Component
 * ============================================
 *
 * TanStack Query provider with default configuration
 * Configures staleTime, gcTime, retry, and refetch options
 *
 * @param children - Child components to wrap
 */
export default function TanstackQueryProvider({ children }: TanstackQueryProviderProps) {
  /**
   * --------------------------------------------
   * 1. Computed Values
   * --------------------------------------------
   */

  /** Create QueryClient instance (recreated on each render but memoized) */
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
    []
  );

  /**
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  if (!queryClient) return null;

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
