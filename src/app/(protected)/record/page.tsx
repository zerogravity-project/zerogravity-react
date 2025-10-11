import EmotionRecord from './_components/EmotionRecord';
import { EmotionRecordProvider } from './_contexts/EmotionRecordContext';

export default function RecordPage() {
  return (
    <EmotionRecordProvider>
      <section className="mobile:px-5 absolute inset-0 flex h-[100dvh] w-[100dvw] flex-col items-center overflow-y-auto pt-[96px]">
        <EmotionRecord />
      </section>
    </EmotionRecordProvider>
  );
}
