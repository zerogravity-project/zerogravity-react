'use client';

import { SessionProvider } from 'next-auth/react';

import { ModalProvider } from '../ui/modal/_context/ModalContext';

import ThemeProvider from './ThemeProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ModalProvider>
          <main className="relative w-full">{children}</main>
        </ModalProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
