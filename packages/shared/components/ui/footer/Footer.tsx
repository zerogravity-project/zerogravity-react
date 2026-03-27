'use client';

import { ComponentType, Fragment } from 'react';

import { Link as RadixLink, Text } from '@radix-ui/themes';

import { cn } from '../../../utils/styleUtils';
import { LinkProps } from '../navigation/types/navigation.types';

import { FOOTER_MENU_ITEMS } from './constants/footer.constants';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface FooterProps {
  className?: string;
  LinkComponent?: ComponentType<LinkProps>;
}

/*
 * ============================================
 * Helper Components
 * ============================================
 */

const DefaultLink = ({ href, children, className, ...props }: LinkProps) => (
  <a {...props} href={href} className={className}>
    {children}
  </a>
);

/*
 * ============================================
 * Component
 * ============================================
 */

export function Footer({ className, LinkComponent = DefaultLink }: FooterProps) {
  return (
    <footer
      className={cn(
        'absolute bottom-0 left-0 z-5 flex w-full items-center justify-between px-8 pt-5 pb-[calc(1.25rem+var(--safe-area-bottom))]',
        'max-sm:flex-col max-sm:items-start max-sm:gap-2 max-sm:px-6 max-sm:pt-6 max-sm:pb-[calc(1.5rem+var(--safe-area-bottom))]',
        className
      )}
    >
      <ul className="flex items-center gap-2">
        {FOOTER_MENU_ITEMS.map((menu, index) => (
          <Fragment key={index}>
            <li>
              <RadixLink asChild color="gray" size="1">
                <LinkComponent href={menu.linkPath}>
                  <span className="text-[var(--gray-8)] transition-opacity hover:opacity-80">{menu.text}</span>
                </LinkComponent>
              </RadixLink>
            </li>

            {index !== FOOTER_MENU_ITEMS.length - 1 && (
              <li aria-hidden="true" role="presentation">
                <div className="mt-[3px] h-[3px] w-[3px] flex-shrink-0 rounded-[9999px] bg-[var(--gray-8)]" />
              </li>
            )}
          </Fragment>
        ))}
      </ul>
      <Text className="text-[var(--gray-9)]" weight="light" size="1">
        © Zero Gravity. All rights reserved.
      </Text>
    </footer>
  );
}
