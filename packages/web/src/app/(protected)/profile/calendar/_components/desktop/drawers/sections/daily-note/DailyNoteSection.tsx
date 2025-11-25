import { Text } from '@radix-ui/themes';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface DailyNoteSectionProps {
  diaryEntry?: string;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export default function DailyNoteSection({ diaryEntry }: DailyNoteSectionProps) {
  return (
    <section className="flex-co flex w-full px-4 py-6">
      <Text className="!text-[13px] !leading-[17px]">{diaryEntry}</Text>
    </section>
  );
}
