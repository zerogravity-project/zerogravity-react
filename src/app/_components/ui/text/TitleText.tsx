import React from 'react';

import { cn } from '@/lib/utils';

interface TitleTextProps {
  titleText: string;
  subTitleText?: string;
  size?: 'l' | 'm' | 's';
  defaultPadding?: boolean;
  className?: string;
}

const TitleText: React.FC<TitleTextProps> = ({
  titleText,
  subTitleText = '',
  size = 'm',
  defaultPadding = true,
  className = '',
}) => {
  // 서브타이틀을 줄바꿈으로 분리
  const subTitleLines = subTitleText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line);

  // 사이즈별 스타일
  const getSizeStyles = () => {
    switch (size) {
      case 'l':
        return {
          container: 'gap-7', // 28px
          title: 'text-5xl', // $title-font-size-xxl-rem
          subTitle: 'text-xl', // $title-font-size-s-rem
          mobileTitleSize: 'md:text-5xl text-3xl', // mobile에서 더 작게
          mobileSubTitleSize: 'md:text-xl text-lg',
          mobilePadding: 'pt-25', // 100px
        };
      case 'm':
        return {
          container: 'gap-4', // 16px
          title: 'text-2xl', // $title-font-size-m-rem
          subTitle: 'text-base', // $text-font-size-m-rem
          mobileTitleSize: 'text-2xl',
          mobileSubTitleSize: 'text-base',
          mobilePadding: 'pt-12', // 48px
        };
      case 's':
        return {
          container: 'gap-4', // 16px
          title: 'text-xl', // $title-font-size-xs-rem
          subTitle: 'text-base', // $text-font-size-m-rem
          mobileTitleSize: 'text-xl',
          mobileSubTitleSize: 'text-base',
          mobilePadding: 'pt-12', // 48px
        };
      default:
        return {
          container: 'gap-4',
          title: 'text-2xl',
          subTitle: 'text-base',
          mobileTitleSize: 'text-2xl',
          mobileSubTitleSize: 'text-base',
          mobilePadding: 'pt-12',
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const containerClasses = cn(
    'flex flex-col justify-center items-center px-6',
    defaultPadding ? 'pt-30' : 'pt-0', // 120px
    sizeStyles.container,
    `md:pt-30 ${sizeStyles.mobilePadding}`, // 모바일에서 다른 패딩
    'md:px-6 px-4', // 모바일에서 더 작은 패딩
    className
  );

  const titleClasses = cn('text-center font-semibold text-black', sizeStyles.mobileTitleSize);

  const subTitleClasses = cn(
    'block text-center text-gray-600 leading-relaxed', // 160% line-height
    sizeStyles.mobileSubTitleSize
  );

  return (
    <header className={containerClasses}>
      <h1 className={titleClasses}>{titleText}</h1>
      {subTitleLines.length > 0 && (
        <h3 className="flex flex-col">
          {subTitleLines.map((line, index) => (
            <span key={index} className={subTitleClasses}>
              {line}
            </span>
          ))}
        </h3>
      )}
    </header>
  );
};

export default TitleText;
