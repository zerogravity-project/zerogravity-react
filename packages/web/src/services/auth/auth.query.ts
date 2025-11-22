/**
 * Auth query hooks
 * React Query hooks for authentication (CSR only)
 */

'use client';

import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ApiResponse, ErrorResponse } from '@/types/api.types';

import type { VerifyAuthRequest, VerifyAuthResponse } from './auth.dto';
import { authService } from './auth.service';

/**
 * POST /auth/verify
 * Verify OAuth user mutation
 */
interface UseVerifyAuthMutationOptions {
  onSuccess?: (data: ApiResponse<VerifyAuthResponse>) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
}

export const useVerifyAuthMutation = (options: UseVerifyAuthMutationOptions = {}) => {
  return useMutation({
    mutationFn: (params: VerifyAuthRequest) => authService.verifyAuth(params),
    ...options,
  });
};

/**
 * POST /users/logout
 * Logout mutation
 */
interface UseLogoutMutationOptions {
  onSuccess?: (data: ApiResponse<void>) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
}

export const useLogoutMutation = (options: UseLogoutMutationOptions = {}) => {
  return useMutation({
    mutationFn: authService.logout,
    ...options,
  });
};
