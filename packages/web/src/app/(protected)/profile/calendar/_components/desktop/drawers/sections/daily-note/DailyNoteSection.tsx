import { Text } from '@radix-ui/themes';

interface DailyNoteSectionProps {
  diaryEntry?: string;
}
export default function DailyNoteSection({ diaryEntry }: DailyNoteSectionProps) {
  return (
    <section className="flex-co flex w-full px-4 py-6">
      <Text className="!text-[13px] !leading-[17px]">{diaryEntry}</Text>
    </section>
  );
}
