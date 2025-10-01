import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api-zerogravity`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async config => {
    // NextAuth 세션에서 토큰 가져오기 (필요시)
    const session = await getSession();
    if (session?.accessToken) {
      // 필요하다면 Authorization 헤더에 토큰 추가
      // config.headers.Authorization = `Bearer ${session.accessToken}`
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response?.status === 401) {
      // eslint-disable-next-line no-console
      console.log('인증 에러가 발생했습니다.');
      // NextAuth 세션 무효화 및 로그인 페이지로 리다이렉트
      await signOut({ callbackUrl: '/login' });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
