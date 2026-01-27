'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

import { MotionButton } from '@zerogravity/shared/components/ui/button';
import { useIsMobile } from '@zerogravity/shared/hooks';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Backend connection error types from NextAuth */
const BACKEND_ERROR_TYPES = ['Configuration', 'CallbackRouteError', 'Default'];

/*
 * ============================================
 * Component
 * ============================================
 */

/**
 * Login buttons component
 * Separated into Client Component to use useIsMobile hook
 * Uses next-auth/react signIn for client-side authentication
 * Reads callbackUrl from URL params to redirect after login
 * Shows alert modal if backend authentication fails
 */
export default function LoginButtons() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openAlertModal } = useModal();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const authError = searchParams.get('error');

  /*
   * --------------------------------------------
   * 3. Effects
   * --------------------------------------------
   */
  /** Check for authentication errors from NextAuth */
  useEffect(() => {
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

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <div className="flex flex-col gap-4">
      <MotionButton
        color="amber"
        size={isMobile ? '4' : '3'}
        variant="soft"
        className="w-full"
        onClick={async () => {
          await signIn('kakao', { callbackUrl });
        }}
      >
        Login With Kakao
      </MotionButton>

      <MotionButton
        color="blue"
        size={isMobile ? '4' : '3'}
        variant="soft"
        className="w-full"
        onClick={async () => {
          await signIn('google', { callbackUrl });
        }}
      >
        Login With Google
      </MotionButton>
    </div>
  );
}
