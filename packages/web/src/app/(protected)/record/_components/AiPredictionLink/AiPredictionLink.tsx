import { Text } from '@radix-ui/themes';
import { motion } from 'motion/react';

import { GeminiLogo } from '@zerogravity/shared/components/ui/logo';
import { cn } from '@zerogravity/shared/utils';

interface AiPredictionLinkProps {
  isLoaded?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function AiPredictionLink({ isLoaded = true, className, onClick }: AiPredictionLinkProps) {
  return (
    <div onClick={onClick} className={cn('flex items-center justify-center gap-2', className)}>
      <GeminiLogo width={12} />

      <Text className="cursor-pointer !text-[13px] !leading-[17px]" color="gray" weight="light">
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
          Skip and use AI Prediction with Gemini
        </motion.span>
      </Text>
    </div>
  );
}
