'use client';

import clsx from 'clsx';
import React from 'react';

type Variant = 'main' | 'sub' | 'round' | 'kakao';
type Tone = 'primary' | 'secondary' | 'tertiary' | 'mobile';
type Color = 'gray' | '' | undefined;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
  /** Vue의 state를 tone으로 매핑 (primary/secondary/tertiary/mobile) */
  tone?: Tone;
  /** round 변형에서만 쓰던 gray 보조 색상 */
  color?: Color;
  /** 머티리얼 아이콘 명 (Material Symbols Outlined) */
  icon?: string;
  /** 버튼 텍스트 */
  text?: string;
  /** 스타일 강제 오버라이드 */
  backgroundColor?: string;
  textColor?: string;
}

/** 동적 패딩 유틸 – Vue의 computed(dynamicPadding) 이식 */
function dynamicPadding(variant: Variant, hasIcon: boolean, hasText: boolean) {
  if (variant === 'sub') {
    if (hasIcon && hasText) return 'py-[var(--spacing-xxxs)] pr-[var(--spacing-s)] pl-[var(--spacing-xs)] gap-[6px]';
    if (hasIcon) return 'p-1'; // 4px
    if (hasText) return 'py-1 px-3'; // 4px 12px
  } else {
    if (hasIcon && hasText) return 'py-[var(--spacing-xxxs)] pr-[var(--spacing-s)] pl-[var(--spacing-xs)]';
  }
  return '';
}

export default function Button({
  variant,
  tone = 'primary',
  color,
  icon,
  text,
  className,
  backgroundColor,
  textColor,
  disabled,
  ...rest
}: ButtonProps) {
  const hasIcon = Boolean(icon);
  const hasText = Boolean(text);

  const base =
    // 공통 타이포/레이아웃 + ::before 오버레이 (SCSS 재현)
    'relative inline-flex items-center box-border overflow-hidden cursor-pointer ' +
    'font-semibold leading-6 tracking-[0.32px] ' +
    "before:content-[''] before:absolute before:-inset-[1px] before:rounded-[inherit] before:bg-transparent before:transition-colors";

  // variant 별 공통 프레임
  const byVariant: Record<Variant, string> = {
    main: clsx(
      'justify-center w-full gap-2 px-9',
      'rounded-[var(--radius-l)]',
      'text-[var(--text-btn-m)]',
      // secondary가 아닐 때만 hover 오버레이
      "[&_]:not([data-tone='secondary']):hover:before:bg-gray-opacity-30"
    ),
    sub: clsx(
      'gap-[2px] text-[14px] font-normal leading-6',
      'rounded-[var(--radius-xs)] border border-lightgray-300',
      'bg-white-900 text-black-900'
    ),
    round: clsx(
      'gap-1 p-[var(--spacing-xs)] rounded-[var(--radius-full)] text-white-opacity-50',
      '[&_.material-symbols-outlined]:text-[36px]'
    ),
    kakao: clsx(
      'justify-center w-full gap-2 h-[45px]',
      'rounded-[6px] border-0',
      'bg-kakao text-[#00000085] text-[15px]',
      'hover:before:bg-[#00000010]'
    ),
  };

  // tone (state) 별 스타일 (variant 컨텍스트에서 해석)
  const byTone = (() => {
    switch (variant) {
      case 'main': {
        return {
          primary: clsx(
            'bg-orange-900 text-white-900 border-0',
            'hover:before:bg-gray-opacity-30',
            disabled && 'border border-gray-opacity-10 text-gray-opacity-30 bg-gray-opacity-10'
          ),
          secondary: clsx(
            'bg-transparent text-orange-900 border border-orange-900',
            'hover:bg-orange-opacity-10',
            disabled && 'border-gray-opacity-30 text-gray-opacity-30'
          ),
          tertiary: clsx('bg-white-900 text-gray-700 border-0 rounded-[var(--radius-l)]'),
          mobile: '', // main에는 사용 안 함
        }[tone];
      }
      case 'sub': {
        return {
          primary: clsx(
            'border-darkorange-900 bg-orange-900 text-white-900',
            '[&_.text-area]:text-[var(--text-btn-s)] [&_.text-area]:font-normal'
          ),
          secondary: clsx(
            'border-lightgray-300 bg-white-900 text-black-900',
            'hover:bg-gray-opacity-10 hover:text-black-900',
            '[&_.text-area]:text-[var(--text-btn-s)] [&_.text-area]:font-normal'
          ),
          tertiary: '',
          mobile: clsx(
            'border-0 text-orange-900 rounded-[var(--radius-full)] bg-orange-opacity-10',
            '[&_.text-area]:text-[var(--text-content-s)] [&_.text-area]:font-normal'
          ),
        }[tone];
      }
      case 'round': {
        const common =
          tone === 'primary'
            ? clsx(
                'bg-orange-900 border-0',
                color === 'gray' && 'bg-gray-700',
                '[&_.text-area]:h-[var(--spacing-xl)] text-white-900'
              )
            : clsx(
                'bg-transparent border border-orange-900 text-orange-900',
                'hover:border-darkorange-900 hover:text-darkorange-900',
                color === 'gray' &&
                  'bg-transparent border-gray-700 text-gray-700 hover:border-black-900 hover:text-black-900',
                disabled && 'border-gray-opacity-30 text-gray-opacity-30'
              );
        return common;
      }
      case 'kakao':
        return ''; // kakao는 고정
    }
  })();

  // 동적 패딩 (Vue 로직 이식)
  const dynPad = dynamicPadding(variant, hasIcon, hasText);

  // style 오버라이드 (선택)
  const style: React.CSSProperties | undefined =
    backgroundColor || textColor ? { backgroundColor, color: textColor } : undefined;

  return (
    <button
      data-variant={variant}
      data-tone={tone}
      disabled={disabled}
      className={clsx(base, byVariant[variant], byTone, dynPad, className)}
      style={style}
      {...rest}
    >
      {/* Kakao icon (variant === 'kakao') */}
      {variant === 'kakao' && (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.55 3.47119C7.029 3.47119 3 6.50982 3 10.2581C3 12.5885 4.5585 14.6441 6.9315 15.8661L5.933 19.4264C5.8445 19.7416 6.2135 19.9923 6.4965 19.8096L10.8735 16.9901C11.2425 17.0246 11.618 17.045 11.55 17.045C16.9705 17.045 20.55 14.0058 20.55 10.2581C20.55 6.50982 16.9705 3.47119 11.55 3.47119Z"
            fill="black"
            fillOpacity="0.902"
          />
        </svg>
      )}

      {/* Icon (Material Symbols Outlined) */}
      {icon && (
        <span
          className="material-symbols-outlined z-[3]"
          style={textColor ? { color: textColor } : undefined}
          aria-hidden={!text}
        >
          {icon}
        </span>
      )}

      {/* Text */}
      {text && (
        <span className="text-area z-[3]" style={textColor ? { color: textColor } : undefined}>
          {text}
        </span>
      )}
    </button>
  );
}
