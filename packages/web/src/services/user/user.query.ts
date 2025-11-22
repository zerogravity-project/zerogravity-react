/**
 * User query hooks
 * React Query hooks for user management (CSR only)
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ApiResponse, ErrorResponse } from '@/types/api.types';

import type { DeleteUserResponse, UpdateConsentRequest, UpdateConsentResponse } from './user.dto';
import { userService } from './user.service';

export const USER_QUERY_KEY = {
  PROFILE: 'userProfile',
} as const;

/**
 * GET /users/me
 * Get user profile query
 */
export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: [USER_QUERY_KEY.PROFILE],
    queryFn: userService.getUserProfile,
  });
};

/**
 * PUT /users/consent
 * Update consent mutation
 */
interface UseUpdateConsentMutationOptions {
  onSuccess?: (data: ApiResponse<UpdateConsentResponse>) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
}

export const useUpdateConsentMutation = (options: UseUpdateConsentMutationOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateConsentRequest) => userService.updateConsent(params),
    onSuccess: data => {
      // Invalidate user profile query to refresh consent data
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY.PROFILE] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

/**
 * DELETE /users/me
 * Delete user account mutation
 */
interface UseDeleteUserMutationOptions {
  onSuccess?: (data: ApiResponse<DeleteUserResponse>) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
}

export const useDeleteUserMutation = (options: UseDeleteUserMutationOptions = {}) => {
  return useMutation({
    mutationFn: userService.deleteUser,
    ...options,
  });
};
