/**
 * Auth service
 * API calls for authentication (SSR/CSR compatible)
 */

import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { VerifyAuthRequest, VerifyAuthResponse } from './auth.dto';

export const authService = {
  /**
   * POST /auth/verify
   * Verify OAuth user and generate backend JWT
   * Called by NextAuth after OAuth login
   */
  verifyAuth: async (params: VerifyAuthRequest): Promise<ApiResponse<VerifyAuthResponse>> => {
    const { data } = await axiosInstance.post('/auth/verify', params);
    return data;
  },

  /**
   * POST /users/logout
   * Logout user (clear JWT cookie)
   */
  logout: async (): Promise<ApiResponse<void>> => {
    const { data } = await axiosInstance.post('/users/logout');
    return data;
  },
};
