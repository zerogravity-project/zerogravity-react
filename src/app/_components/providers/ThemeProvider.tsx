'use client';

import { Theme } from '@radix-ui/themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <Theme grayColor="slate" accentColor="red">
      {children}
    </Theme>
  );
}
