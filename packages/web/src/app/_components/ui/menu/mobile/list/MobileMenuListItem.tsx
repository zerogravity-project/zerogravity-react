import { UrlObject } from 'url';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Text } from '@radix-ui/themes';

import { cn } from '@zerogravity/shared/utils';

interface MobileMenuListItemProps {
  href: string | UrlObject;
  label: string;
}

export function MobileMenuListItem({ href, label }: MobileMenuListItemProps) {
  const pathname = usePathname();

  const isActive =
    typeof href === 'string'
      ? pathname === href
      : pathname === (href as UrlObject).pathname && !(href as UrlObject).hash;
  const hasHash = typeof href === 'string' ? href.includes('#') : (href as UrlObject).hash;

  return (
    <li className="w-full">
      <Link href={href} scroll={hasHash ? false : true}>
        <button
          className={cn(
            'flex w-full items-center gap-4 px-5 py-[18px] transition-colors',
            isActive
              ? 'bg-transparent text-[var(--accent-9)]'
              : 'cursor-pointer bg-transparent text-[var(--gray-9)] hover:bg-[var(--accent-a3)] hover:text-[var(--accent-9)]'
          )}
        >
          {/* <Icon size={24}>{icon}</Icon> */}
          <Text size="3" weight={isActive ? 'regular' : 'light'}>
            {label}
          </Text>
        </button>
      </Link>
    </li>
  );
}
