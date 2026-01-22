import { cn } from '../../../utils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface IconProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  className?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function Icon({ children, size, color, className }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('material-symbols-outlined', className)}
      style={{
        fontSize: size,
        color: color ? `var(--${color}-9)` : undefined,
      }}
    >
      {children}
    </span>
  );
}
