import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';

interface TextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  margin?: string;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  value = '',
  onChange,
  maxLength = 150,
  placeholder = '',
  margin = '0',
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const characterCount = useMemo(() => value.length, [value]);

  const containerClasses = cn('flex flex-col gap-2 w-full h-full', className);

  const textareaClasses = cn(
    'w-full h-full border-none outline-none resize-none',
    'text-gray-900 bg-transparent font-pretendard leading-[170%] font-normal',
    'text-lg box-border p-3 rounded-lg',
    'placeholder:text-gray-300 placeholder:text-lg placeholder:leading-6 placeholder:tracking-[-0.15px]',
    'max-sm:text-sm max-sm:placeholder:text-sm'
  );

  const charCountClasses = cn('text-orange-600 text-sm', 'max-sm:text-sm');

  return (
    <div className={containerClasses} style={{ margin, boxSizing: 'border-box' }}>
      <div className="flex h-full w-full flex-col">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={textareaClasses}
        />
      </div>
      <div className="flex justify-end">
        <p className={charCountClasses}>
          {characterCount} / {maxLength}
        </p>
      </div>
    </div>
  );
};

export default TextArea;
