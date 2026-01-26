'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@zerogravity/shared/utils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

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
  /** Accessible label for the slider */
  'aria-label'?: string;
  /** Human-readable value text (e.g., "Happy" instead of "67") */
  'aria-valuetext'?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function Slider({
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
  /*
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const [isFocused, setIsFocused] = React.useState(false);

  /*
   * --------------------------------------------
   * 2. Computed Values
   * --------------------------------------------
   */
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max]
  );

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
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
            'ring-offset-background block h-7.5 w-7.5 cursor-pointer rounded-[9999px] border-[0.08px] border-[rgba(0,0,0,0.2)] bg-white transition-all disabled:pointer-events-none disabled:opacity-50',
            'focus-visible:!outline-none'
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            boxShadow:
              isFocused && colors?.ring && colors?.ringOffset
                ? `0 0 0 3px ${colors.ringOffset}, 0 0 0 5px ${colors.ring}, 0px 6px 24px 0px rgba(0,0,0,0.05)`
                : '0px 6px 24px 0px rgba(0,0,0,0.05)',
          }}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
