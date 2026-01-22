import { ThemeProvider } from '@zerogravity/shared/components/providers';

import { NavigationAdapter } from '@/app/_components/ui/navigation/NavigationAdapter';

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Public layout (/, /terms/*)
 * Includes Theme for Radix UI components
 * No Session, Query, or Modal providers needed
 */
export default async function PublicLayout({ children }: Readonly<PublicLayoutProps>) {
  return (
    <ThemeProvider>
      <NavigationAdapter />
      <main id="main-content" className="relative w-full">
        {children}
      </main>
    </ThemeProvider>
  );
}
