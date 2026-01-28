import { MotionProvider, ThemeProvider } from '@zerogravity/shared/components/providers';

import { ModalProvider } from '@/app/_components/ui/modal/_contexts/ModalContext';
import { AlertModal } from '@/app/_components/ui/modal/AlertModal';
import { ComponentModal } from '@/app/_components/ui/modal/ComponentModal';
import { ConfirmModal } from '@/app/_components/ui/modal/ConfirmModal';
import { FeedbackModal } from '@/app/_components/ui/modal/FeedbackModal';
import { NavigationAdapter } from '@/app/_components/ui/navigation/NavigationAdapter';

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Public layout (/, /terms/*)
 * Includes Theme for Radix UI components
 * ModalProvider added for feedback form and terms modals
 */
export default async function PublicLayout({ children }: Readonly<PublicLayoutProps>) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <ModalProvider>
          <NavigationAdapter />
          <main id="main-content" className="relative w-full">
            {children}
          </main>
          <AlertModal />
          <ConfirmModal />
          <ComponentModal />
          <FeedbackModal />
        </ModalProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
