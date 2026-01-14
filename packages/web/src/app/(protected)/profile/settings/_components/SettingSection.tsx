'use client';

import { Separator, Text } from '@radix-ui/themes';

import { useIsMobile } from '@zerogravity/shared/hooks';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function SettingSection({ title, children }: SettingSectionProps) {
  /*
   * --------------------------------------------
   * 1. Custom Hooks
   * --------------------------------------------
   */
  const isMobile = useIsMobile();

  /*
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-col gap-2">
        <Text size={isMobile ? '4' : '3'} weight="medium">
          {title}
        </Text>
        <Separator orientation="horizontal" size="4" />
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
