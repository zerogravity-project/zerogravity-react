import '@testing-library/jest-dom';
import * as React from 'react';

// Make React available globally for JSX
(global as any).React = React;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession() {
    return {
      data: null,
      status: 'unauthenticated',
    };
  },
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock Radix UI components
jest.mock('@radix-ui/themes');

// Mock Terms content components
jest.mock('@/app/terms/[type]/_components/AIAnalysisContent', () => ({
  AIAnalysisContent: () => 'AI Analysis Content',
}));

jest.mock('@/app/terms/[type]/_components/PrivacyPolicyContent', () => ({
  PrivacyPolicyContent: () => 'Privacy Policy Content',
}));

jest.mock('@/app/terms/[type]/_components/SensitiveDataContent', () => ({
  SensitiveDataContent: () => 'Sensitive Data Content',
}));

jest.mock('@/app/terms/[type]/_components/ServiceTermsContent', () => ({
  ServiceTermsContent: () => 'Service Terms Content',
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8080/api-zerogravity';
