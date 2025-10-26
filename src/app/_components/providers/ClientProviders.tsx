'use client';

import { ModalProvider } from '../ui/modal/_contexts/ModalContext';

import NextAuthSessionProvider from './NextAuthSessionProvider';
import TanstackQueryProvider from './TanstackQueryProvider';
import ThemeProvider from './ThemeProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <NextAuthSessionProvider>
      <TanstackQueryProvider>
        <ThemeProvider>
          <ModalProvider>
            <main className="relative w-full">{children}</main>
          </ModalProvider>
        </ThemeProvider>
      </TanstackQueryProvider>
    </NextAuthSessionProvider>
  );
}
