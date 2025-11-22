import { Text } from '@radix-ui/themes';

import { cn } from '../../../../../utils';
import { LinkProps } from '../../types/navigation.types';

interface MenuListItemProps {
  href: string;
  label: string;
  currentPath: string;
  LinkComponent: React.ComponentType<LinkProps>;
}

export function MenuListItem({ href, label, currentPath, LinkComponent }: MenuListItemProps) {
  const isActive = currentPath === href;

  return (
    <li className="w-full">
      <LinkComponent href={href}>
        <button
          className={cn(
            'flex w-full items-center gap-4 px-5 py-[18px] transition-colors',
            isActive
              ? 'bg-transparent text-[var(--accent-9)]'
              : 'cursor-pointer bg-transparent text-[var(--gray-9)] hover:bg-[var(--accent-a3)] hover:text-[var(--accent-9)]'
          )}
        >
          <Text size="3" weight={isActive ? 'regular' : 'light'}>
            {label}
          </Text>
        </button>
      </LinkComponent>
    </li>
  );
}
