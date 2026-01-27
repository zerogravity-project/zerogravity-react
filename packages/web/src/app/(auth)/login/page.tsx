import { Text } from '@radix-ui/themes';

import { Logo } from '@zerogravity/shared/components/ui/logo';

import LoginButtons from './_components/LoginButtons';

/**
 * Login page
 * Implemented as Next.js 15 Server Component
 * Login buttons separated into Client Component for interaction handling
 */
export default function LoginPage() {
  return (
    <section className="pt-topnav-height flex h-[100dvh] w-[100dvw] items-center justify-center bg-[var(--background-dark)]">
      <div className="flex h-full w-full items-center justify-center px-5">
        <div className="max-mobile:border-none max-mobile:bg-transparent max-mobile:p-0 flex h-[50dvh] w-full max-w-[440px] flex-col justify-between gap-4 rounded-[4px] border border-[var(--gray-3)] bg-[var(--gray-1)] px-5 pt-12 pb-8">
          <div className="flex flex-col items-center gap-4">
            <Logo version="v2" width={240} />
            <Text size="2" weight="light" color="gray" align="center">
              Meditate and record your emotions
            </Text>
          </div>
          <LoginButtons />
        </div>
      </div>
    </section>
  );
}
