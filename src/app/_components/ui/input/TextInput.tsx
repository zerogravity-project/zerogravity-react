import React from 'react';

import { cn } from '@/lib/utils';

interface TextInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  readonly?: boolean;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  value = '',
  onChange,
  placeholder = '',
  label = '레이블',
  readonly = false,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const wrapperClasses = cn('flex w-full h-full gap-2', 'max-sm:flex-col max-sm:items-start max-sm:gap-2', className);

  const labelClasses = cn(
    'w-[260px] text-[15px] text-gray-700',
    'max-sm:w-full max-sm:mb-1 max-sm:text-sm max-sm:leading-[15px]'
  );

  const inputClasses = cn(
    'w-full p-[15px] px-4 rounded-lg text-[15px] tracking-[-0.15px] box-border',
    'placeholder:text-gray-700 placeholder:text-sm placeholder:leading-[15px] placeholder:tracking-[-0.15px]',
    {
      'bg-gray-100 border border-gray-100 text-gray-700 cursor-default focus:outline-none': readonly,
      'bg-transparent border border-gray-300 text-gray-900': !readonly,
    }
  );

  return (
    <div className={wrapperClasses}>
      <label className={labelClasses}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readonly}
        className={inputClasses}
      />
    </div>
  );
};

export default TextInput;
