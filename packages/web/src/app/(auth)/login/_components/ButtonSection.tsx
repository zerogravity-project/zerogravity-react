/**
 * [ButtonSection component]
 * Login button section with auth error handling
 */
'use client';

import { useSearchParams } from 'next/navigation';

import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';

import { LoginButton } from './LoginButton';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Error messages by backend error code */
const ERROR_MODAL_MAP: Record<string, { title: string; description: string }> = {
  USER_DEACTIVATED: {
    title: 'Deactivated Account',
    description: 'This account has been deactivated. Please contact support to restore your account.',
  },
  BACKEND_CONNECTION_ERROR: {
    title: 'Server Connection Error',
    description: 'Unable to connect to the server. Please try again later.',
  },
};

/** Default error modal for unknown error codes */
const DEFAULT_ERROR_MODAL = {
  title: 'Login Error',
  description: 'An error occurred during login. Please try again later.',
};

/*
 * ============================================
 * Component
 * ============================================
 */

/**
 * Login button section
 * Handles auth errors and renders social login buttons
 */
export function ButtonSection() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { openAlertModal } = useModal();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const authError = session?.authError;
  const authErrorMessage = session?.authErrorMessage;

  /*
   * --------------------------------------------
   * 3. Effects
   * --------------------------------------------
   */
  /** Check for authentication errors from session */
  useEffect(() => {
    if (!authError) return;

    const modal = ERROR_MODAL_MAP[authError] || {
      ...DEFAULT_ERROR_MODAL,
      description: authErrorMessage || DEFAULT_ERROR_MODAL.description,
    };

    openAlertModal({
      id: 'auth-error',
      title: modal.title,
      description: authErrorMessage || modal.description,
      confirmText: 'OK',
      onConfirm: () => {
        signOut({ redirect: false });
      },
    });
  }, [authError, authErrorMessage, openAlertModal]);

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <div className="flex w-full flex-col gap-3">
      <LoginButton provider="google" callbackUrl={callbackUrl} />
      <LoginButton provider="kakao" callbackUrl={callbackUrl} />
    </div>
  );
}
