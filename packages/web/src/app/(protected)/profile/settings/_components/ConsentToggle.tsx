'use client';

import Link from 'next/link';

import { Switch, Text } from '@radix-ui/themes';

import { useIsMobile } from '@zerogravity/shared/hooks';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ConsentToggleProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  viewDetailUrl: string;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export function ConsentToggle({
  label,
  description,
  checked,
  disabled = false,
  onCheckedChange,
  viewDetailUrl,
}: ConsentToggleProps) {
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 flex-col gap-1">
          <Text size={isMobile ? '3' : '2'} weight="regular">
            {label}
          </Text>
          <Text size={isMobile ? '2' : '1'} color="gray" weight="light">
            {description}
          </Text>
        </div>
        <Switch checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} size="2" />
      </div>
      <Link href={viewDetailUrl} target="_blank">
        <Text size={isMobile ? '2' : '1'} color="blue" style={{ textDecoration: 'underline' }}>
          View Details
        </Text>
      </Link>
    </div>
  );
}
