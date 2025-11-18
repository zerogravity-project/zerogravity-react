'use client';

import { Text, TextArea } from '@radix-ui/themes';
import { useState } from 'react';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

export default function AiPredictionTextArea() {
  const [isFocused, setIsFocused] = useState(false);
  const { diaryEntry, setDiaryEntry, canGoNext } = useEmotionRecordContext();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 300) {
      return;
    }

    setDiaryEntry(e.target.value);
  };

  return (
    <div className="mobile:pb-12 max-mobile:px-2 flex h-full w-full max-w-[480px] flex-1 flex-col gap-3 pt-10 pb-3">
      <div className="relative h-full min-h-[150px] w-full">
        <TextArea
          value={diaryEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          placeholder="What made you feel this way? What happened today?"
          size="3"
          radius="full"
          className="!h-full !w-full !shadow-none [&_textarea]:!px-5 [&_textarea]:!py-3.5"
          color={!canGoNext && isFocused ? 'red' : undefined}
        />

        {!canGoNext && isFocused && (
          <Text color="red" size="1" className="absolute bottom-4.5 left-5 pr-[100px]">
            &#8251; Text has to be between 100 and 300 characters
          </Text>
        )}
        <Text
          color={!canGoNext && isFocused ? 'red' : 'gray'}
          className="absolute right-5 bottom-3.5 whitespace-nowrap"
        >
          {diaryEntry?.length ?? 0} / 300
        </Text>
      </div>
    </div>
  );
}
