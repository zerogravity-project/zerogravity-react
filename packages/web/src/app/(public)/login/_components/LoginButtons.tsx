'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@radix-ui/themes';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

import { useIsMobile } from '@zerogravity/shared/hooks';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';

/**
 * Login buttons component
 * Separated into Client Component to use useIsMobile hook
 * Uses next-auth/react signIn for client-side authentication
 * Reads callbackUrl from URL params to redirect after login
 * Shows alert modal if backend authentication fails
 */
export default function LoginButtons() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const authError = searchParams.get('error');
  const { openAlertModal } = useModal();

  // Check for authentication errors from NextAuth
  useEffect(() => {
    // Handle backend connection errors (Configuration, CallbackRouteError, or Default)
    const BACKEND_ERROR_TYPES = ['Configuration', 'CallbackRouteError', 'Default'];

    if (authError && BACKEND_ERROR_TYPES.includes(authError)) {
      // Show error modal
      openAlertModal({
        id: 'backend-auth-error',
        title: 'Authentication Error',
        description: 'Failed to connect to the server. Please try again later.',
        confirmText: 'OK',
      });

      // Clear error from URL while preserving callbackUrl
      const newUrl = callbackUrl !== '/' ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login';
      router.replace(newUrl);
    }
  }, [authError, openAlertModal, router, callbackUrl]);

  return (
    <div className="flex flex-col gap-4">
      <Button
        color="amber"
        size={isMobile ? '4' : '3'}
        variant="soft"
        className="w-full"
        onClick={async () => {
          await signIn('kakao', { callbackUrl });
        }}
      >
        Login With Kakao
      </Button>

      <Button
        color="blue"
        size={isMobile ? '4' : '3'}
        variant="soft"
        className="w-full"
        onClick={async () => {
          await signIn('google', { callbackUrl });
        }}
      >
        Login With Google
      </Button>
    </div>
  );
}
