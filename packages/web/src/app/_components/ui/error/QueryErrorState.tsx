'use client';

import { Button, Text } from '@radix-ui/themes';

import { Icon } from '@zerogravity/shared/components/ui/icon';
import { cn } from '@zerogravity/shared/utils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface QueryErrorStateProps {
  onRetry: () => void;
  title?: string;
  description?: string;
  overlay?: boolean;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function QueryErrorState({
  onRetry,
  title = 'Failed to load data',
  description = 'Something went wrong. Please try again.',
  overlay = false,
}: QueryErrorStateProps) {
  return (
    <div
      role="presentation"
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        overlay ? 'absolute inset-0 z-100 bg-black/50 backdrop-blur-sm' : 'h-full w-full flex-1'
      )}
      onClick={e => overlay && e.stopPropagation()}
      onKeyDown={e => overlay && e.stopPropagation()}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <Text size="3" weight="medium" className="text-white">
          {title}
        </Text>
        <Text size="2" color="gray">
          {description}
        </Text>
      </div>
      <Button variant="soft" color="gray" onClick={onRetry}>
        <Icon>refresh</Icon>
        Try again
      </Button>
    </div>
  );
}
