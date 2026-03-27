import EmotionRecord from '../_components/EmotionRecord';
import { EmotionRecordProvider } from '../_contexts/EmotionRecordContext';

interface MomentRecordPageProps {
  searchParams: Promise<{
    date?: string; // format: YYYY-MM-DD
  }>;
}

export default async function MomentRecordPage({ searchParams }: MomentRecordPageProps) {
  const { date } = await searchParams;
  const dateValue = date ?? null;

  return (
    <EmotionRecordProvider emotionRecordType="moment" date={dateValue}>
      <section className="mobile:px-5 absolute inset-0 flex h-[100dvh] w-[100dvw] flex-col items-center overflow-y-auto pt-[96px]">
        <EmotionRecord />
      </section>
    </EmotionRecordProvider>
  );
}
