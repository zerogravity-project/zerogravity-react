'use client';

import { SessionProvider } from 'next-auth/react';

import { TopNavigation } from '../ui';

import ThemeProvider from './ThemeProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <TopNavigation />
        <main className="relative w-full">{children}</main>
      </ThemeProvider>
    </SessionProvider>
  );
}
