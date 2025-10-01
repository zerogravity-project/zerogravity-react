'use client';

import Link from 'next/link';

import { Link as RadixLink } from '@radix-ui/themes';

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
    defaultColor: '#4E5968',
    activeColor: '#4E5968',
    linkPath: 'terms',
  },
  {
    text: '개인정보보호방침',
    defaultColor: '#4E5968',
    activeColor: '#4E5968',
    linkPath: 'privacy-policy',
  },
];

export default function FooterBar({ className }: FooterBarProps) {
  return (
    <footer className={cn('footer', className)}>
      <ul className="footer-menu">
        {menuList.map((menu, index) => (
          <li key={index} className="footer-item">
            <RadixLink asChild>
              <Link href={`/${menu.linkPath}`}>
                <span className="text-[12px] transition-opacity hover:opacity-80" style={{ color: menu.defaultColor }}>
                  {menu.text}
                </span>
              </Link>
            </RadixLink>
          </li>
        ))}
      </ul>
      <p className="copyright">© Zero Gravity. All rights reserved.</p>
    </footer>
  );
}
