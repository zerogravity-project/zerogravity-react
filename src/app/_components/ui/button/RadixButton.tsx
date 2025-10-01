import { Button } from '@radix-ui/themes';
import type { Responsive } from '@radix-ui/themes/dist/esm/props/prop-def.js';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface RadixButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  size: Responsive<'1' | '2' | '3' | '4'>;
  variant: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost';
  color?:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
  highContrast?: boolean;
  radius: 'none' | 'small' | 'medium' | 'large' | 'full';
  loading?: boolean;
  className?: string;
}

// forwardRef로
const RadixButton = forwardRef<HTMLButtonElement, RadixButtonProps>(
  ({ children, asChild, size, variant, color, highContrast, radius, loading, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        asChild={asChild}
        size={size}
        variant={variant}
        color={color}
        highContrast={highContrast}
        radius={radius}
        loading={loading}
        className={className}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

RadixButton.displayName = 'RadixButton';

export default RadixButton;
