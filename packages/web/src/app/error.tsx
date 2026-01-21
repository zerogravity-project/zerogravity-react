'use client';

/**
 * [Root Error Boundary]
 * Catches unexpected rendering errors and displays fallback UI
 * Note: Uses Tailwind only (no Radix/Provider) for maximum safety
 */

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export default function RootError({ error, reset }: ErrorProps) {
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
  useEffect(() => {
    // TODO: Integrate with Sentry or other error tracking service
    console.error('[RootError] Unexpected error caught:', error);
  }, [error]);

  /**
   * --------------------------------------------
   * 3. Event Handlers
   * --------------------------------------------
   */
  const handleGoBack = () => {
    router.back();
  };

  /**
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-4 text-center text-white">
      <h2 className="mb-4 text-xl font-semibold">Something went wrong</h2>
      <p className="mb-6 max-w-sm text-sm text-gray-400">An unexpected error occurred. Please try again.</p>
      {error.digest && <p className="mb-6 font-mono text-xs text-gray-500">Error ID: {error.digest}</p>}
      <div className="flex gap-3">
        <button
          onClick={handleGoBack}
          className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Go back
        </button>
        <button
          onClick={reset}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
