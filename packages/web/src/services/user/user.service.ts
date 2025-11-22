/**
 * User service
 * API calls for user management (SSR/CSR compatible)
 */

import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';

import type {
  GetUserProfileResponse,
  UpdateConsentRequest,
  UpdateConsentResponse,
  DeleteUserResponse,
} from './user.dto';

export const userService = {
  /**
   * GET /users/me
   * Get user profile
   */
  getUserProfile: async (): Promise<GetUserProfileResponse> => {
    const { data } = await axiosInstance.get('/users/me');
    return data;
  },

  /**
   * PUT /users/consent
   * Update user consent preferences
   */
  updateConsent: async (params: UpdateConsentRequest): Promise<ApiResponse<UpdateConsentResponse>> => {
    const { data } = await axiosInstance.put('/users/consent', params);
    return data;
  },

  /**
   * DELETE /users/me
   * Delete user account
   */
  deleteUser: async (): Promise<ApiResponse<DeleteUserResponse>> => {
    const { data } = await axiosInstance.delete('/users/me');
    return data;
  },
};
