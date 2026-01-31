import { NavigationAdapter } from '@/app/_components/ui/navigation/NavigationAdapter';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Auth layout (/login)
 * Providers moved to root layout
 */
export default async function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  return (
    <>
      <NavigationAdapter />
      <main id="main-content" className="relative w-full">
        {children}
      </main>
    </>
  );
}
