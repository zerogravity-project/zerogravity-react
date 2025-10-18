import Link from 'next/link';

import { Link as RadixLink, Text } from '@radix-ui/themes';

interface SectionTitleProps {
  title: string;
  linkText: string;
  href: string;
}

export default function SectionTitle({ title, linkText, href }: SectionTitleProps) {
  return (
    <div className="z-1 flex w-full items-center justify-between border-t border-b border-[var(--gray-3)] bg-[var(--gray-2)] px-4 py-[5px]">
      <Text className="!text-[13px] !leading-[17px]" color="gray">
        {title}
      </Text>

      <RadixLink asChild className="!text-[13px] !leading-[17px]">
        <Link href={href}>{linkText}</Link>
      </RadixLink>
    </div>
  );
}
