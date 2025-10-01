import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';

interface RadioButtonProps {
  variant?: 'default' | 'font' | 'color' | 'object' | 'range';
  name: string;
  index?: number;
  selection?: string;
  width?: string;
  isChecked?: boolean;
  color?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  variant = 'default',
  name,
  index = 0,
  selection = '',
  width = '',
  isChecked = false,
  color = '',
  value,
  onChange,
  className = '',
}) => {
  const computedId = useMemo(() => {
    if (['font', 'color', 'object', 'range'].includes(variant)) {
      return `${index}-${name}-${selection}`;
    }
    return `${index}-${name}-${variant}`;
  }, [variant, index, name, selection]);

  const surveyStyle = useMemo(() => {
    return width ? { width, height: width } : {};
  }, [width]);

  const handleChange = () => {
    onChange?.(computedId);
  };

  const labelClasses = cn(
    'radio-button cursor-pointer flex',
    {
      // Font variant
      'justify-center items-center w-[90px] h-[90px] text-2xl rounded-lg hover:bg-orange-50': variant === 'font',
      'text-gray-900': variant === 'font' && !isChecked,
      'bg-orange-50 border border-orange-600 text-orange-600': variant === 'font' && isChecked,

      // Color variant
      'justify-center items-center w-12 h-12': variant === 'color',

      // Object variant
      'justify-center items-center w-[90px] h-[90px] p-3 rounded-lg hover:bg-orange-50': variant === 'object',
      // 'bg-orange-50 border border-orange-600 text-orange-600': variant === 'object' && isChecked,

      // Range variant
      'justify-center items-center w-[25px] h-[25px] border-[1.5px] border-gray-300 rounded-full': variant === 'range',
      'bg-gray-700 border-none': variant === 'range' && isChecked,
    },
    className
  );

  const renderContent = () => {
    switch (variant) {
      case 'font':
        return <span style={{ fontFamily: selection }}>12:34</span>;

      case 'color':
        return <span className={cn('material-symbols-outlined text-white', { hidden: !isChecked })}>check</span>;

      case 'range':
        return <span className={cn('material-symbols-outlined text-white/50', { hidden: !isChecked })}>check</span>;

      case 'object':
        return <img src="/images/object.png" alt="" className="h-[74px] w-[74px]" />;

      default:
        return null;
    }
  };

  const labelStyle = {
    ...surveyStyle,
    ...(variant === 'range' ? { backgroundColor: color } : variant === 'color' ? { backgroundColor: selection } : {}),
  };

  return (
    <>
      <input
        type="radio"
        name={name}
        id={computedId}
        value={value || computedId}
        checked={isChecked}
        onChange={handleChange}
        className="hidden"
      />
      <label htmlFor={computedId} className={labelClasses} style={labelStyle}>
        {variant === 'color' && isChecked && <div className="absolute inset-0 h-12 w-12 bg-black/20" />}
        {renderContent()}
      </label>
    </>
  );
};

export default RadioButton;
