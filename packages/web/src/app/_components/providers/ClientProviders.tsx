'use client';

import { MotionProvider, ThemeProvider } from '@zerogravity/shared/components/providers';

import { ModalProvider } from '../ui/modal/_contexts/ModalContext';
import { AlertModal } from '../ui/modal/AlertModal';
import { ComponentModal } from '../ui/modal/ComponentModal';
import { ConfirmModal } from '../ui/modal/ConfirmModal';
import { TermsModal } from '../ui/modal/TermsModal';

import NextAuthSessionProvider from './NextAuthSessionProvider';
import TanstackQueryProvider from './TanstackQueryProvider';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ClientProvidersProps {
  children: React.ReactNode;
}

/*
 * ============================================
 * Component
 * ============================================
 *
 * Root client-side providers composition
 * Wraps app with Session, Query, Theme, and Modal providers
 * Renders global modal components
 *
 * @param children - Child components to wrap
 */
export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <NextAuthSessionProvider>
      <TanstackQueryProvider>
        <ThemeProvider>
          <MotionProvider>
            <ModalProvider>
              <main id="main-content" className="relative w-full">
                {children}
              </main>
              {/* Global state-based modals */}
              <AlertModal />
              <ConfirmModal />
              <ComponentModal />
              {/* Global hash-based modals */}
              <TermsModal />
            </ModalProvider>
          </MotionProvider>
        </ThemeProvider>
      </TanstackQueryProvider>
    </NextAuthSessionProvider>
  );
}
