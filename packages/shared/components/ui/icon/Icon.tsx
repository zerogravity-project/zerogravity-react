import { cn } from "../../../utils";


interface IconProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  className?: string;
}

export function Icon({ children, size, color, className }: IconProps) {
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
