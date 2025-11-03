import Link from 'next/link';

import { Link as RadixLink, Text } from '@radix-ui/themes';
import { Fragment } from 'react';

import { FOOTER_MENU_LIST } from '@zerogravity/shared/components/ui/footer';

export function DesktopMenuFooter() {
  return (
    <footer className="max-mobile:hidden flex w-full flex-col gap-1 border-t border-[var(--gray-3)] px-5 pt-2 pb-4">
      <ul className="flex items-center gap-2">
        {FOOTER_MENU_LIST.map((menu, index) => (
          <Fragment key={index}>
            <li>
              <RadixLink asChild color="gray" size="1">
                <Link href={`/${menu.linkPath}`}>
                  <span className="transition-opacity hover:opacity-80">{menu.text}</span>
                </Link>
              </RadixLink>
            </li>

            {index !== FOOTER_MENU_LIST.length - 1 && (
              <div className="mt-[3px] h-[3px] w-[3px] flex-shrink-0 rounded-[9999px] bg-[var(--gray-11)]" />
            )}
          </Fragment>
        ))}
      </ul>
      <Text className="!text-[11px] text-[var(--gray-9)]" weight="light" size="1">
        © Zero Gravity. All rights reserved.
      </Text>
    </footer>
  );
}
