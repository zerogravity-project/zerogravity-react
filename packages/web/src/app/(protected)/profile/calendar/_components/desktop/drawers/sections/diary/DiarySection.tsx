import { Text } from '@radix-ui/themes';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface DiarySectionProps {
  diaryEntry?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function DiarySection({ diaryEntry }: DiarySectionProps) {
  return (
    <section className="flex-co z-1 flex w-full bg-[var(--gray-1)] px-4 py-6">
      {diaryEntry ? (
        <Text as="p" className="!text-[13px] !leading-[17px]">
          {diaryEntry}
        </Text>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-1 py-3">
          <Text as="p" className="!text-[13px] !leading-[17px] !text-[var(--gray-a7)]" align="center">
            Unwritten thoughts...
          </Text>
        </div>
      )}
    </section>
  );
}
