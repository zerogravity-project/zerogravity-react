import { NavigationAdapter } from '@/app/_components/ui/navigation/NavigationAdapter';

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Public layout (/, /terms/*)
 * Providers moved to root layout
 */
export default async function PublicLayout({ children }: Readonly<PublicLayoutProps>) {
  return (
    <>
      <NavigationAdapter />
      <main id="main-content" className="relative w-full">
        {children}
      </main>
    </>
  );
}
