import React from 'react';

import { cn } from '@/lib/utils';

import RadioButton from './RadioButton';

interface RadioOption {
  index: number;
  selection: string;
  color?: string;
  width?: string;
}

interface RadioButtonGroupProps {
  variant?: 'default' | 'font' | 'color' | 'object' | 'range';
  name: string;
  options: RadioOption[];
  selectedValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  variant = 'default',
  name,
  options,
  selectedValue,
  onChange,
  className = '',
}) => {
  const containerClasses = cn(
    'flex gap-4 flex-wrap',
    {
      'gap-2': variant === 'color' || variant === 'range',
      'gap-4': variant === 'font' || variant === 'object',
    },
    className
  );

  return (
    <div className={containerClasses}>
      {options.map(option => {
        const computedId = `${option.index}-${name}-${option.selection}`;
        const isChecked = selectedValue === computedId;

        return (
          <RadioButton
            key={computedId}
            variant={variant}
            name={name}
            index={option.index}
            selection={option.selection}
            width={option.width}
            color={option.color}
            isChecked={isChecked}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
};

export default RadioButtonGroup;
