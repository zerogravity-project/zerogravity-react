import { ButtonHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'kakao';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = [
      'inline-flex items-center justify-center gap-2',
      'font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'select-none',
    ];

    const variants = {
      primary: [
        'bg-orange-900 hover:bg-darkorange-900',
        'text-white-900',
        'border border-transparent',
        'focus:ring-orange-900/20',
        'shadow-sm hover:shadow-md',
      ],
      secondary: [
        'bg-gray-background hover:bg-lightgray-200',
        'text-black-900',
        'border border-lightgray-300',
        'focus:ring-gray-700/20',
      ],
      outline: [
        'bg-transparent hover:bg-lightgray-100',
        'text-gray-700 hover:text-black-900',
        'border border-lightgray-300 hover:border-gray-700',
        'focus:ring-gray-700/20',
      ],
      ghost: [
        'bg-transparent hover:bg-lightgray-100',
        'text-gray-700 hover:text-black-900',
        'border border-transparent',
        'focus:ring-gray-700/20',
      ],
      danger: [
        'bg-red-900 hover:bg-red-900/90',
        'text-white-900',
        'border border-transparent',
        'focus:ring-red-900/20',
        'shadow-sm hover:shadow-md',
      ],
      kakao: [
        'bg-kakao hover:bg-kakao/90',
        'text-black-900',
        'border border-transparent',
        'focus:ring-kakao/20',
        'shadow-sm hover:shadow-md',
      ],
    };

    const sizes = {
      sm: ['h-8 px-3', 'text-[var(--text-btn-s)]', 'rounded-[var(--radius-s)]', 'min-w-16'],
      md: ['h-10 px-4', 'text-[var(--text-btn-m)]', 'rounded-[var(--radius-m)]', 'min-w-20'],
      lg: ['h-12 px-6', 'text-[var(--text-btn-m)]', 'rounded-[var(--radius-l)]', 'min-w-24'],
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    const loadingStyles = loading ? 'cursor-wait opacity-70' : '';

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], widthStyles, loadingStyles, className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children && <span className={loading ? 'opacity-0' : ''}>{children}</span>}
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
