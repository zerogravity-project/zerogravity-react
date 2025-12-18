'use client';

import { Text, TextField } from '@radix-ui/themes';

import { useIsMobile } from '@zerogravity/shared/hooks';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface SettingFieldProps {
  label: string;
  value: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'url'
    | 'tel'
    | 'search'
    | 'hidden';
  readOnly?: boolean;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export function SettingField({ label, value, type = 'text', readOnly = true }: SettingFieldProps) {
  /**
   * --------------------------------------------
   * 1. Custom Hooks
   * --------------------------------------------
   */
  const isMobile = useIsMobile();

  /**
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <label className="flex flex-col gap-1">
      <Text as="div" size={isMobile ? '3' : '2'} mb="1" weight="regular">
        {label}
      </Text>
      <TextField.Root
        size={isMobile ? '3' : '2'}
        readOnly={readOnly}
        variant="soft"
        color="gray"
        defaultValue={value}
        type={type}
      />
    </label>
  );
}
