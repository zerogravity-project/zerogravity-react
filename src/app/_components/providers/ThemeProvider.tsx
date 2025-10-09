'use client';

import { usePathname } from 'next/navigation';

import { Theme } from '@radix-ui/themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  // route.pathname 에 따라서 다른 테마 적용
  const pathname = usePathname();

  const isDarkMode = pathname.includes('record');

  return (
    <Theme grayColor="slate" accentColor="blue" appearance={isDarkMode ? 'dark' : 'light'}>
      {children}
    </Theme>
  );
}
