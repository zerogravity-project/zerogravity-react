'use client';

import { ThemeProvider } from '@zerogravity/shared/components/providers';

import { ModalProvider } from '../ui/modal/_contexts/ModalContext';
import { AlertModal } from '../ui/modal/AlertModal';
import { ComponentModal } from '../ui/modal/ComponentModal';
import { ConfirmModal } from '../ui/modal/ConfirmModal';
import { TermsModal } from '../ui/modal/TermsModal';

import NextAuthSessionProvider from './NextAuthSessionProvider';
import TanstackQueryProvider from './TanstackQueryProvider';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ClientProvidersProps {
  children: React.ReactNode;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <NextAuthSessionProvider>
      <TanstackQueryProvider>
        <ThemeProvider>
          <ModalProvider>
            <main className="relative w-full">{children}</main>
            {/* Global state-based modals */}
            <AlertModal />
            <ConfirmModal />
            <ComponentModal />
            {/* Global hash-based modals */}
            <TermsModal />
          </ModalProvider>
        </ThemeProvider>
      </TanstackQueryProvider>
    </NextAuthSessionProvider>
  );
}
