'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Text } from '@radix-ui/themes';

import { useTheme } from '@zerogravity/shared/components/providers';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { cn } from '@zerogravity/shared/utils';

interface DesktopMenuListItemProps {
  href: string;
  icon: string;
  label: string;
}

export function DesktopMenuListItem({ href, icon, label }: DesktopMenuListItemProps) {
  const { accentColor } = useTheme();
  const pathname = usePathname();

  const isActive = pathname === href;

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
