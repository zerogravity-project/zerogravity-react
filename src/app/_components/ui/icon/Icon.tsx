import { Color } from '@/app/style/type';
import { cn } from '@/lib/utils';

interface IconProps {
  children: React.ReactNode;
  size?: string;
  color?: Color;
  className?: string;
}

export default function Icon({ children, size, color, className }: IconProps) {
  return (
    <span
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
