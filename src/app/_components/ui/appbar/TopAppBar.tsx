import { Text } from '@radix-ui/themes';

import { cn } from '@/lib/utils';

import { Icon } from '../icon';

interface TopAppBarProps {
  className?: string;
  text: string;
  icon: string;
  onClick: () => void;
}

export default function TopAppBar({ className, text, icon, onClick }: TopAppBarProps) {
  return (
    <div className={cn('flex h-14 w-full items-center gap-1 px-3', className)}>
      <button className="flex h-8 w-8 cursor-pointer items-center justify-center" onClick={onClick}>
        <Icon>{icon}</Icon>
      </button>
      <Text>{text}</Text>
    </div>
  );
}
