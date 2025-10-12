'use client';

import { usePathname } from 'next/navigation';

import { Theme } from '@radix-ui/themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  return (
    <Theme grayColor="slate" accentColor="blue" appearance={isMainPage ? 'light' : 'dark'}>
      {children}
    </Theme>
  );
}
