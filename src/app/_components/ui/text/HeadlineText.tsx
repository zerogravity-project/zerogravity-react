'use client';

import { useRouter } from 'next/navigation';

import React from 'react';

import { cn } from '@/lib/utils';

import { ActionButton, LinkButton } from '../button';

interface ButtonConfig {
  variant?: 'main' | 'sub' | 'round' | 'kakao';
  state?: 'primary' | 'secondary' | 'tertiary' | 'mobile';
  backgroundColor?: string;
  textColor?: string;
  icon?: string;
  text?: string;
  linkPath?: string;
  onClick?: () => void;
}

interface LinkConfig {
  text: string;
  defaultColor?: string;
  activeColor?: string;
  fontSize?: number;
  isActive?: boolean;
  linkPath: string;
}

interface HeadlineTextProps {
  text: string;
  size?: 'l' | 'm';
  buttons?: ButtonConfig[];
  links?: LinkConfig[];
  className?: string;
}

const HeadlineText: React.FC<HeadlineTextProps> = ({ text, size = 'm', buttons = [], links = [], className = '' }) => {
  const router = useRouter();

  const handleClick = (linkPath?: string, callback?: () => void) => {
    if (linkPath) {
      // eslint-disable-next-line no-console
      console.log(`Navigating to: ${linkPath}`);
      router.push(linkPath);
    } else if (callback) {
      callback();
    }
  };

  // 사이즈별 스타일
  const getHeadlineSize = () => {
    switch (size) {
      case 'l':
        return 'text-3xl md:text-4xl'; // $title-font-size-xl-rem, 모바일에서 더 작게
      case 'm':
        return 'text-xl md:text-2xl'; // $title-font-size-s-rem
      default:
        return 'text-xl md:text-2xl';
    }
  };

  const containerClasses = cn('flex items-center justify-between w-full', className);

  const headlineClasses = cn('text-black font-semibold', getHeadlineSize());

  return (
    <div className={containerClasses}>
      <h2 className={headlineClasses}>{text}</h2>

      <div className="flex items-center">
        {buttons.length > 0 && (
          <div className="mr-5 flex items-center">
            {buttons.map((button, index) => (
              <ActionButton
                key={index}
                variant={button.variant || 'main'}
                backgroundColor={button.backgroundColor}
                textColor={button.textColor}
                icon={button.icon}
                text={button.text}
                onClick={() => handleClick(button.linkPath, button.onClick)}
              />
            ))}
          </div>
        )}

        {links.length > 0 && (
          <div className="flex items-center">
            {links.map((link, index) => (
              <LinkButton
                key={index}
                text={link.text}
                defaultColor={link.defaultColor}
                activeColor={link.activeColor}
                fontSize={link.fontSize}
                isActive={link.isActive}
                linkPath={link.linkPath}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadlineText;
