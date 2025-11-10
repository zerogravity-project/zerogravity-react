import { Text } from '@radix-ui/themes';
import { ReactNode } from 'react';

import { Icon } from '@zerogravity/shared/components/ui/icon';
import { cn } from '@zerogravity/shared/utils';

interface TopAppBarProps {
  className?: string;
  text: string;
  icon: string;
  border?: boolean;
  onClick: () => void;
  rightContent?: ReactNode;
}

export function TopAppBar({ className, text, icon, border, onClick, rightContent }: TopAppBarProps) {
  return (
    <div
      className={cn(
        'h-topnav-height flex w-full flex-shrink-0 items-center justify-between px-3',
        border && 'border-b border-[var(--gray-3)]',
        className
      )}
    >
      <div className="flex items-center gap-1">
        <button className="flex h-8 w-8 cursor-pointer items-center justify-center" onClick={onClick}>
          <Icon>{icon}</Icon>
        </button>
        <Text>{text}</Text>
      </div>

      {rightContent}
    </div>
  );
}
