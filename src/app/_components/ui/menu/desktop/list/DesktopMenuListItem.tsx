'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

import { useTheme } from '@/app/_components/providers/ThemeProvider';
import { cn } from '@/app/_utils/styleUtils';

import { Icon } from '../../../icon';

interface DesktopMenuListItemProps {
  href: string;
  icon: string;
  label: string;
}

export default function DesktopMenuListItem({ href, icon, label }: DesktopMenuListItemProps) {
  const { accentColor } = useTheme();
  const pathname = usePathname();

  const [basePath, setBasePath] = useState(pathname);

  useEffect(() => {
    // 모달이 아닌 실제 페이지 경로만 기억
    if (!pathname.includes('setting')) {
      setBasePath(pathname);
    }
  }, [pathname]);

  const isActive = basePath === href;

  return (
    <li className="w-full">
      <Link href={href}>
        <button
          className={cn(
            'flex w-full items-center gap-4 rounded-md p-2 transition-colors',
            isActive
              ? accentColor === 'amber'
                ? 'bg-[var(--accent-a9)] text-[var(--amber-contrast)]'
                : 'bg-[var(--accent-a9)] text-[var(--text-default)]'
              : 'cursor-pointer bg-transparent text-[var(--gray-9)] hover:bg-[var(--accent-a3)] hover:text-[var(--accent-9)]'
          )}
        >
          <Icon size={20}>{icon}</Icon>
          <Text size="2" weight={isActive ? 'medium' : 'regular'}>
            {label}
          </Text>
        </button>
      </Link>
    </li>
  );
}
