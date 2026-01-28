'use client';

import { Button, Text } from '@radix-ui/themes';

import { useIsMobile } from '@zerogravity/shared/hooks';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface SettingActionProps {
  label: string;
  buttonText: string;
  variant?: 'soft' | 'solid' | 'outline' | 'ghost';
  color?: 'gray' | 'red' | 'blue' | 'green';
  onClick?: () => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function SettingAction({ label, buttonText, variant = 'soft', color = 'gray', onClick }: SettingActionProps) {
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
    <div className="flex items-center justify-between">
      <Text as="div" size={isMobile ? '3' : '2'} mb="1" weight="regular">
        {label}
      </Text>
      <Button variant={variant} color={color} radius="full" className="!w-[70px]" onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );
}
