/**
 * [Axios configuration]
 * Axios instance with base URL, credentials, and headers
 * Request interceptor to add backend JWT and X-Timezone header
 * Response interceptor to handle 401 errors and refresh token
 */

import axios from 'axios';
import type { Session } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';

/** API base URL */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** Create axios instance */
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Add backend JWT to Authorization header and X-Timezone header
 */
axiosInstance.interceptors.request.use(
  async config => {
    const session = await getSession();

    // Add backend JWT if available
    if ((session as Session & { backendJwt?: string }).backendJwt) {
      config.headers.Authorization = `Bearer ${(session as Session & { backendJwt?: string }).backendJwt}`;
    }

    // Add X-Timezone header with user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    config.headers['X-Timezone'] = timezone;

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle 401 errors: try to refresh token, otherwise redirect to login
 */
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Handle authentication errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get current session to check for refresh token error
        const session = await getSession();

        // If session has RefreshTokenExpired error, force logout
        if ((session as any)?.error === 'RefreshTokenExpired') {
          console.error('[Axios] Refresh token expired - signing out');
          if (typeof window !== 'undefined') {
            await signOut({ callbackUrl: '/login' });
          }
          return Promise.reject(error);
        }

        // Try to refresh the token
        const refreshToken = (session as any)?.refreshToken;
        if (!refreshToken) {
          console.error('[Axios] No refresh token available - signing out');
          if (typeof window !== 'undefined') {
            await signOut({ callbackUrl: '/login' });
          }
          return Promise.reject(error);
        }

        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken,
          }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();

          // Update the Authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

          // Retry the original request with new token
          return axiosInstance(originalRequest);
        } else {
          console.error('[Axios] Token refresh failed - signing out');
          if (typeof window !== 'undefined') {
            await signOut({ callbackUrl: '/login' });
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('[Axios] Token refresh error:', refreshError);
        if (typeof window !== 'undefined') {
          await signOut({ callbackUrl: '/login' });
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
