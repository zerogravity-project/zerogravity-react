'use client';

import { usePathname } from 'next/navigation';

import { NavigationAdapter } from '@/app/_components/ui/navigation/NavigationAdapter';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const pathname = usePathname();
  const isTermsPage = pathname.startsWith('/terms');

  return (
    <>
      <NavigationAdapter className="fixed top-0" background={isTermsPage} />
      {children}
    </>
  );
}
