/**
 * [Axios configuration]
 * Axios instance for API proxy routes
 * JWT is handled server-side via Route Handlers - not exposed to client
 * Request interceptor adds X-Timezone header
 * Response interceptor handles 401 errors
 */

import axios from 'axios';
import { signOut } from 'next-auth/react';

/** Create axios instance pointing to Next.js API routes */
const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Add X-Timezone header for backend date/time handling
 * Note: JWT is added server-side by api-proxy.ts, not here
 */
axiosInstance.interceptors.request.use(
  config => {
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
 * Handle 401 errors by redirecting to login
 * Token refresh is handled server-side by auth.ts jwt callback
 */
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        await signOut({ callbackUrl: '/login' });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
