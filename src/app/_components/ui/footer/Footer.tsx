'use client';

import Link from 'next/link';

import { Link as RadixLink, Text } from '@radix-ui/themes';

import { cn } from '@/lib/utils';

interface FooterMenuItem {
  text: string;
  linkPath: string;
  defaultColor?: string;
  activeColor?: string;
}

interface FooterBarProps {
  className?: string;
}

const menuList: FooterMenuItem[] = [
  {
    text: '이용약관',
    linkPath: 'terms',
  },
  {
    text: '개인정보보호방침',
    linkPath: 'privacy-policy',
  },
];

export default function FooterBar({ className }: FooterBarProps) {
  return (
    <footer
      className={cn(
        'fixed bottom-0 left-0 z-5 flex w-full items-center justify-between px-8 py-5',
        'max-sm:flex-col max-sm:items-start max-sm:gap-3 max-sm:px-6 max-sm:py-6',
        className
      )}
    >
      <ul className="flex">
        {menuList.map((menu, index) => (
          <li
            key={index}
            className={cn(
              'border-r border-[var(--gray-a5)] px-4',
              index === 0 && 'pl-0',
              index === menuList.length - 1 && 'border-r-0 pr-0'
            )}
          >
            <RadixLink asChild color="gray">
              <Link href={`/${menu.linkPath}`}>
                <span className="text-[12px] transition-opacity hover:opacity-80">{menu.text}</span>
              </Link>
            </RadixLink>
          </li>
        ))}
      </ul>
      <Text className="px-1 text-[12px] text-[var(--gray-9)]">© Zero Gravity. All rights reserved.</Text>
    </footer>
  );
}
