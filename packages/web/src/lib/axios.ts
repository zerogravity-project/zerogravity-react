import axios from 'axios';
import type { Session } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Add backend JWT to Authorization header
 */
axiosInstance.interceptors.request.use(
  async config => {
    const session = await getSession();

    // Add backend JWT if available
    if ((session as Session & { backendJwt?: string }).backendJwt) {
      config.headers.Authorization = `Bearer ${(session as Session & { backendJwt?: string }).backendJwt}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle 401 errors and redirect to login
 */
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.error('[Axios] Unauthorized - signing out');
      // Invalidate session and redirect to login page
      await signOut({ callbackUrl: '/login' });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
