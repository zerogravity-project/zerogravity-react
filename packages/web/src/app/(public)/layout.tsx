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
      {children}
    </>
  );
}
