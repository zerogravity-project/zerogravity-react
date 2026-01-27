import { MotionProvider, ThemeProvider } from '@zerogravity/shared/components/providers';

import { ModalProvider } from '@/app/_components/ui/modal/_contexts/ModalContext';
import { AlertModal } from '@/app/_components/ui/modal/AlertModal';
import { FeedbackModal } from '@/app/_components/ui/modal/FeedbackModal';
import { NavigationAdapter } from '@/app/_components/ui/navigation/NavigationAdapter';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Auth layout (/login)
 * Includes Theme + Modal for login error alerts
 * No Session or Query providers needed
 */
export default async function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <ModalProvider>
          <NavigationAdapter />
          <main id="main-content" className="relative w-full">
            {children}
          </main>
          <AlertModal />
          <FeedbackModal />
        </ModalProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
