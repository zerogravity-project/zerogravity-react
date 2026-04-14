/**
 * [ButtonSection component]
 * Login button section with auth error handling
 */
'use client';

import { useSearchParams } from 'next/navigation';

import { useEffect } from 'react';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';

import { LoginButton } from './LoginButton';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Error modal config by backend error code */
const ERROR_MODAL_MAP: Record<string, { title: string; description: string }> = {
  USER_DEACTIVATED: {
    title: 'Deactivated Account',
    description: 'This account has been deactivated. Please contact support to restore your account.',
  },
  BACKEND_CONNECTION_ERROR: {
    title: 'Server Connection Error',
    description: 'Unable to connect to the server. Please try again later.',
  },
  INVALID_ARGUMENT: {
    title: 'Invalid Request',
    description: 'The login request was invalid. Please try again.',
  },
  INTERNAL_SERVER_ERROR: {
    title: 'Server Error',
    description: 'An unexpected server error occurred. Please try again later.',
  },
};

/** Default error modal for unknown error codes */
const DEFAULT_ERROR_MODAL = {
  title: 'Login Error',
  description: 'An error occurred during login. Please try again later.',
};

/** Cookie name for auth error details */
const AUTH_ERROR_COOKIE = 'auth-error';

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
  const { openAlertModal } = useModal();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  /*
   * --------------------------------------------
   * 3. Effects
   * --------------------------------------------
   */
  /** Check for authentication errors from cookie */
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${AUTH_ERROR_COOKIE}=`))
      ?.split('=')
      .slice(1)
      .join('=');

    if (!cookieValue) return;

    // Clear cookie immediately
    document.cookie = `${AUTH_ERROR_COOKIE}=; path=/; max-age=0`;

    try {
      const { error, message } = JSON.parse(decodeURIComponent(cookieValue));
      const modal = ERROR_MODAL_MAP[error] || DEFAULT_ERROR_MODAL;

      openAlertModal({
        id: 'auth-error',
        title: modal.title,
        description: message || modal.description,
        confirmText: 'OK',
      });
    } catch {
      openAlertModal({
        id: 'auth-error',
        title: DEFAULT_ERROR_MODAL.title,
        description: DEFAULT_ERROR_MODAL.description,
        confirmText: 'OK',
      });
    }
  }, [openAlertModal]);

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
