import { Logo } from '@zerogravity/shared/components/ui/logo';

import { ButtonSection } from './_components/ButtonSection';

/**
 * Login page
 * Implemented as Next.js 15 Server Component
 * Login buttons separated into Client Component for interaction handling
 */
export default function LoginPage() {
  return (
    <section className="pt-topnav-height flex h-[100dvh] w-[100dvw] items-center justify-center bg-[var(--background-dark)]">
      <div className="flex h-full w-full items-center justify-center px-5">
        <div className="max-mobile:border-none max-mobile:bg-transparent max-mobile:p-0 flex h-[55dvh] w-full max-w-[440px] flex-col items-center justify-between gap-4 rounded-[4px] border border-[var(--gray-3)] bg-[var(--gray-1)] px-5 pt-14 pb-8">
          <Logo version="v2" width={280} />
          <ButtonSection />
        </div>
      </div>
    </section>
  );
}
