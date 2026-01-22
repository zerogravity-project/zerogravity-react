import { Text } from '@radix-ui/themes';
import { Responsive } from '@radix-ui/themes/dist/esm/props/prop-def.js';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

import { GeminiLogo } from '@zerogravity/shared/components/ui/logo';
import { cn } from '@zerogravity/shared/utils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface GeminiButtonProps {
  children: ReactNode;
  isLoaded?: boolean;
  onClick?: () => void;
  logoSize?: number;
  textSize?: Responsive<'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'>;
  className?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function GeminiButton({
  children,
  isLoaded = true,
  onClick,
  logoSize = 14,
  textSize = '2',
  className,
}: GeminiButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('inline-flex cursor-pointer items-center justify-center gap-2 bg-transparent', className)}
      aria-label="View AI analysis"
    >
      <GeminiLogo width={logoSize} />

      <Text size={textSize} className="cursor-pointer" color="gray" weight="light">
        <motion.span
          className={'inline-block bg-[length:200%_100%] bg-clip-text text-[var(--gray-a7)] hover:underline'}
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--gray-a9) 0%, var(--gray-a9) 50%, white 80%, var(--gray-a9) 100%)',
            textDecorationColor: 'color-mix(in oklab, var(--accent-a5), var(--gray-a6))',
            textDecorationThickness: 'min(2px, max(1px, 0.05em))',
            textUnderlineOffset: 'calc(0.025em + 2px)',
          }}
          initial={{
            backgroundPosition: '200% 0',
          }}
          animate={
            isLoaded
              ? {
                  backgroundPosition: ['200% 0', '600% 0'],
                }
              : {
                  backgroundPosition: '200% 0',
                }
          }
          transition={{
            duration: 5,
            repeat: isLoaded ? Infinity : 0,
            ease: 'linear',
          }}
        >
          {children}
        </motion.span>
      </Text>
    </button>
  );
}
