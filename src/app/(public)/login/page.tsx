'use client';

import { Button, Text } from '@radix-ui/themes';

import { LogoSvg } from '@/app/_components/ui';
import { useIsMobile } from '@/app/_hooks/useMediaQuery';

export default function LoginPage() {
  const isMobile = useIsMobile();

  return (
    <section className="pt-topnav-height flex h-[100dvh] w-[100dvw] items-center justify-center bg-[var(--background-dark)]">
      <div className="flex h-full w-full items-center justify-center px-5">
        <div className="max-mobile:border-none max-mobile:bg-transparent max-mobile:p-0 flex h-[50dvh] w-full max-w-[440px] flex-col justify-between gap-4 rounded-[4px] border border-[var(--gray-3)] bg-[var(--gray-1)] px-5 pt-12 pb-8">
          <div className="flex flex-col items-center gap-4">
            <LogoSvg version="v2" width={240} />
            <Text size="2" weight="light" color="gray" align="center">
              Meditate and record your emotions
            </Text>
          </div>
          <div className="flex flex-col gap-4">
            <Button color="amber" size={isMobile ? '4' : '3'} variant="soft">
              Login With Kakao
            </Button>
            <Button color="blue" size={isMobile ? '4' : '3'} variant="soft">
              Login With Google
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
