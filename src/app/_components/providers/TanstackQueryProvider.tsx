'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';

interface TanstackQueryProviderProps {
  children: React.ReactNode;
}

export default function TanstackQueryProvider({ children }: TanstackQueryProviderProps) {
  // Create QueryClient instance (recreated on each render but memoized)
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

  if (!queryClient) return null;

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
