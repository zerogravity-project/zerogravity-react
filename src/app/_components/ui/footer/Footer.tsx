'use client';

import Link from 'next/link';

import { Link as RadixLink, Text } from '@radix-ui/themes';
import { Fragment } from 'react';

import { cn } from '@/app/_utils/styleUtils';

interface FooterMenuItem {
  text: string;
  linkPath: string;
  defaultColor?: string;
  activeColor?: string;
}

interface FooterBarProps {
  className?: string;
}

export const FOOTER_MENU_LIST: FooterMenuItem[] = [
  {
    text: 'Terms of Service',
    linkPath: 'terms',
  },
  {
    text: 'Privacy Policy',
    linkPath: 'privacy-policy',
  },
];

export default function FooterBar({ className }: FooterBarProps) {
  return (
    <footer
      className={cn(
        'fixed bottom-0 left-0 z-5 flex w-full items-center justify-between px-8 py-5',
        'max-sm:flex-col max-sm:items-start max-sm:gap-2 max-sm:px-6 max-sm:py-6',
        className
      )}
    >
      <ul className="flex items-center gap-2">
        {FOOTER_MENU_LIST.map((menu, index) => (
          <Fragment key={index}>
            <li>
              <RadixLink asChild color="gray" size="1">
                <Link href={`/${menu.linkPath}`}>
                  <span className="text-[var(--gray-8)] transition-opacity hover:opacity-80">{menu.text}</span>
                </Link>
              </RadixLink>
            </li>

            {index !== FOOTER_MENU_LIST.length - 1 && (
              <div className="mt-[3px] h-[3px] w-[3px] flex-shrink-0 rounded-[9999px] bg-[var(--gray-8)]" />
            )}
          </Fragment>
        ))}
      </ul>
      <Text className="text-[var(--gray-9)]" weight="light" size="1">
        © Zero Gravity. All rights reserved.
      </Text>
    </footer>
  );
}
