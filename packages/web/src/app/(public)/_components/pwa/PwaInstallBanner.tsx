/**
 * [PWA Install Banner]
 * Bottom banner prompting users to install the app
 * Chrome/Android: triggers native install prompt
 * iOS Safari: shows manual "Add to Home Screen" instructions
 */

'use client';

import Image from 'next/image';

import { Button, IconButton, Text } from '@radix-ui/themes';

import { Icon } from '@zerogravity/shared/components/ui/icon';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface PwaInstallBannerProps {
  isIOS: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export function PwaInstallBanner({ isIOS, onInstall, onDismiss }: PwaInstallBannerProps) {
  return (
    <div className="border-t border-[var(--gray-3)] bg-[var(--gray-1)] px-4 py-3">
      <div className="mx-auto flex max-w-[600px] items-center gap-3">
        {/* App Icon */}
        <Image src="/icon-192.png" alt="Zero Gravity" width={40} height={40} className="flex-shrink-0 rounded-[10px]" />

        {/* Text Content */}
        <div className="flex flex-1 flex-col gap-0.5">
          <Text size="2" weight="medium">
            Install Zero Gravity
          </Text>
          {isIOS ? (
            <Text size="1" weight="light" color="gray">
              Tap share
              {' ('}
              <Icon size={12} className="!mb-0.5 align-middle">
                ios_share
              </Icon>
              {') '}
              then &quot;Add to Home Screen&quot;
            </Text>
          ) : (
            <Text size="1" weight="light" color="gray">
              Add to home screen <span className="inline-block">for quick access</span>
            </Text>
          )}
        </div>

        {/* Actions */}
        {!isIOS && (
          <Button size="2" onClick={onInstall} className="flex-shrink-0">
            Install
          </Button>
        )}

        {/* Close Button */}
        <IconButton size="1" variant="ghost" color="gray" onClick={onDismiss} aria-label="Dismiss install banner">
          <Icon size={20} className="leading-none">
            close
          </Icon>
        </IconButton>
      </div>
    </div>
  );
}
