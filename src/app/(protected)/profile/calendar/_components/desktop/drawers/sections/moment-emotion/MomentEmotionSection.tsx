import MomentEmotionList from './MomentEmotionList';

export default function MomentEmotionSection() {
  return (
    <section className="flex w-full flex-col items-center">
      <ul className="flex w-full flex-col items-center gap-6 pt-5 pr-4.5 pb-6 pl-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <MomentEmotionList
            key={index}
            emotionId={Math.floor(Math.random() * 7)}
            time={new Date().toISOString()}
            reasons={['Health', 'Fitness', 'Self-care']}
          />
        ))}
      </ul>
    </section>
  );
}
