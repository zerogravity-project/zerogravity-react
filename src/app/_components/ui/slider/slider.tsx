'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface SliderColorTokens {
  range?: string; // e.g. 'var(--green-9)'
  ring?: string; // e.g. 'var(--green-a8)'
  ringOffset?: string; // e.g. 'var(--green-4)'
}

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  value: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  colors: SliderColorTokens;
  onValueCommit?: (values: number[]) => void;
  className?: string;
}

export default function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  colors,
  onValueCommit,
  className,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      onValueCommit={onValueCommit}
      className={cn('relative flex w-full touch-none items-center select-none', className)}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-7.5 w-full grow overflow-hidden rounded-[9999px] bg-[var(--gray-a3)] inset-shadow-sm"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full"
          style={{ backgroundColor: colors.range ?? 'transparent' }}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            'ring-offset-background block h-7.5 w-7.5 rounded-[9999px] border-[0.08px] border-[rgba(0,0,0,0.2)] bg-white transition-colors disabled:pointer-events-none disabled:opacity-50',
            'shadow-[0px_6px_24px_0px_rgba(0,0,0,0.05)]',
            'focus-visible:ring-2 focus-visible:ring-offset-3 focus-visible:outline-none'
          )}
          style={{
            // Tailwind ring utilities read these CSS variables
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            ...(colors?.ring ? ({ ['--tw-ring-color' as any]: colors.ring } as React.CSSProperties) : {}),
            ...(colors?.ringOffset
              ? ({ ['--tw-ring-offset-color' as any]: colors.ringOffset } as React.CSSProperties)
              : {}),
          }}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
