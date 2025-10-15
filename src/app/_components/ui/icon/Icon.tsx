import { cn } from '@/app/_utils/styleUtils';
import { Color } from '@/app/style/type';

interface IconProps {
  children: React.ReactNode;
  size?: number;
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
